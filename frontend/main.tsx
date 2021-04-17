import React from 'react';
import { RecordId } from '@airtable/blocks/types';
import { getSelectedRecordIds } from './utils';
import { getTemplates } from './apicallouts';
import { TemplateComponent } from './templates';
import { LoaderComponent } from './common';
import { Box, Icon, Text } from '@airtable/blocks/ui';
import {
  MergeFailInfo,
  MergeSuccessInfo,
  NoSelectionInfo,
  NoTemplatesInfo,
} from './info';
import { Routes } from './routes';

export function MainComponent() {
  const [route, setRoute] = React.useState<Routes>(Routes.templatesList);
  const [page_context, setPageContext] = React.useState<
    DocupilotAirtable.GeneratedDocument[]
  >([]);
  const [templates, setTemplates] = React.useState<
    DocupilotAirtable.Template[]
  >([]);
  const [
    selected_template,
    setSelectedTemplate,
  ] = React.useState<DocupilotAirtable.Template>(null);
  const selected_record_ids: Array<RecordId> = getSelectedRecordIds();

  function refreshTemplates() {
    getTemplates().then((response) => {
      if (response) {
        setTemplates(response.data);
      }
    });
  }

  // TODO decide if this and above refreshTemplates function
  //  should be pushed inside templatesList switch case!
  if (templates == null) {
    refreshTemplates();
    return <LoaderComponent />;
  }
  switch (route) {
    case Routes.templatesList:
      if (!selected_record_ids.length) return <NoSelectionInfo />;
      if (!templates) return <NoTemplatesInfo />;
      return (
        <TemplateComponent
          templates={templates}
          refreshTemplates={refreshTemplates}
          selected_template={selected_template}
          selectTemplate={setSelectedTemplate}
          selected_record_ids={selected_record_ids}
          setRoute={setRoute}
          setPageContext={setPageContext}
        />
      );
    case Routes.mergeSuccess:
      return (
        <MergeSuccessInfo
          merge_context={(page_context || []).map((c, index) => (
            <GeneratedDocument generatedDocument={c} key={index} />
          ))}
          setSelectedTemplate={setSelectedTemplate}
          setRoute={setRoute}
        />
      );
    case Routes.mergeFail:
      return (
        <MergeFailInfo
          errorMessage={''}
          setRoute={setRoute}
          setSelectedTemplate={setSelectedTemplate}
        />
      );
    default:
      return <LoaderComponent />;
  }
}

function GeneratedDocument({
  key,
  generatedDocument,
}: {
  key: number;
  generatedDocument: DocupilotAirtable.GeneratedDocument;
}) {
  return (
    <Box
      key={key}
      display="flex"
      borderBottom="1px solid #E5E5E5"
      paddingY="12px"
    >
      <Text flex="1" fontWeight="500" fontSize="14px" textColor="light">
        {generatedDocument.airtable_record_name}
      </Text>
      <Box paddingX="12px" display="flex">
        <Icon name="file" size={20} marginX="6px" />
        <Text fontSize="12px" textColor="#B3B3B3">
          {generatedDocument.file_name}
        </Text>
      </Box>
    </Box>
  );
}
