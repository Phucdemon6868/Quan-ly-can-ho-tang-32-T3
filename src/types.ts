export enum Gender {
  Male = 'Nam',
  Female = 'Nữ',
  None = ''
}

export enum Relationship {
  Wife = 'Vợ',
  Husband = 'Chồng',
  Child = 'Con',
  Father = 'Bố',
  Mother = 'Mẹ',
  OlderBrother = 'Anh',
  OlderSister = 'Chị',
  YoungerSibling = 'Em',
  Relative = 'Người thân',
  None = ''
}

export interface Member {
  id: string;
  name: string;
  dob: string;
  gender: Gender;
  relationship?: Relationship;
}

export interface Household {
  id: string;
  stt: number;
  headOfHouseholdName: string;
  apartmentNumber: string;
  phone: string;
  notes: string;
  members: Member[];
}