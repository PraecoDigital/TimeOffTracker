
import React, { useMemo, useState } from 'react';
import { Trash2, Calendar, Thermometer, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { eachDayOfInterval, endOfMonth, parseISO, startOfMonth } from 'date-fns';
import { LeaveEntry, LeaveType } from '../types';
import {
  addMonths,
  format,
  formatDateRange,
  getMonthDays,
  isSameDay,
  isSameMonth,
  subMonths,
} from '../utils/dateUtils';

interface LeaveTableProps {
  entries: LeaveEntry[];
  onDelete: (id: string) => void;
}

const getEntryInterval = (entry: LeaveEntry) => {
  const start = parseISO(entry.startDate);
  const end = parseISO(entry.endDate);

  return start <= end ? { start, end } : { start: end, end: start };
};

const LeaveTable: React.FC<LeaveTableProps> = ({ entries, onDelete }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [viewDate, setViewDate] = useState(new Date());

  const slides = ['table', 'calendar'];

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => b.createdAt - a.createdAt);
  }, [entries]);

  const monthDays = useMemo(() => getMonthDays(viewDate), [viewDate]);

  const dayEntryMap = useMemo(() => {
    const map: Record<string, LeaveEntry[]> = {};

    sortedEntries.forEach((entry) => {
      const { start, end } = getEntryInterval(entry);

      eachDayOfInterval({ start, end }).forEach((day) => {
        const dateKey = format(day, 'yyyy-MM-dd');
        if (!map[dateKey]) {
          map[dateKey] = [];
        }
        map[dateKey].push(entry);
      });
    });

    return map;
  }, [sortedEntries]);

  const monthEntries = useMemo(() => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);

    return sortedEntries.filter((entry) => {
      const { start, end } = getEntryInterval(entry);
      return start <= monthEnd && end >= monthStart;
    });
  }, [sortedEntries, viewDate]);

  const goToPrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 glass rounded-3xl mt-6">
        <p className="text-slate-400">No leave records yet. Start by adding one!</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          History & Planning
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrevSlide}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNextSlide}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors"
            aria-label="Next card"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          <div className="w-full shrink-0">
            <div className="overflow-hidden glass rounded-3xl shadow-sm border border-slate-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Period</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Days</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reason</th>
                      <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-white/50 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {entry.type === LeaveType.VACATION ? (
                              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                                <Sun className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                                <Thermometer className="w-4 h-4" />
                              </div>
                            )}
                            <span className={`text-sm font-medium ${entry.type === LeaveType.VACATION ? 'text-blue-700' : 'text-red-700'}`}>
                              {entry.type}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {formatDateRange(entry.startDate, entry.endDate)}
                        </td>
                        <td className="p-4 text-sm text-slate-800 font-bold text-center">
                          {entry.days}
                        </td>
                        <td className="p-4 text-sm text-slate-500 italic max-w-xs truncate">
                          {entry.description || '—'}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => onDelete(entry.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="w-full shrink-0">
            <div className="glass rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">{format(viewDate, 'MMMM yyyy')}</h3>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setViewDate((currentDate) => subMonths(currentDate, 1))}
                    className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"
                    aria-label="View previous month"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewDate((currentDate) => addMonths(currentDate, 1))}
                    className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400"
                    aria-label="View next month"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dayLabel) => (
                  <div key={dayLabel} className="text-center text-[10px] font-bold text-slate-400 uppercase py-1">
                    {dayLabel}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day) => {
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const dayEntries = dayEntryMap[dateKey] ?? [];
                  const isCurrentMonth = isSameMonth(day, viewDate);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={dateKey}
                      className={`
                        min-h-16 p-1.5 rounded-xl border transition-colors
                        ${isCurrentMonth ? 'bg-white/80 border-slate-100' : 'bg-slate-50/70 border-transparent'}
                      `}
                    >
                      <p className={`text-xs font-semibold ${isCurrentMonth ? 'text-slate-700' : 'text-slate-300'}`}>
                        {format(day, 'd')}
                      </p>

                      {isCurrentMonth && dayEntries.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {dayEntries.slice(0, 2).map((entry) => (
                            <div
                              key={`${entry.id}-${dateKey}`}
                              className={`h-1.5 rounded-full ${entry.type === LeaveType.VACATION ? 'bg-blue-500' : 'bg-red-500'}`}
                              title={`${entry.type}: ${formatDateRange(entry.startDate, entry.endDate)}`}
                            />
                          ))}
                          {dayEntries.length > 2 && (
                            <p className="text-[10px] leading-none text-slate-400">+{dayEntries.length - 2}</p>
                          )}
                        </div>
                      )}

                      {isCurrentMonth && isToday && (
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">In this month</h4>
                {monthEntries.length === 0 ? (
                  <p className="text-sm text-slate-400">No leave requests overlap this month.</p>
                ) : (
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                    {monthEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${entry.type === LeaveType.VACATION ? 'bg-blue-500' : 'bg-red-500'}`}
                          />
                          <span className="font-medium text-slate-700">{entry.type}</span>
                          <span className="text-slate-400">{formatDateRange(entry.startDate, entry.endDate)}</span>
                        </div>
                        <span className="font-semibold text-slate-600">{entry.days}d</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {slides.map((slide, index) => (
          <button
            key={slide}
            onClick={() => setActiveSlide(index)}
            className={`h-2.5 rounded-full transition-all ${activeSlide === index ? 'w-7 bg-slate-700' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`}
            aria-label={`Open ${slide} card`}
          />
        ))}
      </div>
    </div>
  );
};

export default LeaveTable;
