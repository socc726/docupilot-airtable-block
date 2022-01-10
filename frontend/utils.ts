import { useCursor, useLoadable, useWatchable } from '@airtable/blocks/ui';
import { Record } from '@airtable/blocks/models';
import { RecordId } from '@airtable/blocks/types';
import { docupilot_to_airtable_field_mapping } from './constants';
import { globalConfig } from '@airtable/blocks';
import { generateDocument } from './apicallouts';

export function useSelectedRecordIds(): Array<RecordId> {
  const cursor = useCursor();
  // load selected records
  useLoadable(cursor);
  // re-render whenever the list of selected records changes
  useWatchable(cursor, ['selectedRecordIds']);
  // render the list of selected record ids
  return cursor.selectedRecordIds;
}

async function mergeData(
  key: string,
  mappingValue: DocupilotAirtable.RuntimeMappingValue,
  record: Record,
) {
  const airtable_field = mappingValue.af;
  const docupilot_type = mappingValue.docupilot_type;

  if (airtable_field == null || airtable_field == '-') {
    return null;
  } else if (docupilot_type == 'string' || docupilot_type == 'generic') {
    return record.getCellValueAsString(airtable_field);
  }

  if (mappingValue.fs != null) {
    const data_list = [];
    const linked_query_result = await record.selectLinkedRecordsFromCellAsync(
      airtable_field,
    );
    const linked_records =
      docupilot_type == 'object'
        ? linked_query_result.records.slice(0, 1)
        : linked_query_result.records;
    for (const linked_record of linked_records) {
      const data = {};
      for (const [key, value] of Object.entries(mappingValue.fs)) {
        const child_merged_data = await mergeData(key, value, linked_record);
        if (child_merged_data != null) {
          data[key] = child_merged_data;
        }
      }
      if (Object.keys(data).length != 0) {
        data_list.push(data);
      }
    }
    linked_query_result.unloadData();
    return docupilot_type == 'object'
      ? data_list[0]
      : data_list.length
      ? data_list
      : null;
  }

  console.warn(
    "getting cell value directly as it didn't match any known type",
    key,
    docupilot_type,
    mappingValue,
    record,
  );
  return record.getCellValue(airtable_field);
}

export async function getMergedData(
  runtime_mapping: DocupilotAirtable.RuntimeMapping,
  record: Record,
) {
  const data = {};
  for (const [key, value] of Object.entries(runtime_mapping)) {
    const merged_data = await mergeData(key, value, record);
    console.info(`merged_data for ${key}`, merged_data);
    if (merged_data != null) {
      data[key] = merged_data;
    }
  }
  return data;
}

export function selectAllowedTypes(
  schema_field: DocupilotAirtable.SchemaField,
): Array<string> {
  if (schema_field.type == 'array' && schema_field.generics != 'string') {
    return docupilot_to_airtable_field_mapping[schema_field.generics];
  }
  return docupilot_to_airtable_field_mapping[schema_field.type];
}

function getConfigPath(tableId: string, templateId: string, scope: string) {
  return [`table#${tableId}`, `template#${templateId.toString()}`, scope];
}

export function getMappedTemplates(tableId: string): number[] {
  return Object.keys(globalConfig.get([`table#${tableId}`]) ?? {}).map(
    (_) => +_.split('#')[1], // 'template#123' -> 123
  );
}

export function loadMapping(
  tableId: string,
  templateId: string,
): { mapping: DocupilotAirtable.Mapping; attachment_field_id: string } {
  const mapping = JSON.parse(
    (globalConfig.get(
      getConfigPath(tableId, templateId, 'mapping'),
    ) as string) || '{}',
  ) as DocupilotAirtable.Mapping;
  const attachment_field_id = globalConfig.get(
    getConfigPath(tableId, templateId, 'attach'),
  ) as string;
  return { mapping, attachment_field_id };
}

export function saveMapping(
  tableId: string,
  templateId: string,
  mapping: DocupilotAirtable.Mapping,
  attachment_field_id: string,
) {
  const stringified_mapping = JSON.stringify(mapping);
  globalConfig
    .setPathsAsync([
      {
        path: getConfigPath(tableId, templateId, 'mapping'),
        value: stringified_mapping,
      },
      {
        path: getConfigPath(tableId, templateId, 'attach'),
        value: attachment_field_id,
      },
    ])
    .then(() =>
      console.info(
        `mapping saved with mapping: ${stringified_mapping} and attachment_field: ${attachment_field_id}`,
      ),
    );
}

export async function executeDocumentGeneration({
  query,
  schema,
  selectedRecordIds,
  attachment_field,
  mapping,
  selectedTemplate,
  onProgress,
}): Promise<{ [key: string]: DocupilotAirtable.GeneratedDocument }> {
  let generateDocuments = {};
  const runtime_mapping = toRuntimeMapping(schema, mapping);

  // splitting into to batches of 5 records
  let batches = [];
  while (selectedRecordIds.length) {
    batches.push(selectedRecordIds.splice(0, 5));
  }

  // iterating each batch
  for (let batch of batches) {
    const promises = batch.map(async (record_id) => {
      const record: Record = query.getRecordById(record_id);
      const merged_data = await getMergedData(runtime_mapping, record);
      const response = await generateDocument(
        selectedTemplate.id,
        merged_data,
        !!attachment_field,
      );
      generateDocuments[record.id] = {
        record_name: record.name,
        file_name: response.file_name,
        url: attachment_field ? response.file_url : null,
      };
      onProgress(Object.keys(generateDocuments).length);
    });
    // waiting for batch to finish
    await Promise.all(promises);
  }
  return generateDocuments;
}

export function removeMissingFieldsFromMapping({
  mapping,
  schema,
}: {
  schema: DocupilotAirtable.SchemaField[];
  mapping: DocupilotAirtable.Mapping;
}) {
  const schema_field_names = schema.map(
    (docupilot_field) => docupilot_field.name,
  );
  for (let mapping_field_name of Object.keys(mapping)) {
    const index = schema_field_names.indexOf(mapping_field_name);
    if (index == -1) {
      // if schema doesn't have this field anymore
      delete mapping[mapping_field_name];
    } else if (mapping[mapping_field_name].fs) {
      if (schema[index].fields) {
        // if the field is still object/list as per the schema
        removeMissingFieldsFromMapping({
          mapping: mapping[mapping_field_name].fs,
          schema: schema[index].fields,
        });
      } else {
        // if field is not object/list anymore in schema
        delete mapping[mapping_field_name];
      }
    }
  }
}

function toRuntimeMapping(
  schema: DocupilotAirtable.SchemaField[],
  mapping: DocupilotAirtable.Mapping,
): DocupilotAirtable.RuntimeMapping {
  const runtime_mapping: DocupilotAirtable.RuntimeMapping = {};
  const schema_field_names = schema.map(
    (docupilot_field) => docupilot_field.name,
  );
  for (let mapping_field_name of Object.keys(mapping)) {
    const index = schema_field_names.indexOf(mapping_field_name);
    // update docupilot field type from mapping
    const mapping_value: DocupilotAirtable.MappingValue =
      mapping[mapping_field_name];
    const fields: DocupilotAirtable.RuntimeMapping = mapping_value.fs
      ? toRuntimeMapping(schema[index].fields, mapping_value.fs)
      : null;
    runtime_mapping[mapping_field_name] = {
      fs: fields,
      af: mapping_value.af,
      docupilot_type: schema[index].type,
    };
  }
  return runtime_mapping;
}
