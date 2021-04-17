import React from 'react';
import { base } from '@airtable/blocks';
import { Box, Select, Text } from '@airtable/blocks/ui';
import { Field, Table } from '@airtable/blocks/models';
import { selectAllowedTypes } from './utils';

function defaultSelectedField({
  fields,
  docupilot_field_name,
  defaultFieldId,
}: {
  fields: Array<Field>;
  docupilot_field_name: string;
  defaultFieldId: string;
}): Field {
  function _formatField(name: string): string {
    return name.toLowerCase().replace('_', '').replace(' ', '').toLowerCase();
  }
  docupilot_field_name = _formatField(docupilot_field_name);
  if (!fields) return null;
  let fieldToReturn;
  if (defaultFieldId) {
    fieldToReturn = fields.find((field) => field.id == defaultFieldId);
  }
  if (!fieldToReturn) {
    fieldToReturn = fields.find(
      (field) => _formatField(field.name) == docupilot_field_name,
    );
  }
  return fieldToReturn;
}

function CustomFieldPicker({
  docupilot_field_name,
  table,
  value,
  onSelection,
  allowed_field_types = null,
  updateLinkedTable = null,
  width = '50%',
}) {
  const allowed_fields = table
    ? allowed_field_types
      ? table.fields.filter((airtable_field) =>
          allowed_field_types.includes(airtable_field.type),
        )
      : table.fields
    : null;

  const best_match = defaultSelectedField({
    fields: allowed_fields,
    docupilot_field_name: docupilot_field_name,
    defaultFieldId: value,
  });
  const [selected_field, setSelectedField] = React.useState(best_match);

  // refreshing if selected field is empty and has a best match
  if (!selected_field && best_match) setSelectedField(best_match);

  if (!table) {
    return (
      <Select
        width={width}
        disabled={true}
        value={null}
        options={[{ value: null, label: '-' }]}
      />
    );
  }

  const options = [
    { value: null, label: '-' },
    ...allowed_fields.map((airtable_field) => ({
      value: airtable_field.id,
      label: airtable_field.name,
    })),
  ];

  onSelection(selected_field ? selected_field.id : null);
  if (updateLinkedTable != null) {
    updateLinkedTable(
      selected_field
        ? base.getTableById(selected_field.options.linkedTableId as string)
        : null,
    );
  }

  return (
    <Select
      width={width}
      value={selected_field ? selected_field.id : null}
      options={options}
      onChange={(newValue) => {
        let newField = newValue ? table.getFieldById(newValue) : null;
        setSelectedField(newField);
      }}
    />
  );
}

function MappingComponent({ docupilot_field, mapping, table, cb, level = 0 }) {
  const [linked_table, setLinkedTable] = React.useState(null);
  const has_child = docupilot_field.fields != null;
  // console.log('fmap', docupilot_field.name, mapping[docupilot_field.name]);
  if (!mapping) mapping = {};
  if (!mapping[docupilot_field.name])
    mapping[docupilot_field.name] = {
      __airtable_field__: null,
      __docupilot_type__: docupilot_field.type,
    };
  let mapping_value: DocupilotAirtable.MappingValue =
    mapping[docupilot_field.name];
  let main_component = (
    <Box display="flex" paddingY="8px" paddingLeft={level > 0 ? '10px' : null}>
      <Text width="50%" fontWeight="500">
        {docupilot_field.name}
      </Text>
      <CustomFieldPicker
        docupilot_field_name={docupilot_field.name}
        table={table}
        value={mapping_value.__airtable_field__}
        onSelection={(newValue) => {
          mapping_value.__airtable_field__ = newValue;
          cb(mapping_value);
        }}
        allowed_field_types={selectAllowedTypes(docupilot_field)}
        updateLinkedTable={has_child ? setLinkedTable : null}
      />
    </Box>
  );
  let child_components;
  if (has_child) {
    if (!mapping[docupilot_field.name].fields) {
      mapping[docupilot_field.name].fields = {};
    }
    // mapping_value.fields = mapping[docupilot_field.name].fields;
    let child_mapping = mapping[docupilot_field.name].fields;
    child_components = docupilot_field.fields.map((child_field, index) => {
      return (
        <MappingComponent
          key={index}
          docupilot_field={child_field}
          table={linked_table}
          level={level + 1}
          mapping={child_mapping}
          cb={(newValue) => {
            // mapping_value.fields[child_field.name] = newValue;
            child_mapping[child_field.name] = newValue;
            cb(mapping_value);
          }}
        />
      );
    });
    mapping_value.fields = child_mapping;
  }
  return (
    <Box
      borderLeft={level > 0 ? '1px solid #E5E5E5' : null}
      marginLeft={level > 1 ? '11px' : null}
    >
      {main_component}
      {child_components}
    </Box>
  );
}

export function SchemaComponent({
  schema,
  activeTable,
  mapping,
  updateMapping,
}: {
  schema: DocupilotAirtable.SchemaField[];
  activeTable: Table;
  mapping: DocupilotAirtable.Mapping;
  updateMapping: (key: string, value: DocupilotAirtable.MappingValue) => void;
}) {
  let count: number = 0;
  const mapping_components = schema.map((docupilot_field) => {
    return (
      <MappingComponent
        key={count++}
        docupilot_field={docupilot_field}
        table={activeTable}
        mapping={mapping}
        cb={(newValue) => updateMapping(docupilot_field.name, newValue)}
      />
    );
  });

  return (
    <Box marginY="24px">
      <Box display="flex" paddingY="16px">
        <Text width="50%" textColor="light">
          Docupilot fields
        </Text>
        <Text width="50%" textColor="light">
          Airtable fields/columns
        </Text>
      </Box>
      <Box>{mapping_components}</Box>
    </Box>
  );
}
