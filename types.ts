
export enum Gender {
  Male = 'Nam',
  Female = 'Nữ',
  None = ''
}

export interface Member {
  id: string;
  name: string;
  dob: string;
  gender: Gender;
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
