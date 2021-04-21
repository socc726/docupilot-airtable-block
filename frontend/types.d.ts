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
    af?: string; // airtable field
    dt: string; // docupilot token type
    fs?: Mapping; // fields
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
    record_name: string;
    file_name: string;
    url?: string;
  }
}
