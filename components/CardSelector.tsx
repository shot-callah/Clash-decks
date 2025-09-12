
import React, { useState } from 'react';
import type { Card } from '../types';
import CardSelectionModal from './CardSelectionModal';
import { PlusIcon } from './icons';

interface DeckSlotProps {
  card: Card | null;
  onClick: () => void;
}

const DeckSlot: React.FC<DeckSlotProps> = ({ card, onClick }) => (
  <div
    onClick={onClick}
    className="relative aspect-[3/4] w-full bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-gray-700 transition-all duration-200 group overflow-hidden"
  >
    {card ? (
      <>
        <img src={card.image} alt={card.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-center">
          <p className="text-xs font-semibold truncate">{card.name}</p>
        </div>
         <div className="absolute top-1 right-1 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-gray-900">
          {card.elixir}
        </div>
      </>
    ) : (
      <PlusIcon className="w-8 h-8 text-gray-500 group-hover:text-blue-400" />
    )}
  </div>
);


interface CardSelectorProps {
  deck: (Card | null)[];
  onDeckChange: (newDeck: (Card | null)[]) => void;
}

const CardSelector: React.FC<CardSelectorProps> = ({ deck, onDeckChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSlotClick = (index: number) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleCardSelect = (card: Card) => {
    if (editingIndex !== null) {
      const newDeck = [...deck];
      newDeck[editingIndex] = card;
      onDeckChange(newDeck);
    }
    setIsModalOpen(false);
    setEditingIndex(null);
  };
  
  const calculateAverageElixir = () => {
    const cardsInDeck = deck.filter((c): c is Card => c !== null);
    if (cardsInDeck.length === 0) return '0.0';
    const totalElixir = cardsInDeck.reduce((sum, card) => sum + card.elixir, 0);
    return (totalElixir / cardsInDeck.length).toFixed(1);
  };

  return (
    <>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 md:gap-4 mb-4">
        {deck.map((card, index) => (
          <DeckSlot key={index} card={card} onClick={() => handleSlotClick(index)} />
        ))}
      </div>
      <div className="text-center text-lg text-gray-300">
        Average Elixir: <span className="font-bold text-blue-400">{calculateAverageElixir()}</span>
      </div>
      
      <CardSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectCard={handleCardSelect}
      />
    </>
  );
};

export default CardSelector;
