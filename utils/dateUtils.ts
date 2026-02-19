
import { 
  differenceInDays,
  parseISO, 
  addDays, 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  isWithinInterval, 
  isWeekend,
  addMonths,
  subMonths,
  isSameMonth
} from 'date-fns';

export const calculateBusinessDays = (start: string, end: string, holidays: string[] = []): number => {
  if (!start || !end) return 0;
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  
  if (startDate > endDate) return 0;

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  return days.filter(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return !isWeekend(day) && !holidays.includes(dateStr);
  }).length;
};

export const formatDateRange = (start: string, end: string): string => {
  const s = parseISO(start);
  const e = parseISO(end);
  if (start === end) return format(s, 'MMM d, yyyy');
  return `${format(s, 'MMM d')} - ${format(e, 'MMM d, yyyy')}`;
};

export const getMonthDays = (date: Date) => {
  const start = startOfWeek(startOfMonth(date));
  const end = endOfWeek(endOfMonth(date));
  return eachDayOfInterval({ start, end });
};

export const isDateInRange = (date: Date, start: string | null, end: string | null) => {
  if (!start) return false;
  const dStart = parseISO(start);
  if (!end) return isSameDay(date, dStart);
  const dEnd = parseISO(end);
  
  const rangeStart = dStart < dEnd ? dStart : dEnd;
  const rangeEnd = dStart < dEnd ? dEnd : dStart;
  
  return isWithinInterval(date, { start: rangeStart, end: rangeEnd });
};

export { addMonths, subMonths, format, isSameDay, isWeekend, isSameMonth };
