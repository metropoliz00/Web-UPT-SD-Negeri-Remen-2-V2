import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function ClockWidget({ className = "" }: { className?: string }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDay = new Intl.DateTimeFormat('id-ID', { 
    weekday: 'long', 
    timeZone: 'Asia/Jakarta' 
  }).format(time);
  
  const formatDate = new Intl.DateTimeFormat('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric', 
    timeZone: 'Asia/Jakarta' 
  }).format(time);
  
  const formatTime = new Intl.DateTimeFormat('id-ID', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    timeZone: 'Asia/Jakarta',
    hour12: false
  }).format(time).replace(/\./g, ':');

  return (
    <div className={`flex items-center space-x-2.5 text-xs font-semibold text-black bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/50 dark:border-slate-800/60 whitespace-nowrap ${className}`}>
      <Clock className="h-4 w-4 text-brand-primary flex-shrink-0" />
      <div className="flex flex-col items-start leading-tight">
        <span>{formatDay}, {formatDate}</span>
        <span className="text-[10px] text-slate-500 font-bold tracking-wide mt-0.5">{formatTime} WIB</span>
      </div>
    </div>
  );
}
