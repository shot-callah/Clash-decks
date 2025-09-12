import React, { useState } from 'react';
import type { Tower } from '../types';
import TowerSelectionModal from './TowerSelectionModal';
import { PlusIcon } from './icons';

interface TowerSelectorProps {
  selectedTower: Tower | null;
  onTowerChange: (tower: Tower | null) => void;
}

const TowerSelector: React.FC<TowerSelectorProps> = ({ selectedTower, onTowerChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectTower = (tower: Tower) => {
    onTowerChange(tower);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-center">
        <div
          onClick={() => setIsModalOpen(true)}
          className="relative aspect-[3/4] w-24 bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-gray-700 transition-all duration-200 group overflow-hidden"
        >
          {selectedTower ? (
            <>
              <img src={selectedTower.image} alt={selectedTower.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-center">
                <p className="text-xs font-semibold truncate">{selectedTower.name}</p>
              </div>
            </>
          ) : (
            <PlusIcon className="w-8 h-8 text-gray-500 group-hover:text-purple-400" />
          )}
        </div>
      </div>
      <TowerSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectTower={handleSelectTower}
      />
    </>
  );
};

export default TowerSelector;
