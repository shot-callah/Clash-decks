import React from 'react';
import { CARD_MAP, TOWER_MAP } from '../constants';
import type { Card, DeckGenerationAnalysis, CounterAnalysis, StrategyAnalysis } from '../types';
import { AnalysisType } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { BrainIcon, SwordsIcon, TowerIcon, LightbulbIcon } from './icons';

interface ResultDisplayProps {
  isLoading: boolean;
  analysisResult: StrategyAnalysis | CounterAnalysis | DeckGenerationAnalysis | null;
  analysisType: AnalysisType | null;
}

const CounterDeckDisplay: React.FC<{ analysis: CounterAnalysis }> = ({ analysis }) => {
  const counterDeckCards = analysis.counterDeck
    .map(cardName => CARD_MAP.get(cardName.toLowerCase()))
    .filter((c): c is Card => c !== undefined);
  
  const counterTower = TOWER_MAP.get(analysis.counterTower.toLowerCase());

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-grow">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><SwordsIcon className="w-7 h-7" /> Counter Deck</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 md:gap-4 bg-gray-900/50 p-4 rounded-lg">
                {counterDeckCards.map((card) => (
                <div key={card.name} className="relative aspect-[3/4]">
                    <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-lg" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-center">
                    <p className="text-xs font-semibold truncate">{card.name}</p>
                    </div>
                    <div className="absolute top-1 right-1 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-gray-900">
                    {card.elixir}
                    </div>
                </div>
                ))}
            </div>
        </div>
        {counterTower && (
            <div className="flex-shrink-0">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><TowerIcon className="w-7 h-7" /> Counter Tower</h3>
                <div className="bg-gray-900/50 p-4 rounded-lg flex items-center justify-center">
                    <div className="relative aspect-[3/4] w-24">
                        <img src={counterTower.image} alt={counterTower.name} className="w-full h-full object-cover rounded-lg" />
                         <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-center">
                           <p className="text-xs font-semibold truncate">{counterTower.name}</p>
                         </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><BrainIcon className="w-7 h-7" /> Counter Strategy</h3>
      <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
        <p>{analysis.strategy}</p>
      </div>
    </>
  );
};

const StrategyDisplay: React.FC<{ analysis: StrategyAnalysis }> = ({ analysis }) => (
  <>
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2 text-blue-400">Opening Moves</h3>
        <p className="text-gray-300 whitespace-pre-wrap">{analysis.openingMoves}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-blue-400">Main Offense</h3>
        <p className="text-gray-300 whitespace-pre-wrap">{analysis.mainOffense}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-blue-400">Key Defense</h3>
        <p className="text-gray-300 whitespace-pre-wrap">{analysis.keyDefense}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-teal-400">Tower Synergy</h3>
        <p className="text-gray-300 whitespace-pre-wrap">{analysis.towerSynergy}</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-red-400">Weaknesses</h3>
        <p className="text-gray-300 whitespace-pre-wrap">{analysis.weaknesses}</p>
      </div>
    </div>
  </>
);

const DeckGenerationDisplay: React.FC<{ analysis: DeckGenerationAnalysis }> = ({ analysis }) => {
  const generatedDeckCards = analysis.generatedDeck
    .map(cardName => CARD_MAP.get(cardName.toLowerCase()))
    .filter((c): c is Card => c !== undefined);
  
  const recommendedTower = TOWER_MAP.get(analysis.recommendedTower.toLowerCase());

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-grow">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><LightbulbIcon className="w-7 h-7 text-green-400" /> Generated Deck</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 md:gap-4 bg-gray-900/50 p-4 rounded-lg">
                {generatedDeckCards.map((card) => (
                <div key={card.name} className="relative aspect-[3/4]">
                    <img src={card.image} alt={card.name} className="w-full h-full object-cover rounded-lg" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-center">
                    <p className="text-xs font-semibold truncate">{card.name}</p>
                    </div>
                    <div className="absolute top-1 right-1 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold border-2 border-gray-900">
                    {card.elixir}
                    </div>
                </div>
                ))}
            </div>
        </div>
        {recommendedTower && (
            <div className="flex-shrink-0">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><TowerIcon className="w-7 h-7" /> Recommended Tower</h3>
                <div className="bg-gray-900/50 p-4 rounded-lg flex items-center justify-center">
                    <div className="relative aspect-[3/4] w-24">
                        <img src={recommendedTower.image} alt={recommendedTower.name} className="w-full h-full object-cover rounded-lg" />
                         <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-center">
                           <p className="text-xs font-semibold truncate">{recommendedTower.name}</p>
                         </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><BrainIcon className="w-7 h-7" /> Play Strategy</h3>
      <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
        <p>{analysis.strategy}</p>
      </div>
    </>
  );
};


const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, analysisResult, analysisType }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 border border-gray-700 rounded-2xl min-h-[200px]">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-gray-300">AI is analyzing your deck...</p>
      </div>
    );
  }

  if (!analysisResult || !analysisType) {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 border border-gray-700 rounded-2xl min-h-[200px]">
           <BrainIcon className="w-16 h-16 text-gray-600 mb-4" />
           <p className="text-lg text-gray-400 text-center">Your analysis will appear here. Analyze your deck or generate a new one!</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl">
      {analysisType === AnalysisType.COUNTER && <CounterDeckDisplay analysis={analysisResult as CounterAnalysis} />}
      {analysisType === AnalysisType.STRATEGY && <StrategyDisplay analysis={analysisResult as StrategyAnalysis} />}
      {analysisType === AnalysisType.DECK_GENERATION && <DeckGenerationDisplay analysis={analysisResult as DeckGenerationAnalysis} />}
    </div>
  );
};

export default ResultDisplay;
