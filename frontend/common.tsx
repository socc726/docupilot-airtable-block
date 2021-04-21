import {
  Box,
  Button,
  loadCSSFromString,
  Loader,
  Text,
} from '@airtable/blocks/ui';
import React from 'react';
import { ImageIcon } from './images';

loadCSSFromString(`
.generated-document:not(:last-child) {
    border-bottom: 1px solid #E5E5E5;
}`);

export function WrapperComponent({
  child_component,
  theme = 'light',
  padding = '48px',
}) {
  return (
    <Box
      backgroundColor={theme == 'light' ? 'white' : '#071C3F'}
      padding={padding}
      minHeight="100vh"
    >
      <Box marginY="12px">
        <ImageIcon
          name={theme == 'light' ? 'master-logo-blue' : 'master-logo-white'}
        />
      </Box>
      {child_component}
    </Box>
  );
}

export function InformationComponent({
  image_icon,
  content,
  sub_content = null,
  actions = [],
}) {
  let action_count: number = 0;
  const actionButtons = actions.map((action) => {
    return (
      <Button
        key={action_count++}
        width="100%"
        marginBottom="16px"
        variant={action.variant}
        onClick={action.onClick}
      >
        <Text fontWeight="500" fontSize="14px" textColor={action.textColor}>
          {' '}
          {action.label}{' '}
        </Text>
      </Button>
    );
  });
  return (
    <Box paddingX="24px" paddingY="4px" height="100vh">
      <Box
        backgroundColor="white"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        minHeight={`calc(100% - 8px - ${48 * actionButtons.length}px)`}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box margin="16px">
            <ImageIcon name={image_icon} />
          </Box>
          <Text textColor="light" lineHeight="171%">
            {content}
          </Text>
        </Box>
        {sub_content && (
          <Box marginTop={'4px'} marginBottom={'4px'}>
            {sub_content}
          </Box>
        )}
      </Box>
      <div>{actionButtons}</div>
    </Box>
  );
}

export function LoaderComponent() {
  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Loader scale={0.3} fillColor="#888" />
    </Box>
  );
}

export function GeneratedDocumentRow({
  document,
}: {
  document: DocupilotAirtable.GeneratedDocument;
}) {
  return (
    <Box className="generated-document" display="flex" paddingY="12px">
      <Text flex="1" fontWeight="500" fontSize="14px" textColor="light">
        {document.record_name}
      </Text>
      <Box paddingX="12px" position="relative">
        <Box
          style={{
            transform: 'scale(0.7)',
            position: 'absolute',
            left: '-16px',
            top: '-9px',
          }}
        >
          <ImageIcon name={document.file_name.split('.').pop()} />
        </Box>
        <Text fontSize="12px" textColor="#B3B3B3">
          {document.file_name}
        </Text>
      </Box>
    </Box>
  );
}
