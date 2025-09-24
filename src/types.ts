import type Decimal from 'break_infinity.js';

// Represents a single task a player can train, like mining copper or chopping logs.
export interface SkillTask {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  experience: number;
  timeToComplete: number; // Duration in milliseconds
  resourceId: string; // The key for the 'resources' object in GameState
  resourceQuantity: number;
}

export type InventoryCategory = 'resource' | 'weapon' | 'armor' | 'consumable' | 'tool' | 'misc';

// Represents items stored in the player's inventory slots.
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  value: number;
  description?: string;
  category: InventoryCategory;
  icon?: string;
  lore?: string;
  uses?: string[];
}

export type InventorySlot = InventoryItem | null;

export interface SavedInventoryItem extends InventoryItem {}
export type SavedInventorySlot = InventoryItem | null;

// Represents the state of a single profession.
export interface ProfessionState {
  id: string;
  name: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  activeTaskIndex: number | null;
  isPaused: boolean; // True when the active task is paused
  taskProgress: number; // Current progress in milliseconds
  tasks: SkillTask[];
}

// Represents the entire game state.
export interface GameState {
  resources: { [key: string]: Decimal };
  professions: ProfessionState[];
  inventory: InventorySlot[];
  inventoryCapacity: number;
}

// Represents the game state structure for saving to Firestore.
export interface SavedGameState {
  resources: { [key: string]: string };
  professions: ProfessionState[];
  inventory?: SavedInventorySlot[];
  inventoryCapacity?: number;
  savedAt?: number;
  saveName?: string;
  slotName?: string;
}

export type SavedGameSlotMap = Record<string, SavedGameState>;

export interface SavedGameDocument {
  current?: SavedGameState;
  slots?: SavedGameSlotMap;
  lastSlot?: string;
}
