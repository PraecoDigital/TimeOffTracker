
import React, { useState } from 'react';
import { Sparkles, Loader2, CalendarCheck, Coffee, Zap } from 'lucide-react';
import { getSmartLeavePlanning } from '../services/geminiService';
import { LeaveEntry, LeaveQuota, AISuggestion, PublicHoliday } from '../types';

interface AIAssistantProps {
  currentLeaves: LeaveEntry[];
  remainingQuota: LeaveQuota;
  holidays: PublicHoliday[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ currentLeaves, remainingQuota, holidays }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ suggestions: AISuggestion[]; summary: string } | null>(null);

  const handlePlan = async () => {
    setLoading(true);
    const result = await getSmartLeavePlanning(currentLeaves, remainingQuota, holidays);
    if (result) {
      setData(result);
    }
    setLoading(false);
  };

  return (
    <div className="glass rounded-3xl p-6 mt-8 overflow-hidden relative border border-indigo-100">
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Smart Leave Planner</h2>
            <p className="text-sm text-slate-500">Optimized with your public holiday schedule</p>
          </div>
        </div>
        {!loading && (
          <button
            onClick={handlePlan}
            className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 flex items-center gap-2"
          >
            {data ? 'Refresh Advice' : 'Get Advice'}
          </button>
        )}
      </div>

      {loading && (
        <div className="py-12 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <Sparkles className="w-4 h-4 text-indigo-400 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-slate-600 animate-pulse">Analyzing holidays and your balance...</p>
        </div>
      )}

      {data && !loading && (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
            <p className="text-slate-700 leading-relaxed italic">
              "{data.summary}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="group relative p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {index === 0 ? <CalendarCheck className="w-4 h-4" /> : index === 1 ? <Coffee className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Option {index + 1}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-1">{suggestion.title}</h3>
                <p className="text-xs font-semibold text-indigo-600 mb-2">{suggestion.dates}</p>
                <p className="text-xs text-slate-500 mb-3 line-clamp-3">{suggestion.description}</p>
                <div className="pt-3 border-t border-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Benefit:</span>
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">{suggestion.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!data && !loading && (
        <div className="mt-6 py-8 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400">
           <CalendarCheck className="w-8 h-8 mb-2 opacity-20" />
           <p className="text-xs font-medium">Click "Get Advice" for AI-powered holiday strategies</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
