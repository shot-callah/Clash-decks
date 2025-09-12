import { GoogleGenAI, Type } from "@google/genai";
import type { Card, Tower, StrategyAnalysis, CounterAnalysis, DeckGenerationAnalysis } from '../types';
import { AnalysisType } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const strategySchema = {
  type: Type.OBJECT,
  properties: {
    openingMoves: {
      type: Type.STRING,
      description: "Optimal opening plays and first-minute strategies.",
    },
    mainOffense: {
      type: Type.STRING,
      description: "The primary offensive card combinations and push strategies.",
    },
    keyDefense: {
      type: Type.STRING,
      description: "How to defend against common threats using this deck's cards.",
    },
    weaknesses: {
      type: Type.STRING,
      description: "The main weaknesses of this deck and how to mitigate them.",
    },
    towerSynergy: {
      type: Type.STRING,
      description: "How to best use the selected tower troop with this deck's strategy.",
    },
  },
  required: ["openingMoves", "mainOffense", "keyDefense", "weaknesses", "towerSynergy"]
};

const counterSchema = {
  type: Type.OBJECT,
  properties: {
    counterDeck: {
      type: Type.ARRAY,
      description: "An array of 8 Clash Royale card names that form the counter deck.",
      items: { type: Type.STRING },
    },
    strategy: {
      type: Type.STRING,
      description: "A detailed explanation of how to use the counter deck to defeat the user's deck.",
    },
    counterTower: {
        type: Type.STRING,
        description: "The name of the tower troop (e.g., 'Cannoneer', 'Dagger Duchess') that best counters the user's deck and tower.",
    },
  },
  required: ["counterDeck", "strategy", "counterTower"]
};

const deckGenerationSchema = {
  type: Type.OBJECT,
  properties: {
    generatedDeck: {
      type: Type.ARRAY,
      description: "An array of 8 Clash Royale card names that form a competitive deck based on the user's request.",
      items: { type: Type.STRING },
    },
    strategy: {
      type: Type.STRING,
      description: "A detailed explanation of how to play the generated deck, including offensive and defensive strategies.",
    },
    recommendedTower: {
      type: Type.STRING,
      description: "The name of the single best tower troop to use with the generated deck.",
    },
  },
  required: ["generatedDeck", "strategy", "recommendedTower"],
};

const callGemini = async (prompt: string, schema: object) => {
    try {
        const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
        });

        const jsonString = response.text.trim();
        if (!jsonString) {
        throw new Error("Received an empty response from the API.");
        }
        
        const cleanedJsonString = jsonString.replace(/^```json\s*|```$/g, '').trim();

        return JSON.parse(cleanedJsonString);

    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to get analysis from AI. The model may be unavailable or the request was malformed.");
    }
}

export const getDeckAnalysis = async (deck: Card[], tower: Tower, type: AnalysisType): Promise<StrategyAnalysis | CounterAnalysis> => {
  const cardNames = deck.map(c => c.name).join(', ');
  const towerName = tower.name;

  let prompt: string;
  let schema;

  if (type === AnalysisType.STRATEGY) {
    prompt = `You are an expert Clash Royale strategist. Analyze the following deck: [${cardNames}] being used with the [${towerName}] tower troop. Provide a detailed guide on how to play this deck effectively. Include sections for 'Opening Moves', 'Main Offensive Combos', 'Key Defensive Strategies', 'Weaknesses', and 'Tower Synergy'. Format your response as a JSON object.`;
    schema = strategySchema;
  } else {
    prompt = `You are an expert Clash Royale strategist. Analyze the following deck: [${cardNames}] being used with the [${towerName}] tower troop. Provide a direct counter deck consisting of 8 cards and the single best counter tower troop. Explain the key card matchups and the overall strategy for winning with the counter deck. Format your response as a JSON object.`;
    schema = counterSchema;
  }
  
  return callGemini(prompt, schema);
};

export const generateDeckFromPrompt = async (description: string, arena: number, availableCards: string[]): Promise<DeckGenerationAnalysis> => {
  const prompt = `You are an expert Clash Royale deck builder. A user is in Arena ${arena} and wants to play a deck with the following style: "${description}".

You MUST ONLY use cards from the following list of available cards, which are unlocked at or before the user's arena: [${availableCards.join(', ')}]. Do not suggest any cards not on this list.
A deck can have at most one Evolution card.

Generate a competitive 8-card deck that fits the user's requested style, recommend the single best tower troop to use with it, and provide a detailed strategy guide on how to play the deck effectively. Format your response as a JSON object.`;
  return callGemini(prompt, deckGenerationSchema);
};
