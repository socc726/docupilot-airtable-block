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
    fs?: Mapping; // fields
  }
  interface Mapping {
    [key: string]: MappingValue;
  }
  interface RuntimeMappingValue extends MappingValue {
    docupilot_type: string; //docupilot type
    fs?: RuntimeMapping; // fields
  }
  interface RuntimeMapping extends Mapping {
    [key: string]: RuntimeMappingValue;
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
