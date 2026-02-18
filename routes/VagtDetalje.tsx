
import React, { useMemo } from 'react';
import { OverblikRow, VagtRow, TaskDesc } from '../types';
import { findTaskIdForShift, getTaskDescription, isAnsvarlig } from '../lib/join';

interface VagtDetaljeProps {
  shift: OverblikRow;
  vagter: VagtRow[];
  descriptions: TaskDesc[];
  onClose: () => void;
}

const VagtDetalje: React.FC<VagtDetaljeProps> = ({ shift, vagter, descriptions, onClose }) => {
  const taskId = useMemo(() => findTaskIdForShift(shift, vagter), [shift, vagter]);
  const task = useMemo(() => getTaskDescription(taskId, descriptions), [taskId, descriptions]);
  const responsible = useMemo(() => isAnsvarlig(shift.ansvarlig), [shift.ansvarlig]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md transition-all animate-in fade-in duration-300">
      <div className="bg-crew-bg w-full max-w-2xl sm:rounded-[3rem] shadow-2xl overflow-hidden h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-500">
        
        {/* Scrollable Area */}
        <div className="flex-grow overflow-y-auto no-scrollbar pb-32">
          
          {/* Hero Header */}
          <div className="bg-white p-8 pb-12 rounded-b-[3rem] shadow-sm mb-8 relative">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-crew-primary/10 text-crew-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                {shift.dato}
              </div>
              {responsible && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-green-200">
                  Ansvarlig
                </div>
              )}
            </div>
            
            <h1 className="text-4xl font-black text-gray-800 leading-none tracking-tighter mb-4">
              {shift.område}
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm">
              {shift.rolle || 'Crew Medlem'}
            </p>
          </div>

          <div className="px-6 space-y-6">
            {/* Core Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Tidsrum</p>
                <p className="text-lg font-black text-gray-800">{shift.start} — {shift.slut}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Lokation</p>
                <p className="text-lg font-black text-gray-800 truncate">{shift.lokation || 'N/A'}</p>
              </div>
            </div>

            {/* Opgave Section */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-crew-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-crew-primary/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-black text-gray-800">Opgaven</h2>
              </div>

              {task ? (
                <div className="space-y-8">
                  <section>
                    <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Beskrivelse</h3>
                    <p className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">{task.beskrivelse}</p>
                  </section>
                  
                  <div className="grid grid-cols-1 gap-6 pt-4 border-t border-gray-50">
                    {task.mødested && (
                      <section>
                        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Mødested</h3>
                        <p className="text-gray-700 font-bold">{task.mødested}</p>
                      </section>
                    )}
                    {task.udstyr && (
                      <section>
                        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Udstyr</h3>
                        <p className="text-gray-700 font-bold">{task.udstyr}</p>
                      </section>
                    )}
                    {task.succes && (
                      <section>
                        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Succes-kriterie</h3>
                        <p className="text-gray-700 font-bold italic">{task.succes}</p>
                      </section>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold text-sm">Opgavebeskrivelse kommer snart</p>
                  <p className="text-[10px] text-gray-300 uppercase tracking-widest mt-1">Vi opdaterer løbende</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Persistent Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-50 sm:rounded-b-[3rem]">
          <button 
            onClick={onClose}
            className="w-full bg-gray-800 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-gray-700 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Tilbage
          </button>
        </div>
      </div>
    </div>
  );
};

export default VagtDetalje;
