
import React, { useState } from 'react';
import { PracticalInfo as InfoType } from '../types';

interface PracticalInfoProps {
  info: InfoType[];
}

const PracticalInfo: React.FC<PracticalInfoProps> = ({ info }) => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  // Group by section
  const sections = Array.from(new Set(info.map(i => i.section)));

  if (info.length === 0) {
    return <div className="p-8 text-center text-gray-500 italic">Ingen praktisk info tilgængelig endnu.</div>;
  }

  return (
    <div className="space-y-8 pb-24">
      {sections.map(section => (
        <div key={section} className="space-y-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">{section}</h2>
          <div className="space-y-2">
            {info.filter(item => item.section === section).map(item => {
              const id = `${item.section}-${item.title}`;
              const isOpen = openIndex === id;
              
              return (
                <div key={id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : id)}
                    className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-gray-700">{item.title}</span>
                    <svg 
                      className={`w-5 h-5 text-crew-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-50 animate-fade-in">
                      <div className="prose max-w-none whitespace-pre-wrap">
                        {item.bodyMarkdown}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PracticalInfo;
