import React from 'react';
import {
  Box,
  Button,
  FieldPicker,
  Loader,
  Switch,
  Text,
  useBase,
  useCursor,
} from '@airtable/blocks/ui';
import { Field, FieldType, Record, Table } from '@airtable/blocks/models';
import { SchemaComponent } from './schema';
import { LoaderComponent } from './common';
import { ImageIcon } from './images';
import { getMergedData } from './utils';
import { generateDocument, getTemplateSchema } from './apicallouts';
import { Routes } from './routes';

export function TemplateMergeComponent({
  selectedTemplate,
  selectedRecordIds,
  setRoute,
  setPageContext,
  openList,
}) {
  const [save_as_attachment, setSaveAsAttachment] = React.useState<boolean>(
    false,
  );
  const [attachment_field, setAttachmentField] = React.useState<Field>(null);
  const [schema, setSchema] = React.useState<DocupilotAirtable.SchemaField[]>(
    null,
  );
  const [merge_in_progress, setMergeInProgress] = React.useState<boolean>(
    false,
  );
  const base = useBase();
  const cursor = useCursor();
  const active_table: Table = base.getTable(cursor.activeTableId);
  const mapping: DocupilotAirtable.Mapping = {};

  function updateMapping(key: string, value: DocupilotAirtable.MappingValue) {
    mapping[key] = value;
  }

  if (schema == null) {
    getTemplateSchema(selectedTemplate.id).then((response) => {
      if (response) {
        setSchema(response.data.schema);
      }
    });
  }

  return (
    <Box padding="24px">
      <Button icon="chevronLeft" variant="secondary" onClick={openList}>
        <Text fontWeight="500" textColor="light">
          back
        </Text>
      </Button>
      <Box
        marginY="12px"
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        <ImageIcon name={selectedTemplate.output_type} />
        <Text
          fontWeight="500"
          fontSize="14px"
          lineHeight="17px"
          marginLeft="8px"
        >
          {selectedTemplate.title}
        </Text>
      </Box>
      <Text as="p" textColor="light">
        You can insert values from Airtable records into your document by
        mapping the Airtable fields to Docupilot template tokens
      </Text>
      <Box marginY="12px">
        <Switch
          size="large"
          backgroundColor="transparent"
          value={save_as_attachment}
          label="Upload document to an attachment field"
          onChange={(newValue) => setSaveAsAttachment(newValue)}
        />
        <FieldPicker
          placeholder="Select field"
          disabled={!save_as_attachment}
          shouldAllowPickingNone={true}
          table={active_table}
          field={attachment_field}
          allowedTypes={[FieldType.MULTIPLE_ATTACHMENTS]}
          onChange={(newField) => setAttachmentField(newField)}
        />
      </Box>
      {schema ? (
        <SchemaComponent
          schema={schema}
          activeTable={active_table}
          updateMapping={updateMapping}
        />
      ) : (
        <LoaderComponent />
      )}

      <Button
        width="100%"
        variant="primary"
        disabled={!schema || merge_in_progress}
        onClick={() => {
          setMergeInProgress(true);
          active_table
            .selectRecordsAsync()
            .then((query) => {
              let merged_record_count = 0;
              let success_context: DocupilotAirtable.GeneratedDocument[] = [];
              selectedRecordIds.forEach((record_id) => {
                const record: Record = query.getRecordById(record_id);
                const record_name: string = record.name;
                // @ts-ignore
                const attachments: Array<{ url: string; filename: string }> =
                  (attachment_field && record.getCellValue(attachment_field)) ||
                  [];
                getMergedData(mapping, record)
                  .then((merged_data) => {
                    generateDocument(
                      selectedTemplate.id,
                      merged_data,
                      save_as_attachment,
                    )
                      .then((response) => {
                        merged_record_count++;
                        if (save_as_attachment && attachment_field) {
                          attachments.push({
                            url: response.data.file_url,
                            filename: response.data.file_name,
                          });
                          success_context.push({
                            airtable_record_name: record_name,
                            file_name: response.data.file_name,
                          });
                          active_table.updateRecordAsync(record, {
                            [attachment_field.id]: attachments,
                          });
                        }
                        if (merged_record_count == selectedRecordIds.length) {
                          setMergeInProgress(false);
                          setPageContext(success_context);
                          setRoute(Routes.mergeSuccess);
                        }
                      })
                      .catch((error) => {
                        console.log('error in generateDocument :: ', error);
                        setMergeInProgress(false);
                        setRoute(Routes.mergeFail);
                      });
                  })
                  .catch((error) => {
                    console.log('error in getMergedData :: ', error);
                    setMergeInProgress(false);
                    setRoute(Routes.mergeFail);
                  });
              });
              query.unloadData();
            })
            .catch((error) => {
              console.log('error listening to table selection :: ', error);
              setMergeInProgress(false);
              setRoute(Routes.mergeFail);
            });
        }}
      >
        {merge_in_progress ? (
          <Loader scale={0.3} fillColor="#fff" />
        ) : (
          <Text
            fontWeight="500"
            fontSize="14px"
            lineHeight="17px"
            textColor="white"
          >
            Create {selectedRecordIds.length} document
            {selectedRecordIds.length > 1 ? 's' : ''}
          </Text>
        )}
      </Button>
    </Box>
  );
}
