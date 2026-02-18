
import React from 'react';
import { Shift, TaskDescription } from '../types';

interface ShiftListProps {
  shifts: Shift[];
  descriptions: TaskDescription[];
  onSelectShift: (shift: Shift) => void;
}

const ShiftList: React.FC<ShiftListProps> = ({ shifts, onSelectShift }) => {
  // Sort shifts by date and time
  const sortedShifts = [...shifts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return a.startTime.localeCompare(b.startTime);
  });

  if (sortedShifts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 italic">
        Ingen planlagte vagter fundet for dig.
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {sortedShifts.map((shift) => (
        <button
          key={shift.id}
          onClick={() => onSelectShift(shift)}
          className="w-full bg-white p-5 rounded-2xl shadow-sm border-l-4 border-crew-primary text-left hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-bold text-crew-primary uppercase tracking-wider">{shift.date}</p>
              <h3 className="text-lg font-bold text-gray-800">{shift.area}</h3>
            </div>
            <div className="bg-crew-bg px-3 py-1 rounded-full text-sm font-semibold text-crew-primary">
              {shift.startTime} - {shift.endTime}
            </div>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {shift.location || 'Lokation ikke angivet'}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ShiftList;
