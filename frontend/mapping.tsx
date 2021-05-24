import React from 'react';
import {
  Box,
  Button,
  colors,
  FieldPicker,
  Loader,
  Switch,
  Text,
  useBase,
  useCursor,
  useGlobalConfig,
} from '@airtable/blocks/ui';
import { Field, FieldType, Record, Table } from '@airtable/blocks/models';
import { SchemaComponent } from './schema';
import { LoaderComponent } from './common';
import { ImageIcon } from './images';
import {
  executeDocumentGeneration,
  loadMapping,
  removeMissingFieldsFromMapping,
  saveMapping,
} from './utils';
import { getTemplateSchema } from './apicallouts';
import { Routes } from './routes';

export function TemplateMergeComponent({
  selectedTemplate,
  selectedRecordIds,
  setRoute,
  setGeneratedDocuments,
  openList,
}) {
  const base = useBase();
  const cursor = useCursor();
  const globalConfig = useGlobalConfig();

  const active_table: Table = base.getTable(cursor.activeTableId);
  const { mapping, attachment_field_id } = loadMapping(
    cursor.activeTableId,
    selectedTemplate.id.toString(),
  );
  const [save_as_attachment, setSaveAsAttachment] = React.useState<boolean>(
    !!attachment_field_id,
  );
  const [attachment_field, setAttachmentField] = React.useState<Field>(
    active_table.getFieldByIdIfExists(attachment_field_id),
  );
  const [schema, setSchema] =
    React.useState<DocupilotAirtable.SchemaField[]>(null);
  const [documents_merged, setDocumentsMerged] = React.useState<number>(null);

  const canSetPaths = globalConfig.checkPermissionsForSetPaths().hasPermission;

  // if configured to save as attachment and user doesn't have editor permission
  //  merge shouldn't be allowed
  const canMerge =
    !save_as_attachment || globalConfig.checkPermissionsForSet().hasPermission;

  const [error, setError] = React.useState<string>(
    canMerge
      ? null
      : `You need editor or higher permissions to create this document
        as it requires to be attached to the field "${attachment_field.name}"`,
  );

  if (!schema) {
    getTemplateSchema(selectedTemplate.id).then((response) => {
      if (response) {
        setSchema(response.data.schema);
      }
    });
  }

  if (schema && mapping) {
    removeMissingFieldsFromMapping({ mapping, schema });
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
          disabled={!canSetPaths}
          value={save_as_attachment}
          label="Upload document to an attachment field"
          onChange={(newValue) => setSaveAsAttachment(newValue)}
        />
        <FieldPicker
          placeholder="Select field"
          disabled={!canSetPaths || !save_as_attachment}
          shouldAllowPickingNone={true}
          table={active_table}
          field={attachment_field}
          allowedTypes={[FieldType.MULTIPLE_ATTACHMENTS]}
          onChange={(newField) => {
            setAttachmentField(newField);
            setError(null);
          }}
        />
      </Box>
      {schema ? (
        <SchemaComponent
          schema={schema}
          activeTable={active_table}
          mapping={mapping}
          readonly={!canSetPaths}
        />
      ) : (
        <LoaderComponent />
      )}
      {error ? (
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          paddingBottom={'4px'}
        >
          <Text alignContent={'center'} textColor={colors.RED}>
            {error}
          </Text>
        </Box>
      ) : (
        <></>
      )}
      <Button
        width="100%"
        variant="primary"
        disabled={!schema || documents_merged != null || !canMerge}
        onClick={async () => {
          if (save_as_attachment && !attachment_field) {
            setError('"Upload to" field is not selected');
            return;
          }
          if (canSetPaths) {
            saveMapping(
              cursor.activeTableId,
              selectedTemplate.id.toString(),
              mapping,
              save_as_attachment ? attachment_field?.id : null,
            );
          }
          setDocumentsMerged(0);
          const queryResult = await active_table.selectRecordsAsync();
          try {
            const generatedDocuments = await executeDocumentGeneration({
              query: queryResult,
              schema: schema,
              attachment_field: save_as_attachment ? attachment_field : null,
              selectedRecordIds: selectedRecordIds.slice(),
              mapping: mapping,
              selectedTemplate: selectedTemplate,
              onProgress: setDocumentsMerged,
            });
            if (save_as_attachment) {
              for (let record_id of selectedRecordIds) {
                const record: Record = queryResult.getRecordById(record_id);
                // @ts-ignore
                const attachments: {
                  url: string;
                  filename: string;
                }[] =
                  (attachment_field
                    ? record.getCellValue(attachment_field)
                    : []) ?? [];
                const generated_document = generatedDocuments[record.id];
                attachments.push({
                  url: generated_document.url,
                  filename: generated_document.file_name,
                });
                await active_table.updateRecordAsync(record, {
                  [attachment_field.id]: attachments,
                });
              }
            }
            setDocumentsMerged(null);
            setGeneratedDocuments(Object.values(generatedDocuments));
            setRoute(Routes.mergeSuccess);
          } catch (error) {
            console.error('error generating document :: ', error);
            setDocumentsMerged(null);
            setRoute(Routes.mergeFail);
          } finally {
            queryResult.unloadData();
          }
        }}
      >
        {documents_merged != null ? (
          <Box display="flex">
            <Loader scale={0.3} fillColor="#fff" />
            <Text
              fontWeight="500"
              fontSize="14px"
              lineHeight="17px"
              textColor="white"
              marginLeft="12px"
            >
              Generating {documents_merged}/{selectedRecordIds.length} documents
            </Text>
          </Box>
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
