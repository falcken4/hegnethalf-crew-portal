
import React from 'react';
import { Shift, TaskDescription } from '../types';

interface ShiftDetailProps {
  shift: Shift;
  descriptions: TaskDescription[];
  onClose: () => void;
}

const ShiftDetail: React.FC<ShiftDetailProps> = ({ shift, descriptions, onClose }) => {
  const description = descriptions.find(d => d.taskID === shift.taskID)?.description;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-crew-primary p-6 text-white flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-sm font-medium uppercase tracking-widest">{shift.date}</p>
            <h2 className="text-2xl font-bold">{shift.area}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto no-scrollbar flex-grow space-y-8">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-crew-bg p-4 rounded-2xl">
              <p className="text-xs text-crew-primary font-bold uppercase mb-1">Tid</p>
              <p className="font-semibold text-gray-800">{shift.startTime} - {shift.endTime}</p>
            </div>
            <div className="bg-crew-bg p-4 rounded-2xl">
              <p className="text-xs text-crew-primary font-bold uppercase mb-1">Rolle</p>
              <p className="font-semibold text-gray-800">{shift.role || 'Standard'}</p>
            </div>
            <div className="bg-crew-bg p-4 rounded-2xl col-span-2">
              <p className="text-xs text-crew-primary font-bold uppercase mb-1">Lokation</p>
              <p className="font-semibold text-gray-800">{shift.location || 'Spørg din leder'}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Opgavebeskrivelse</h4>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 min-h-[100px] text-gray-700 leading-relaxed">
              {description ? (
                <p className="whitespace-pre-wrap">{description}</p>
              ) : (
                <p className="italic text-gray-400">Opgavebeskrivelse kommer snart</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="w-full bg-crew-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
          >
            Forstået
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ShiftDetail;
