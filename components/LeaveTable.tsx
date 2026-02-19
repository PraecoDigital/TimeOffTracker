
import React from 'react';
import { Trash2, Calendar, Thermometer, Sun } from 'lucide-react';
import { LeaveEntry, LeaveType } from '../types';
import { formatDateRange } from '../utils/dateUtils';
import { COLORS } from '../constants';

interface LeaveTableProps {
  entries: LeaveEntry[];
  onDelete: (id: string) => void;
}

const LeaveTable: React.FC<LeaveTableProps> = ({ entries, onDelete }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 glass rounded-3xl mt-6">
        <p className="text-slate-400">No leave records yet. Start by adding one!</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-500" />
        History & Planning
      </h2>
      <div className="overflow-hidden glass rounded-3xl shadow-sm border border-slate-100">
        <table className="w-full text-left border-collapse">
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
            {entries.sort((a, b) => b.createdAt - a.createdAt).map((entry) => (
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
  );
};

export default LeaveTable;
