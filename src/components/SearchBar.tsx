/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigationStore } from '../stores/navigationStore';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useNavigationStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape clears and blurs search
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setSearchQuery('');
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchQuery]);

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
        <Search size={14} />
      </div>
      
      <input
        ref={inputRef}
        type="text"
        placeholder="Search bucket..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full h-8.5 pl-10 pr-14 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:bg-white focus:border-zinc-300 focus:ring-1 focus:ring-zinc-350 focus:outline-hidden text-xs rounded-md transition-all font-sans placeholder-zinc-400 text-zinc-800"
      />

      <div className="absolute inset-y-0 right-3 flex items-center gap-1.5 select-none">
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-0.5 rounded text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
