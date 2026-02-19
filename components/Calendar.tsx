
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { 
  getMonthDays, 
  format, 
  isSameDay, 
  isDateInRange, 
  addMonths, 
  subMonths,
  isWeekend,
  isSameMonth
} from '../utils/dateUtils';
import { LeaveType } from '../types';

interface CalendarProps {
  startDate: string | null;
  endDate: string | null;
  onSelect: (date: string) => void;
  type: LeaveType;
  holidays?: string[];
}

const Calendar: React.FC<CalendarProps> = ({ startDate, endDate, onSelect, type, holidays = [] }) => {
  const [viewDate, setViewDate] = useState(new Date());

  const days = getMonthDays(viewDate);
  
  const colorClasses = {
    bg: type === LeaveType.VACATION ? 'bg-blue-500' : 'bg-red-500',
    text: type === LeaveType.VACATION ? 'text-blue-600' : 'text-red-600',
    range: type === LeaveType.VACATION ? 'bg-blue-50' : 'bg-red-50',
    border: type === LeaveType.VACATION ? 'border-blue-200' : 'border-red-200',
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800">
          {format(viewDate, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-1">
          <button 
            type="button"
            onClick={() => setViewDate(subMonths(viewDate, 1))}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            type="button"
            onClick={() => setViewDate(addMonths(viewDate, 1))}
            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isSelected = (startDate === dateStr) || (endDate === dateStr);
          const inRange = isDateInRange(day, startDate, endDate);
          const isCurrentMonth = isSameMonth(day, viewDate);
          const isDayWeekend = isWeekend(day);
          const isHoliday = holidays.includes(dateStr);

          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(dateStr)}
              className={`
                relative h-10 w-full flex flex-col items-center justify-center text-sm rounded-xl transition-all
                ${!isCurrentMonth ? 'text-slate-300 pointer-events-none' : 'text-slate-700'}
                ${inRange && isCurrentMonth ? colorClasses.range : 'hover:bg-slate-50'}
                ${isSelected ? `${colorClasses.bg} text-white font-bold shadow-lg z-10 scale-105` : ''}
                ${isDayWeekend && isCurrentMonth && !isSelected ? 'text-slate-400 bg-slate-50/50' : ''}
                ${isHoliday && isCurrentMonth && !isSelected ? 'text-indigo-600 bg-indigo-50/50' : ''}
              `}
            >
              <span className="relative z-10">{format(day, 'd')}</span>
              {isHoliday && isCurrentMonth && (
                <div className={`absolute -top-1 -right-1 p-0.5 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`}>
                   <Flag className={`w-1.5 h-1.5 ${isSelected ? 'text-indigo-500' : 'text-white'}`} />
                </div>
              )}
              {isSameDay(day, new Date()) && !isSelected && (
                <div className="absolute bottom-1.5 w-1 h-1 bg-indigo-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-indigo-500" /> Holiday
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-slate-200" /> Weekend
        </div>
      </div>
    </div>
  );
};

export default Calendar;
