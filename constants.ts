
import { LeaveType, LeaveQuota } from './types';

export const ANNUAL_QUOTA: LeaveQuota = {
  [LeaveType.VACATION]: 20,
  [LeaveType.SICK]: 14,
};

export const COLORS = {
  [LeaveType.VACATION]: '#3b82f6', // blue-500
  [LeaveType.SICK]: '#ef4444',     // red-500
  BG_VACATION: 'bg-blue-500',
  BG_SICK: 'bg-red-500',
  TEXT_VACATION: 'text-blue-600',
  TEXT_SICK: 'text-red-600',
};
