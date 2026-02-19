
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Calendar as CalendarIcon, Flag, Trash2 } from 'lucide-react';
import { LeaveEntry, LeaveType, PublicHoliday } from './types';
import { ANNUAL_QUOTA } from './constants';
import StatCard from './components/StatCard';
import LeaveTable from './components/LeaveTable';
import AddLeaveModal from './components/AddLeaveModal';
import AIAssistant from './components/AIAssistant';
import { calculateBusinessDays, format } from './utils/dateUtils';

const App: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveEntry[]>(() => {
    const saved = localStorage.getItem('timeoff_leaves');
    return saved ? JSON.parse(saved) : [];
  });

  const [holidays, setHolidays] = useState<PublicHoliday[]>(() => {
    const saved = localStorage.getItem('timeoff_holidays');
    // Default holidays if none exist
    const defaultHolidays: PublicHoliday[] = [
      { id: '1', date: `${new Date().getFullYear()}-12-25`, name: 'Christmas Day' },
      { id: '2', date: `${new Date().getFullYear()}-01-01`, name: "New Year's Day" },
    ];
    return saved ? JSON.parse(saved) : defaultHolidays;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHolidayManager, setShowHolidayManager] = useState(false);

  useEffect(() => {
    localStorage.setItem('timeoff_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('timeoff_holidays', JSON.stringify(holidays));
  }, [holidays]);

  const holidayDates = useMemo(() => holidays.map(h => h.date), [holidays]);

  const stats = useMemo(() => {
    const usedVacation = leaves
      .filter((l) => l.type === LeaveType.VACATION)
      .reduce((acc, curr) => acc + curr.days, 0);
    const usedSick = leaves
      .filter((l) => l.type === LeaveType.SICK)
      .reduce((acc, curr) => acc + curr.days, 0);

    return {
      [LeaveType.VACATION]: {
        used: usedVacation,
        total: ANNUAL_QUOTA[LeaveType.VACATION],
        remaining: ANNUAL_QUOTA[LeaveType.VACATION] - usedVacation,
      },
      [LeaveType.SICK]: {
        used: usedSick,
        total: ANNUAL_QUOTA[LeaveType.SICK],
        remaining: ANNUAL_QUOTA[LeaveType.SICK] - usedSick,
      },
    };
  }, [leaves]);

  const handleAddLeave = (type: LeaveType, start: string, end: string, description: string) => {
    const newEntry: LeaveEntry = {
      id: crypto.randomUUID(),
      type,
      startDate: start,
      endDate: end,
      days: calculateBusinessDays(start, end, holidayDates),
      description,
      createdAt: Date.now(),
    };
    setLeaves([...leaves, newEntry]);
  };

  const handleDeleteLeave = (id: string) => {
    setLeaves(leaves.filter((l) => l.id !== id));
  };

  const handleAddHoliday = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get('date') as string;
    const name = formData.get('name') as string;
    if (date && name) {
      setHolidays([...holidays, { id: crypto.randomUUID(), date, name }]);
      e.currentTarget.reset();
    }
  };

  const removeHoliday = (id: string) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <header className="sticky top-0 z-40 w-full glass border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-2xl shadow-lg">
              <CalendarIcon className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TimeOff Tracker</h1>
              <p className="text-xs text-slate-500 font-medium uppercase">Annual Leave Planner</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button
              onClick={() => setShowHolidayManager(!showHolidayManager)}
              className={`p-2.5 rounded-2xl border transition-all ${showHolidayManager ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
              title="Manage Holidays"
            >
              <Flag className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-semibold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Request</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10">
        {showHolidayManager && (
          <div className="mb-8 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Flag className="w-5 h-5 text-indigo-500" />
              Public Holidays Config
            </h2>
            <form onSubmit={handleAddHoliday} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <input type="date" name="date" required className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
              <input type="text" name="name" required placeholder="Holiday Name (e.g. Labor Day)" className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
              <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 rounded-xl text-sm hover:bg-indigo-700">Add Holiday</button>
            </form>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {holidays.sort((a,b) => a.date.localeCompare(b.date)).map(h => (
                <div key={h.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{h.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{format(new Date(h.date), 'MMM d, yyyy')}</p>
                  </div>
                  <button onClick={() => removeHoliday(h.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard type={LeaveType.VACATION} used={stats[LeaveType.VACATION].used} total={stats[LeaveType.VACATION].total} />
          <StatCard type={LeaveType.SICK} used={stats[LeaveType.SICK].used} total={stats[LeaveType.SICK].total} />
        </div>

        <AIAssistant 
          currentLeaves={leaves} 
          remainingQuota={{
            [LeaveType.VACATION]: stats[LeaveType.VACATION].remaining,
            [LeaveType.SICK]: stats[LeaveType.SICK].remaining,
          }}
          holidays={holidays}
        />

        <LeaveTable entries={leaves} onDelete={handleDeleteLeave} />
      </main>

      {isModalOpen && (
        <AddLeaveModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddLeave}
          remainingVacation={stats[LeaveType.VACATION].remaining}
          remainingSick={stats[LeaveType.SICK].remaining}
          holidays={holidayDates}
        />
      )}
    </div>
  );
};

export default App;
