import React from 'react';
import {
  Box,
  Button,
  colors,
  FormField,
  Input,
  Label,
  loadCSSFromString,
  Text,
  TextButton,
  useGlobalConfig,
} from '@airtable/blocks/ui';
import { getProfileDetails, setApiKey } from './apicallouts';
import { WrapperComponent } from './common';
import { MinimumPermissionsInfo } from './info';

loadCSSFromString(`.settings-action-box * {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
}`);

function APIKeyComponent({ apikey, error, saveAPI }) {
  const [input, setInput] = React.useState<string>(apikey || '');
  const [edit_mode, setEditMode] = React.useState<boolean>(false);

  return (
    <Box marginTop="12px">
      {!apikey && (
        <Text fontSize="16px" fontWeight="600" lineHeight="24px">
          Configure API Key
        </Text>
      )}
      <Box marginTop="16px">
        <FormField
          label={<Label htmlFor="api-key">API Key</Label>}
          description={
            !apikey || edit_mode ? (
              <Text>
                Go to the{' '}
                <a
                  href="https://dashboard.docupilot.app/settings/api"
                  target="_blank"
                  rel="noreferrer"
                >
                  API Settings
                </a>{' '}
                screen from your Docupilot dashboard to find your API Key.
              </Text>
            ) : null
          }
        >
          {!apikey || edit_mode ? (
            <Input
              id="api-key"
              name="apikey"
              value={input}
              onChange={(event) => {
                setInput(event.target.value);
              }}
            />
          ) : (
            <Text fontSize="17px" lineHeight="20px">
              {apikey.substr(0, 5) +
                '**********************' +
                apikey.substr(apikey.length - 5)}
            </Text>
          )}
          {!!error && <Text textColor={colors.RED}>{error}</Text>}
        </FormField>
      </Box>
      <Box className="settings-action-box">
        {!apikey ? (
          <Button
            variant="primary"
            width="100%"
            onClick={() => saveAPI(input, false)}
          >
            Connect
          </Button>
        ) : edit_mode ? (
          <Box>
            <Button
              variant="primary"
              size="small"
              width="100px"
              onClick={() => {
                saveAPI(input);
                setEditMode(false);
              }}
            >
              Save
            </Button>
            <Button
              variant="secondary"
              size="small"
              marginLeft="24px"
              onClick={() => {
                setInput(apikey);
                setEditMode(false);
              }}
            >
              Cancel
            </Button>
          </Box>
        ) : (
          <TextButton onClick={() => setEditMode(true)}>Change</TextButton>
        )}
      </Box>
    </Box>
  );
}

export function SettingsComponent({ onConnect }) {
  const globalConfig = useGlobalConfig();
  const apikey: string = globalConfig.get('api-key') as string;
  const isEditor = globalConfig.checkPermissionsForSet().hasPermission;
  const [error, setError] = React.useState<string>('');

  if (!isEditor) return <MinimumPermissionsInfo goBack={onConnect} />;

  const profile_info: DocupilotAirtable.ProfileInfo = globalConfig.get(
    'profile-info',
  ) as DocupilotAirtable.ProfileInfo;

  const settings_component = (
    <Box paddingY="12px">
      {!!profile_info && (
        <Box marginTop="12px">
          <Label htmlFor="docupilot-email">Account</Label>
          <Text fontSize="17px" lineHeight="20px">
            {profile_info.email}
          </Text>
        </Box>
      )}
      {!!profile_info && (
        <Box marginTop="12px">
          <Text fontSize="17px" lineHeight="20px">
            {profile_info.name}
          </Text>
          <Text textColor="light">{profile_info.org} Org</Text>
        </Box>
      )}
      <APIKeyComponent
        apikey={apikey}
        error={error}
        saveAPI={async (api_input, is_update = true) => {
          if (!api_input) {
            await globalConfig.setAsync('api-key', null);
            await globalConfig.setAsync('profile-info', null);
            onConnect();
          }
          getProfileDetails(api_input)
            .then(async (response) => {
              setApiKey(api_input);
              await globalConfig.setAsync('api-key', api_input);
              await globalConfig.setAsync('profile-info', {
                name: response.data.first_name + ' ' + response.data.last_name,
                email: response.data.email,
                org: response.data.organization.name || '',
              });
              if (!is_update) {
                onConnect();
              }
            })
            .catch((error) => {
              console.log(error);
              setError('Invalid API Key');
            });
        }}
      />
    </Box>
  );

  return (
    <WrapperComponent
      child_component={settings_component}
      padding={'24px 48px'}
    />
  );
}
