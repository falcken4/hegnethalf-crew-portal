
import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PracticalInfoItem } from '../types';
import { formatDisplayTime } from '../lib/time';

interface PraktiskInfoProps {
  info: PracticalInfoItem[];
  lastUpdated: string | null;
}

const PraktiskInfo: React.FC<PraktiskInfoProps> = ({ info, lastUpdated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredAndGroupedInfo = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    // Filter
    const filtered = query === '' 
      ? info 
      : info.filter(item => 
          item.title.toLowerCase().includes(query) || 
          item.bodyMarkdown.toLowerCase().includes(query) ||
          item.section.toLowerCase().includes(query)
        );

    // Group by section
    const groups: Record<string, PracticalInfoItem[]> = {};
    filtered.forEach(item => {
      const sec = item.section || 'Diverse';
      if (!groups[sec]) groups[sec] = [];
      groups[sec].push(item);
    });

    // Sort items within sections by SortOrder and sections alphabetically
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b, 'da'))
      .map(([section, items]) => {
        return {
          section,
          items: items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        };
      });
  }, [info, searchQuery]);

  return (
    <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search Header */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Søg i praktisk info..."
          className="w-full bg-white border-2 border-transparent focus:border-crew-primary px-12 py-4 rounded-2xl text-lg font-bold text-gray-800 outline-none shadow-sm transition-all placeholder:text-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {filteredAndGroupedInfo.length === 0 ? (
        <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Ingen resultater</p>
          <p className="text-gray-300 text-xs mt-1">Prøv et andet søgeord</p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredAndGroupedInfo.map(({ section, items }) => (
            <div key={section} className="space-y-4">
              <div className="px-2 flex justify-between items-end">
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{section}</h2>
                <span className="text-[10px] font-black text-crew-primary/30 uppercase tracking-widest">
                  {items.length} {items.length === 1 ? 'emne' : 'emner'}
                </span>
              </div>
              
              <div className="grid gap-3">
                {items.map((item, idx) => {
                  const itemId = `${section}-${item.title}-${idx}`;
                  const isOpen = openItems[itemId];

                  return (
                    <div 
                      key={itemId} 
                      className={`bg-white rounded-[2rem] border transition-all duration-300 overflow-hidden ${isOpen ? 'border-crew-primary shadow-xl shadow-crew-primary/5 ring-4 ring-crew-primary/5' : 'border-gray-100 shadow-sm'}`}
                    >
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full px-6 py-5 flex justify-between items-center text-left active:bg-gray-50 transition-colors"
                      >
                        <span className={`text-lg font-black transition-colors ${isOpen ? 'text-crew-primary' : 'text-gray-800'}`}>
                          {item.title}
                        </span>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isOpen ? 'bg-crew-primary text-white rotate-180' : 'bg-crew-bg text-crew-primary'}`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-8 pb-8 pt-2 animate-in slide-in-from-top-2 duration-300">
                          <div className="prose prose-slate prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-strong:text-crew-primary prose-a:text-crew-primary prose-li:text-gray-600">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {item.bodyMarkdown}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer info */}
      <div className="mt-12 text-center">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
          Sidst opdateret: {formatDisplayTime(lastUpdated)}
        </p>
      </div>
    </div>
  );
};

export default PraktiskInfo;
