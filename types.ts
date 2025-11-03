export interface AppointmentQuery {
  country: string;
  consulate: string;
  visaType: string;
}

export interface Consulate {
  name: string;
  value: string;
}

export interface Country {
  name: string;
  consulates: Consulate[];
}
