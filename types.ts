export interface Card {
  name: string;
  image: string;
  elixir: number;
  arena: number;
}

export interface Tower {
  name: string;
  image: string;
}

export enum AnalysisType {
  STRATEGY = 'strategy',
  COUNTER = 'counter',
  DECK_GENERATION = 'deck_generation',
}

export interface StrategyAnalysis {
  openingMoves: string;
  mainOffense: string;
  keyDefense: string;
  weaknesses: string;
  towerSynergy: string;
}

export interface CounterAnalysis {
  counterDeck: string[];
  strategy: string;
  counterTower: string;
}

export interface DeckGenerationAnalysis {
  generatedDeck: string[];
  strategy: string;
  recommendedTower: string;
}
