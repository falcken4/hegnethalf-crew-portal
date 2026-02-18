
import React, { useMemo } from 'react';
import { OverblikRow } from '../types';
import ShiftCard from '../components/ShiftCard';

interface MineVagterProps {
  shifts: OverblikRow[];
  onSelectShift: (shift: OverblikRow) => void;
}

const MineVagter: React.FC<MineVagterProps> = ({ shifts, onSelectShift }) => {
  const groupedShifts = useMemo(() => {
    const groups: Record<string, OverblikRow[]> = {};
    shifts.forEach(shift => {
      const date = shift.dato || 'Ingen dato';
      if (!groups[date]) groups[date] = [];
      groups[date].push(shift);
    });
    return Object.entries(groups).sort(([dateA], [dateB]) => dateA.localeCompare(dateB));
  }, [shifts]);

  if (shifts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-sm max-w-sm w-full">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Ingen vagter</p>
          <p className="text-gray-500 font-medium">Vi kunne ikke finde nogen planlagte vagter til dig i systemet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24">
      {groupedShifts.map(([date, shiftsInGroup]) => (
        <div key={date} className="space-y-4">
          <div className="px-2">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{date}</h2>
          </div>
          <div className="grid gap-4">
            {shiftsInGroup.map((shift, idx) => (
              <ShiftCard 
                key={`${shift.dato}-${shift.start}-${idx}`} 
                shift={shift} 
                onClick={() => onSelectShift(shift)} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MineVagter;
