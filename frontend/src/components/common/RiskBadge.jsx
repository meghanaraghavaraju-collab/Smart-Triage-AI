import React from 'react';

export default function RiskBadge({ level, esiLevel, showEsi = true, size = 'md' }) {
  const normLevel = (level || '').toUpperCase();

  const config = {
    HIGH: {
      bg: 'bg-red-50 text-red-700 border-red-200 ring-red-500/10',
      dot: 'bg-red-500 animate-pulse',
      label: 'HIGH RISK',
      esiDesc: 'ESI Level 1-2 (Immediate / Emergent)'
    },
    MEDIUM: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-500/10',
      dot: 'bg-amber-500',
      label: 'MEDIUM RISK',
      esiDesc: 'ESI Level 3 (Urgent)'
    },
    LOW: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
      dot: 'bg-emerald-500',
      label: 'LOW RISK',
      esiDesc: 'ESI Level 4-5 (Routine / Non-urgent)'
    }
  };

  const current = config[normLevel] || config.LOW;
  const sizeClasses = size === 'sm' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'lg' 
      ? 'text-sm px-3.5 py-1.5' 
      : 'text-xs px-2.5 py-1';

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ring-1 ${sizeClasses} ${current.bg}`}>
        <span className={`w-2 h-2 rounded-full ${current.dot}`}></span>
        {current.label}
        {showEsi && esiLevel && (
          <span className="opacity-75 font-normal ml-0.5">| ESI-{esiLevel}</span>
        )}
      </span>
    </div>
  );
}
