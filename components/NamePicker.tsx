
import React, { useState, useMemo } from 'react';
import { OverblikRow } from '../types';
import { formatName } from '../constants';

interface NamePickerProps {
  data: OverblikRow[];
  onSelect: (fullName: string) => void;
}

const NamePicker: React.FC<NamePickerProps> = ({ data, onSelect }) => {
  const [query, setQuery] = useState('');

  const uniqueNames = useMemo(() => {
    const names = Array.from(new Set(data.map(row => row.navn.trim())));
    return names.sort((a, b) => a.localeCompare(b, 'da'));
  }, [data]);

  const suggestions = useMemo(() => {
    if (query.trim().length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return uniqueNames.filter(name => 
      name.toLowerCase().includes(lowerQuery)
    ).slice(0, 8);
  }, [uniqueNames, query]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl border-t-8 border-crew-primary">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-crew-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-crew-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">Find din plan</h1>
          <p className="text-gray-500 font-medium leading-relaxed">Søg på dit fulde navn for at se dine vagter</p>
        </div>

        <div className="relative">
          <input
            type="text"
            className="w-full bg-crew-bg border-2 border-transparent focus:border-crew-primary focus:bg-white px-6 py-5 rounded-2xl text-lg font-bold text-gray-800 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium shadow-inner"
            placeholder="Dit fulde navn..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />

          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-50">
              {suggestions.map((name) => (
                <button
                  key={name}
                  onClick={() => onSelect(name)}
                  className="w-full px-6 py-4 text-left hover:bg-crew-bg flex justify-between items-center group transition-colors border-b border-gray-50 last:border-0"
                >
                  <span className="font-bold text-gray-700 group-hover:text-crew-primary transition-colors">
                    {formatName(name)}
                  </span>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-crew-primary transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        {query.length >= 2 && suggestions.length === 0 && (
          <div className="mt-4 p-4 bg-orange-50 rounded-xl text-orange-600 text-sm font-bold flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Ingen match fundet
          </div>
        )}
      </div>
    </div>
  );
};

export default NamePicker;
