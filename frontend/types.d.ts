declare namespace DocupilotAirtable {
  interface Template {
    id: number;
    title: string;
    type: string;
    output_type: string;
  }
  interface SchemaField {
    name: string;
    type: string;
    fields?: SchemaField[];
    generics?: string;
  }
  interface MappingValue {
    __airtable_field__?: string;
    __docupilot_type__: string;
    fields?: Mapping;
  }
  interface Mapping {
    [key: string]: MappingValue;
  }
  interface ProfileInfo {
    name: string;
    email: string;
    org: string;
  }
  interface GeneratedDocument {
    airtable_record_name: string;
    file_name: string;
  }
}
