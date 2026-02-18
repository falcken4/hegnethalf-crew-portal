
import React from 'react';
import { OverblikRow } from '../types';

interface ShiftCardProps {
  shift: OverblikRow;
  onClick: () => void;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-gray-100 transition-all text-left flex flex-col group active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="bg-crew-bg px-4 py-2 rounded-xl">
          <p className="text-sm font-black text-crew-primary tracking-tighter uppercase">
            {shift.start} — {shift.slut}
          </p>
        </div>
        {shift.ansvarlig && (
          <div className="bg-green-50 px-3 py-1 rounded-full border border-green-100">
            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Ansvarlig</p>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-black text-gray-800 leading-tight mb-1 group-hover:text-crew-primary transition-colors">
          {shift.område}
        </h3>
        <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
          {shift.rolle || 'Medhjælper'}
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-gray-400 font-bold text-sm">
        <svg className="w-4 h-4 mr-2 text-crew-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="truncate">{shift.lokation || 'Spørg din leder'}</span>
      </div>
    </button>
  );
};

export default ShiftCard;
