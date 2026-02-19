
import React, { useState } from 'react';
import { X, Info, RefreshCw, Flag } from 'lucide-react';
import { LeaveType } from '../types';
import { calculateBusinessDays } from '../utils/dateUtils';
import Calendar from './Calendar';

interface AddLeaveModalProps {
  onClose: () => void;
  onAdd: (type: LeaveType, start: string, end: string, description: string) => void;
  remainingVacation: number;
  remainingSick: number;
  holidays: string[];
}

const AddLeaveModal: React.FC<AddLeaveModalProps> = ({ onClose, onAdd, remainingVacation, remainingSick, holidays }) => {
  const [type, setType] = useState<LeaveType>(LeaveType.VACATION);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const businessDays = startDate && endDate ? calculateBusinessDays(startDate, endDate, holidays) : 0;
  const isOverQuota = type === LeaveType.VACATION ? businessDays > remainingVacation : businessDays > remainingSick;

  const handleDateSelect = (date: string) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (new Date(date) < new Date(startDate)) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const handleResetDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || businessDays <= 0 || isOverQuota) return;
    onAdd(type, startDate, endDate, description);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">New Request</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 text-center">I am requesting...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType(LeaveType.VACATION)}
                className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  type === LeaveType.VACATION ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                }`}
              >
                Vacation
              </button>
              <button
                type="button"
                onClick={() => setType(LeaveType.SICK)}
                className={`py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  type === LeaveType.SICK ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                }`}
              >
                Sick Leave
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <label className="text-sm font-semibold text-slate-700">Select Dates</label>
              {(startDate || endDate) && (
                <button type="button" onClick={handleResetDates} className="text-xs text-indigo-500 font-bold flex items-center gap-1 hover:text-indigo-600">
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>
            
            <Calendar startDate={startDate} endDate={endDate} onSelect={handleDateSelect} type={type} holidays={holidays} />
            
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Start</span>
                <p className="text-sm font-semibold text-slate-700">{startDate || 'Not selected'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">End</span>
                <p className="text-sm font-semibold text-slate-700">{endDate || 'Not selected'}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description / Notes</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g. Family trip, recovery time..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {businessDays > 0 && (
            <div className={`p-4 rounded-xl flex flex-col gap-2 ${isOverQuota ? 'bg-red-50 border border-red-100' : 'bg-emerald-50 border border-emerald-100'}`}>
              <div className="flex items-start gap-3">
                <Info className={`w-5 h-5 mt-0.5 ${isOverQuota ? 'text-red-500' : 'text-emerald-500'}`} />
                <div>
                  <p className={`text-sm font-semibold ${isOverQuota ? 'text-red-700' : 'text-emerald-700'}`}>
                    {businessDays} working day(s) calculated
                  </p>
                  {isOverQuota && <p className="text-xs text-red-600 mt-1">Warning: This exceeds your remaining quota!</p>}
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase ml-8">
                <Flag className="w-3 h-3" /> Includes holidays/weekends? Auto-excluded!
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!startDate || !endDate || businessDays <= 0 || isOverQuota}
            className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${
              !startDate || !endDate || businessDays <= 0 || isOverQuota
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20 active:scale-95'
            }`}
          >
            Confirm Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLeaveModal;
