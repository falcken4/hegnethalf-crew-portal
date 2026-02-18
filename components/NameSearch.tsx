
import React, { useState, useMemo } from 'react';
import { Shift } from '../types';
import { formatName } from '../constants';

interface NameSearchProps {
  shifts: Shift[];
  onSelect: (name: string) => void;
}

const NameSearch: React.FC<NameSearchProps> = ({ shifts, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const uniqueNames = useMemo(() => {
    const names = Array.from(new Set(shifts.map(s => s.name.trim())));
    return names.sort();
  }, [shifts]);

  const filteredNames = useMemo(() => {
    if (searchTerm.length < 2) return [];
    return uniqueNames.filter(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);
  }, [uniqueNames, searchTerm]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-t-8 border-crew-primary">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Find din plan</h1>
        <p className="text-gray-500 mb-8">Indtast dit fulde navn for at se dine vagter</p>
        
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Søg på dit navn..."
            className="w-full px-6 py-4 text-lg rounded-2xl border-2 border-gray-100 focus:border-crew-primary focus:outline-none shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {filteredNames.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {filteredNames.map(name => (
                <button
                  key={name}
                  onClick={() => onSelect(name)}
                  className="w-full px-6 py-4 text-left hover:bg-crew-bg transition-colors border-b border-gray-50 last:border-0 flex justify-between items-center"
                >
                  <span className="font-medium text-gray-700">{formatName(name)}</span>
                  <span className="text-xs text-gray-400 uppercase tracking-widest">Vælg</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {searchTerm.length >= 2 && filteredNames.length === 0 && (
          <p className="mt-4 text-red-400 text-sm">Ingen navne fundet. Tjek stavning.</p>
        )}

        <div className="mt-12 text-gray-400 text-sm italic">
          Kunne du ikke finde dit navn? Kontakt din teamleder.
        </div>
      </div>
    </div>
  );
};

export default NameSearch;
