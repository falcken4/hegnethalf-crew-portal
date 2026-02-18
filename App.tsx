
import React, { useState, useEffect, useMemo } from 'react';
import { useDatasets } from './hooks/useDatasets';
import { formatName } from './constants';
import { OverblikRow } from './types';
import { formatDisplayTime, sortShifts } from './lib/time';
import NamePicker from './components/NamePicker';
import MineVagter from './routes/MineVagter';
import VagtDetalje from './routes/VagtDetalje';
import PraktiskInfo from './routes/PraktiskInfo';

const App: React.FC = () => {
  const { overblik, info, taskDesc, vagter, globalLastUpdated, loading, error, refreshAll, isOffline } = useDatasets();
  const [selectedFullName, setSelectedFullName] = useState<string | null>(localStorage.getItem('crew_selected_fullname'));
  const [activeTab, setActiveTab] = useState<'mine' | 'info'>('mine');
  const [selectedShift, setSelectedShift] = useState<OverblikRow | null>(null);

  useEffect(() => {
    if (selectedFullName) {
      localStorage.setItem('crew_selected_fullname', selectedFullName);
    } else {
      localStorage.removeItem('crew_selected_fullname');
    }
  }, [selectedFullName]);

  const userShifts = useMemo(() => {
    if (!selectedFullName) return [];
    const filtered = overblik.data.filter(s => s.navn.trim() === selectedFullName.trim());
    return sortShifts(filtered);
  }, [overblik.data, selectedFullName]);

  const handleLogout = () => {
    if (confirm('Vil du skifte bruger?')) {
      setSelectedFullName(null);
      setActiveTab('mine');
      setSelectedShift(null);
    }
  };

  // If we have no data at all and we are not loading, show a critical error
  const hasNoData = overblik.data.length === 0 && !loading;

  if (!selectedFullName) {
    return (
      <div className="min-h-screen bg-crew-bg">
        {loading && <div className="fixed top-0 left-0 w-full h-1 bg-crew-primary animate-pulse z-[60]" />}
        {isOffline && (
          <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest py-1 text-center z-[70]">
            Offline – viser gemt data
          </div>
        )}
        {hasNoData ? (
          <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
            <div className="bg-white p-12 rounded-[3rem] shadow-xl max-w-sm w-full border-t-8 border-red-400">
              <h2 className="text-2xl font-black text-gray-800 mb-4">Ingen forbindelse</h2>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed">Kan ikke hente plan lige nu, og der er ingen gemt data på denne enhed.</p>
              <button onClick={refreshAll} className="w-full bg-crew-primary text-white py-4 rounded-2xl font-black shadow-lg">Prøv igen</button>
            </div>
          </div>
        ) : (
          <NamePicker data={overblik.data} onSelect={setSelectedFullName} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crew-bg flex flex-col">
      {/* Top Banner for Offline Status */}
      {isOffline && (
        <div className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest py-1 text-center sticky top-0 z-[60]">
          Offline – viser gemt data
        </div>
      )}

      {/* Top Header */}
      <header className="bg-white px-6 pt-10 pb-6 shadow-sm sticky top-0 z-40 rounded-b-[2.5rem]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-crew-primary tracking-[0.2em] uppercase mb-1">Crew Plan</h1>
            <p className="text-xl font-black text-gray-800 tracking-tight leading-none">
              Hej, <span className="text-crew-primary">{formatName(selectedFullName)}</span>
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all active:scale-90"
            title="Skift bruger"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        <div className="flex justify-between items-center bg-crew-bg/50 px-4 py-3 rounded-2xl">
          <div className="flex items-center text-[10px] text-gray-400 font-black uppercase tracking-widest">
            <span className={`w-2 h-2 rounded-full mr-2 ${loading ? 'bg-crew-primary animate-ping' : isOffline ? 'bg-orange-400' : 'bg-green-400'}`} />
            {loading ? 'Opdaterer...' : `Synkroniseret ${formatDisplayTime(globalLastUpdated)}`}
          </div>
          <button 
            onClick={refreshAll} 
            disabled={loading || isOffline}
            className={`flex items-center text-[10px] font-black uppercase tracking-widest transition-opacity ${loading || isOffline ? 'text-gray-300 opacity-50 cursor-not-allowed' : 'text-crew-primary hover:opacity-70'}`}
          >
            <svg className={`w-3 h-3 mr-1.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Opdater
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow p-6 max-w-xl mx-auto w-full">
        {error && !isOffline && (
          <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100 flex items-start mb-8">
            <svg className="w-5 h-5 text-orange-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-orange-700 font-bold text-sm leading-tight">{error}</p>
          </div>
        )}

        {activeTab === 'mine' ? (
          <MineVagter shifts={userShifts} onSelectShift={setSelectedShift} />
        ) : (
          <PraktiskInfo info={info.data} lastUpdated={info.lastUpdated} />
        )}
      </main>

      {/* Persistent Bottom Nav */}
      <nav className="fixed bottom-6 left-6 right-6 h-20 bg-white/90 backdrop-blur-xl shadow-2xl rounded-[2.5rem] border border-white/20 flex items-stretch p-2 z-40">
        <button 
          onClick={() => setActiveTab('mine')}
          className={`flex-1 flex flex-col items-center justify-center rounded-[2rem] transition-all duration-300 ${activeTab === 'mine' ? 'bg-crew-primary text-white shadow-lg shadow-crew-primary/30' : 'text-gray-300 hover:text-gray-400'}`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Mine vagter</span>
        </button>
        <button 
          onClick={() => setActiveTab('info')}
          className={`flex-1 flex flex-col items-center justify-center rounded-[2rem] transition-all duration-300 ${activeTab === 'info' ? 'bg-crew-primary text-white shadow-lg shadow-crew-primary/30' : 'text-gray-300 hover:text-gray-400'}`}
        >
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Info</span>
        </button>
      </nav>

      {/* Vagt Detalje View */}
      {selectedShift && (
        <VagtDetalje 
          shift={selectedShift}
          vagter={vagter.data}
          descriptions={taskDesc.data}
          onClose={() => setSelectedShift(null)}
        />
      )}
    </div>
  );
};

export default App;
