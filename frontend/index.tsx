import React from 'react';
import {
  initializeBlock,
  loadCSSFromString,
  useGlobalConfig,
  useWatchable,
} from '@airtable/blocks/ui';
import { OnBoardingComponent } from './onboarding';
import { SettingsComponent } from './settings';
import { MainComponent } from './main';
import { setApiKey } from './apicallouts';
import { settingsButton } from '@airtable/blocks';

loadCSSFromString(`* {
    font-style: normal;
    font-weight: normal;
}`);

function DocupilotBlock() {
  const globalConfig = useGlobalConfig();
  const isEditor = globalConfig.checkPermissionsForSet().hasPermission;
  const apikey: string = globalConfig.get('api-key') as string;
  const [show_settings, setShowSettings] = React.useState<boolean>(false);

  useWatchable(settingsButton, 'click', () => setShowSettings(!show_settings));
  if (isEditor) {
    settingsButton.show();
  } else {
    settingsButton.hide();
  }

  if (show_settings) {
    return <SettingsComponent onConnect={() => setShowSettings(false)} />;
  }
  if (!apikey) {
    return <OnBoardingComponent getStarted={() => setShowSettings(true)} />;
  } else {
    setApiKey(apikey);
    return <MainComponent />;
  }
}

initializeBlock(() => <DocupilotBlock />);
