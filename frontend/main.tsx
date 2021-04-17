import React from 'react';
import { RecordId } from '@airtable/blocks/types';
import { useSelectedRecordIds } from './utils';
import { getTemplates } from './apicallouts';
import { TemplateMergeComponent } from './mapping';
import { TemplateListComponent } from './templates';
import { GeneratedDocument, LoaderComponent } from './common';
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
  const selected_record_ids: Array<RecordId> = useSelectedRecordIds();

  function refreshTemplates() {
    getTemplates().then((response) => response && setTemplates(response.data));
  }

  if (!templates || !templates.length) {
    refreshTemplates();
    return <LoaderComponent />;
  }
  switch (route) {
    case Routes.templatesList:
      if (!selected_record_ids.length) return <NoSelectionInfo />;
      if (!templates) return <NoTemplatesInfo />;
      return (
        <TemplateListComponent
          templates={templates}
          selectTemplate={(templateId) => {
            setSelectedTemplate(templateId);
            setRoute(Routes.templateMapping);
          }}
          refreshTemplates={refreshTemplates}
        />
      );
    case Routes.templateMapping:
      if (!selected_record_ids.length) return <NoSelectionInfo />;
      if (!selected_template) return <LoaderComponent />;
      return (
        <TemplateMergeComponent
          selectedTemplate={selected_template}
          selectedRecordIds={selected_record_ids}
          setRoute={setRoute}
          setPageContext={setPageContext}
          openList={() => {
            setSelectedTemplate(null);
            setRoute(Routes.templatesList);
          }}
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
