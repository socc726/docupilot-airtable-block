import React from 'react';
import { base } from '@airtable/blocks';
import { Box, Select, Text } from '@airtable/blocks/ui';
import { Field, Table } from '@airtable/blocks/models';
import { selectAllowedTypes } from './utils';
import { FieldOptions } from '@airtable/blocks/dist/types/src/types/field';

const dummyField: Field = {
  id: '-',
  name: '-',
  get options(): FieldOptions | null {
    return {
      linkedTableId: null,
    };
  },
} as Field; // try and remove this cast!

function defaultSelectedField({
  allowed_fields,
  docupilot_field_name,
  defaultFieldId,
}: {
  allowed_fields: Array<Field>;
  docupilot_field_name: string;
  defaultFieldId: string;
}): Field {
  // if (defaultFieldId == dummyField.id) return dummyField;
  function _formatField(name: string): string {
    return name.toLowerCase().replace('_', '').replace(' ', '').toLowerCase();
  }
  docupilot_field_name = _formatField(docupilot_field_name);
  if (!allowed_fields) return null;
  let fieldToReturn;
  if (defaultFieldId) {
    fieldToReturn = allowed_fields.find((field) => field.id == defaultFieldId);
  }
  if (!fieldToReturn) {
    fieldToReturn = allowed_fields.find(
      (field) => _formatField(field.name) == docupilot_field_name,
    );
  }
  return fieldToReturn ?? dummyField;
}

function updateParentForChildren(fn, lookup_field) {
  if (!fn) return;
  // Timeout is required as the update shouldn't be triggered while CustomSelectField is still rendering
  setTimeout(() => {
    fn(
      lookup_field
        ? base.getTableByIdIfExists(
            lookup_field.options.linkedTableId as string,
          )
        : null,
    );
  }, 0);
}

function CustomFieldPicker({
  docupilot_field_name,
  table,
  value,
  onSelection,
  allowed_field_types = null,
  updateLinkedTable = null,
  width = '50%',
  readonly,
}) {
  const allowed_fields: Field[] = table
    ? allowed_field_types
      ? table.fields.filter((airtable_field) =>
          allowed_field_types.includes(airtable_field.type),
        )
      : table.fields
    : [];

  allowed_fields.unshift(dummyField);
  const best_match = defaultSelectedField({
    allowed_fields: allowed_fields,
    docupilot_field_name: docupilot_field_name,
    defaultFieldId: value,
  });
  const [allow_dummy, setAllowDummy] = React.useState<boolean>(false);
  const [selected_field, setSelectedField] = React.useState<Field>(best_match);

  if (readonly) {
    const selected_readonly_field =
      table?.getFieldByIdIfExists(value) ?? dummyField;
    updateParentForChildren(updateLinkedTable, selected_readonly_field);
    return (
      <Select
        width={width}
        disabled={true}
        value={selected_readonly_field?.id}
        options={[
          {
            value: selected_readonly_field?.id,
            label: selected_readonly_field?.name,
          },
        ]}
      />
    );
  }

  if (selected_field.id != dummyField.id) {
    // refreshing if field has a selected value that is stale (happens when parent is changed)}
    if (!allowed_fields.find((field) => field.id === selected_field.id)) {
      setSelectedField(best_match);
    }
  } else if (!allow_dummy) {
    // refreshing if selected field is empty and has a best match
    if (best_match.id != dummyField.id) {
      setSelectedField(best_match);
    }
  }

  if (!table) {
    // Applicable only for child mappings
    //  if parent field is not mapped child fields
    //  will not have a table to lookup fields from
    return (
      <Select
        width={width}
        disabled={true}
        value={dummyField.id}
        options={[{ value: dummyField.id, label: dummyField.name }]}
      />
    );
  }

  onSelection(selected_field.id);
  updateParentForChildren(updateLinkedTable, selected_field);

  return (
    <Select
      width={width}
      value={selected_field ? selected_field.id : null}
      options={allowed_fields.map((airtable_field) => ({
        value: airtable_field.id,
        label: airtable_field.name,
      }))}
      onChange={(newValue) => {
        let newField = table.getFieldByIdIfExists(newValue) ?? dummyField;
        setAllowDummy(true);
        setSelectedField(newField);
      }}
    />
  );
}

function MappingComponent({
  docupilot_field,
  mapping,
  table,
  readonly,
  level = 0,
}) {
  const [linked_table, setLinkedTable] = React.useState(null);
  const has_child = docupilot_field.fields != null;
  if (!mapping[docupilot_field.name]) {
    mapping[docupilot_field.name] = {
      __airtable_field__: null,
      __docupilot_type__: docupilot_field.type,
    };
  }
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
        }}
        allowed_field_types={selectAllowedTypes(docupilot_field)}
        updateLinkedTable={has_child ? setLinkedTable : null}
        readonly={readonly}
      />
    </Box>
  );
  let child_components;
  if (has_child) {
    if (!mapping[docupilot_field.name].fields) {
      mapping[docupilot_field.name].fields = {};
    }
    child_components = docupilot_field.fields.map((child_field, index) => {
      return (
        <MappingComponent
          key={index}
          docupilot_field={child_field}
          table={linked_table}
          level={level + 1}
          readonly={readonly}
          mapping={mapping[docupilot_field.name].fields}
        />
      );
    });
    // mapping_value.fields = child_mapping;
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
  readonly,
}: {
  schema: DocupilotAirtable.SchemaField[];
  activeTable: Table;
  mapping: DocupilotAirtable.Mapping;
  readonly: boolean;
}) {
  let count: number = 0;
  const mapping_components = schema.map((docupilot_field) => {
    return (
      <MappingComponent
        key={count++}
        docupilot_field={docupilot_field}
        table={activeTable}
        mapping={mapping}
        readonly={readonly}
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
