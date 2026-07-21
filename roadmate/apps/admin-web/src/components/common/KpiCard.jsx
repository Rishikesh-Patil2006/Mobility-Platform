import React from 'react';
import { Card } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

export default function KpiCard({ label, value, icon: Icon, color, trend, onClick }) {
  const isPositive = trend >= 0;

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className={`rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 ${
        onClick ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer' : ''
      }`}
      bodyStyle={{ padding: '24px' }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">
            {label}
          </span>
          <h3 
            className="text-2xl font-black text-slate-800 font-sans tracking-tight mb-0"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {value}
          </h3>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-xs font-bold font-sans flex items-center ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isPositive ? <ArrowUpOutlined className="text-[10px]" /> : <ArrowDownOutlined className="text-[10px]" />}
                {Math.abs(trend)}%
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
          style={{ 
            backgroundColor: `${color}15`,
            color: color
          }}
        >
          {Icon && <Icon className="text-xl" />}
        </div>
      </div>
    </Card>
  );
}
