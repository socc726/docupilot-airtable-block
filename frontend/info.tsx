import { InformationComponent } from './common';
import React from 'react';
import { Text, Box, colors } from '@airtable/blocks/ui';
import { Routes } from './routes';

export function NoTemplatesInfo() {
  return (
    <InformationComponent
      image_icon="file"
      content="No templates available for given APIKey"
    />
  );
}

export function NoSelectionInfo() {
  return (
    <InformationComponent
      image_icon="select-record"
      content="Select records to generate documents with Docupilot"
    />
  );
}

export function MergeSuccessInfo({
  merge_context,
  setRoute,
  setSelectedTemplate,
}) {
  let count = merge_context.length;
  return (
    <InformationComponent
      image_icon="merge-success"
      content={`${count} Document${
        count - 1 ? 's' : ''
      } created successfully 🎉`}
      sub_content={merge_context}
      actions={[
        {
          label: 'Dismiss',
          textColor: 'light',
          onClick: () => {
            setSelectedTemplate(null);
            setRoute(Routes.templatesList);
          },
        },
      ]}
    />
  );
}

export function MergeFailInfo({ errorMessage, setRoute, setSelectedTemplate }) {
  return (
    <InformationComponent
      image_icon="merge-fail"
      content="Document creation failed 😟️"
      sub_content={
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Text size="small" textColor={colors.RED}>
            {errorMessage}
          </Text>
        </Box>
      }
      actions={[
        {
          label: 'Retry',
          onClick: () => {
            setRoute(Routes.templatesList);
          },
        },
        {
          label: 'Dismiss',
          variant: 'secondary',
          textColor: 'light',
          onClick: () => {
            setSelectedTemplate(null);
            setRoute(Routes.templatesList);
          },
        },
      ]}
    />
  );
}
