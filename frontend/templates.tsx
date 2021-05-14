import React from 'react';
import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  useBase,
  useCursor,
} from '@airtable/blocks/ui';
import { ImageIcon } from './images';
import { getMappedTemplates } from './utils';
import { Table } from '@airtable/blocks/models';

function TemplateItem({
  template,
  select,
}: {
  template: DocupilotAirtable.Template;
  select: () => void;
}) {
  return (
    <Box
      paddingX="22px"
      paddingY="8px"
      display="flex"
      flexDirection="row"
      style={{ cursor: 'pointer' }}
      hasOnClick={true}
      borderBottom="1px solid #E5E5E5"
      alignItems="center"
      onClick={select}
    >
      <ImageIcon name={template.output_type} />
      <Text
        fontWeight={500}
        fontSize="14px"
        lineHeight="17px"
        marginLeft="12px"
      >
        {template.title}
      </Text>
    </Box>
  );
}

export function TemplateListComponent({
  templates,
  selectTemplate,
  refreshTemplates,
}: {
  templates: DocupilotAirtable.Template[];
  selectTemplate: (template: DocupilotAirtable.Template) => void;
  refreshTemplates: () => void;
}) {
  const base = useBase();
  const cursor = useCursor();
  const active_table: Table = base.getTable(cursor.activeTableId);

  const [search_term, setSearchTerm] = React.useState<string>('');
  let filtered_templates: DocupilotAirtable.Template[] = !search_term
    ? templates
    : templates.filter((_t) =>
        _t.title.toLowerCase().includes(search_term.toLowerCase()),
      );

  const templates_with_mapping = getMappedTemplates(active_table.id);

  const frequently_used_templates = filtered_templates.filter(
    (template) => templates_with_mapping.indexOf(template.id) !== -1,
  );

  const all_other_templates = filtered_templates.filter(
    (template) => templates_with_mapping.indexOf(template.id) === -1,
  );

  const to_render = [];
  if (frequently_used_templates.length) {
    to_render.push({
      name: 'Frequently used templates with this table',
      templates: frequently_used_templates,
    });
  }
  to_render.push({
    name: frequently_used_templates.length ? 'All other templates' : null,
    templates: all_other_templates,
  });

  return (
    <Box paddingY={4}>
      <Box display="flex" marginX="24px" marginBottom="16px">
        <Heading as="h3" flex={1}>
          Select a Docupilot template
        </Heading>
        <Button
          aria-label="sync-templates"
          variant="secondary"
          onClick={refreshTemplates}
          style={{
            paddingTop: '6px',
          }}
        >
          <ImageIcon name="sync" />
        </Button>
      </Box>
      <Input
        marginX="24px"
        marginY="12px"
        width="calc( 100% - 48px )"
        value={search_term}
        placeholder="Search templates"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {to_render.map((folder, idx) => (
        <Box key={idx}>
          {folder.templates.map((template) => (
            <TemplateItem
              key={template.id}
              template={template}
              select={() => selectTemplate(template)}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}
