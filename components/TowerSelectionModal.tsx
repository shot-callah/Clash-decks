import React from 'react';
import { TOWERS } from '../constants';
import type { Tower } from '../types';
import { XIcon } from './icons';

interface TowerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTower: (tower: Tower) => void;
}

const TowerSelectionModal: React.FC<TowerSelectionModalProps> = ({ isOpen, onClose, onSelectTower }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 flex justify-between items-center border-b border-gray-700 sticky top-0 bg-gray-800">
          <h2 className="text-xl font-bold text-white">Select a Tower</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TOWERS.map(tower => (
              <div
                key={tower.name}
                className="relative aspect-[3/4] cursor-pointer group"
                onClick={() => onSelectTower(tower)}
              >
                <img
                  src={tower.image}
                  alt={tower.name}
                  className="w-full h-full object-cover rounded-lg border-2 border-transparent group-hover:border-purple-500 group-hover:scale-105 transition-all duration-200"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-center">
                  <p className="text-sm font-semibold truncate">{tower.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TowerSelectionModal;
