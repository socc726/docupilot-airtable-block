import React from 'react';
import { Box, Button, Heading, Input, Text } from '@airtable/blocks/ui';
import { ImageIcon } from './images';

function TemplateItem({ template, select }) {
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
      onClick={() => select(template)}
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
}) {
  const [search_term, setSearchTerm] = React.useState<string>('');
  let filtered_templates: DocupilotAirtable.Template[] = !search_term
    ? templates
    : templates.filter((_t) =>
        _t.title.toLowerCase().includes(search_term.toLowerCase()),
      );

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
      <dl>
        {filtered_templates.map((template) => (
          <TemplateItem
            key={template.id}
            template={template}
            select={() => selectTemplate(template)}
          />
        ))}
      </dl>
    </Box>
  );
}
