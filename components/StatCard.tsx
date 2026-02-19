
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { LeaveType } from '../types';
import { COLORS } from '../constants';

interface StatCardProps {
  type: LeaveType;
  used: number;
  total: number;
}

const StatCard: React.FC<StatCardProps> = ({ type, used, total }) => {
  const remaining = Math.max(0, total - used);
  const data = [
    { name: 'Used', value: used },
    { name: 'Remaining', value: remaining }
  ];

  const color = COLORS[type];

  return (
    <div className="glass rounded-3xl p-6 flex flex-col items-center shadow-sm transition-all hover:shadow-md">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
        {type === LeaveType.VACATION ? 'Vacation Days' : 'Sick Days'}
      </h3>
      <div className="w-full h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              <Cell fill={color} />
              <Cell fill="#e2e8f0" />
              <Label
                value={`${remaining}`}
                position="center"
                className="text-3xl font-bold fill-slate-800"
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-center">
        <p className="text-slate-600 text-sm">
          <span className="font-bold text-slate-900">{used}</span> used of <span className="font-bold text-slate-900">{total}</span> total
        </p>
      </div>
    </div>
  );
};

export default StatCard;
