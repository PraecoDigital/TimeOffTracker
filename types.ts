
export enum LeaveType {
  VACATION = 'VACATION',
  SICK = 'SICK'
}

export interface LeaveEntry {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  description: string;
  createdAt: number;
}

export interface PublicHoliday {
  id: string;
  date: string;
  name: string;
}

export interface LeaveQuota {
  [LeaveType.VACATION]: number;
  [LeaveType.SICK]: number;
}

export interface AISuggestion {
  title: string;
  description: string;
  dates: string;
  benefit: string;
}
