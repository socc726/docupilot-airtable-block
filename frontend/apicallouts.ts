import * as API from './api/index';

API.OpenAPI.BASE = 'https://staging.docupilot.app';

export async function setApiKey(apikey: string) {
  API.OpenAPI.TOKEN = apikey;
}

export async function getProfileDetails(apikey: string) {
  await setApiKey(apikey);
  const response = await API.UsersService.getMe();
  return response;
}

export async function getTemplates(): Promise<any> {
  const response = await API.TemplatesService.listAllTemplates();
  return response;
}

export async function getTemplateSchema(id: any): Promise<any> {
  const response = await API.TemplatesService.getTemplateSchema(id);
  return response;
}

export async function generateDocument(
  id: any,
  data: any,
  download = false,
): Promise<any> {
  const response = await API.GenerateService.generateDocument(
    id,
    data,
    download ? 'true' : 'false',
  );
  return response;
}
