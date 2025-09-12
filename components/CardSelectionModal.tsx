
import React, { useState, useMemo } from 'react';
import { CARDS } from '../constants';
import type { Card } from '../types';
import { SearchIcon, XIcon } from './icons';

interface CardSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCard: (card: Card) => void;
}

const CardSelectionModal: React.FC<CardSelectionModalProps> = ({ isOpen, onClose, onSelectCard }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCards = useMemo(() => {
    return CARDS.filter(card =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.elixir - b.elixir || a.name.localeCompare(b.name));
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-gray-700 sticky top-0 bg-gray-800">
          <h2 className="text-xl font-bold text-white">Select a Card</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 border-b border-gray-700 sticky top-[65px] bg-gray-800 z-10">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search cards..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-gray-400"/>
                </div>
            </div>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {filteredCards.map(card => (
              <div
                key={card.name}
                className="relative aspect-[3/4] cursor-pointer group"
                onClick={() => onSelectCard(card)}
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover rounded-lg border-2 border-transparent group-hover:border-blue-500 group-hover:scale-105 transition-all duration-200"
                />
                <div className="absolute top-1 right-1 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-gray-900">
                  {card.elixir}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-center">
                  <p className="text-xs font-semibold truncate">{card.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSelectionModal;
