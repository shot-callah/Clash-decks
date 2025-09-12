import React, { useState, useCallback } from 'react';
import type { Card, Tower, StrategyAnalysis, CounterAnalysis, DeckGenerationAnalysis } from './types';
import { AnalysisType } from './types';
import { getDeckAnalysis, generateDeckFromPrompt } from './services/geminiService';
import CardSelector from './components/CardSelector';
import ResultDisplay from './components/ResultDisplay';
import TowerSelector from './components/TowerSelector';
import { ClashRoyaleIcon, LightbulbIcon } from './components/icons';
import { CARDS, ARENAS } from './constants';

const App: React.FC = () => {
  const [deck, setDeck] = useState<(Card | null)[]>(Array(8).fill(null));
  const [tower, setTower] = useState<Tower | null>(null);
  const [deckPrompt, setDeckPrompt] = useState<string>('');
  const [selectedArena, setSelectedArena] = useState<number>(23);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<StrategyAnalysis | CounterAnalysis | DeckGenerationAnalysis | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType | null>(null);

  const isDeckComplete = deck.every(card => card !== null) && tower !== null;

  const handleDeckChange = (newDeck: (Card | null)[]) => {
    setDeck(newDeck);
  };

  const handleTowerChange = (newTower: Tower | null) => {
    setTower(newTower);
  };

  const handleDeckAnalysis = useCallback(async (type: AnalysisType) => {
    if (!isDeckComplete) {
      setError("Please select 8 cards and a tower to form a complete deck.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setAnalysisType(type);

    try {
      const result = await getDeckAnalysis(deck as Card[], tower as Tower, type);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [deck, tower, isDeckComplete]);

  const handleDeckGeneration = useCallback(async () => {
    if (!deckPrompt.trim()) {
      setError("Please describe the kind of deck you want to build.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setAnalysisType(AnalysisType.DECK_GENERATION);

    try {
      const availableCards = CARDS.filter(card => card.arena <= selectedArena);
      const availableCardNames = availableCards.map(card => card.name);
      
      const result = await generateDeckFromPrompt(deckPrompt, selectedArena, availableCardNames);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [deckPrompt, selectedArena]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <ClashRoyaleIcon className="w-12 h-12 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Clash Royale Deck Strategist
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Build your deck, choose your tower, and let Gemini AI reveal its secrets.
          </p>
        </header>

        <main>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-4 text-center">Deck Analyzer</h2>
              <CardSelector deck={deck} onDeckChange={handleDeckChange} />
              <h3 className="text-xl font-semibold my-4 text-center">Your Tower</h3>
              <TowerSelector selectedTower={tower} onTowerChange={handleTowerChange} />
               <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
                <button
                  onClick={() => handleDeckAnalysis(AnalysisType.STRATEGY)}
                  disabled={!isDeckComplete || isLoading}
                  className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading && analysisType === AnalysisType.STRATEGY ? 'Analyzing...' : 'Get Play Strategy'}
                </button>
                <button
                  onClick={() => handleDeckAnalysis(AnalysisType.COUNTER)}
                  disabled={!isDeckComplete || isLoading}
                  className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading && analysisType === AnalysisType.COUNTER ? 'Analyzing...' : 'Find Counter Deck'}
                </button>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl flex flex-col">
              <h2 className="text-2xl font-semibold mb-4 text-center">AI Deck Generator</h2>
              <p className="text-center text-gray-400 mb-4">Describe your ideal playstyle, and let AI build you a deck.</p>
              
              <div className="mb-4">
                <label htmlFor="arena-select" className="block text-sm font-medium text-gray-300 mb-2">Your Arena:</label>
                <select
                  id="arena-select"
                  value={selectedArena}
                  onChange={(e) => setSelectedArena(Number(e.target.value))}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  {ARENAS.map(arena => (
                    <option key={arena.number} value={arena.number}>
                      Arena {arena.number}: {arena.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={deckPrompt}
                onChange={(e) => setDeckPrompt(e.target.value)}
                placeholder="e.g., a fast hog rider cycle deck, a heavy golem beatdown deck, or a defensive x-bow control deck..."
                className="w-full flex-grow bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none mb-4"
                rows={5}
                disabled={isLoading}
              ></textarea>
               <button
                  onClick={handleDeckGeneration}
                  disabled={!deckPrompt.trim() || isLoading}
                  className="w-full px-8 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <LightbulbIcon className="w-6 h-6" />
                  {isLoading && analysisType === AnalysisType.DECK_GENERATION ? 'Generating...' : 'Generate Deck'}
                </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center mb-8" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <ResultDisplay
            isLoading={isLoading}
            analysisResult={analysisResult}
            analysisType={analysisType}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
