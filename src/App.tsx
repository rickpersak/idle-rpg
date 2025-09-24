// src/App.tsx
import { useState, useEffect, useRef } from 'react';
import Decimal from 'break_infinity.js';
import { auth, db } from './firebase';
import { signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Dashboard } from './components/Dashboard';
import { InventoryModal } from './components/InventoryModal';
import { NotificationCenter } from './components/NotificationCenter';
import { MainMenu } from './components/MainMenu';
import { SettingsModal } from './components/SettingsModal';
import { CreditsModal } from './components/CreditsModal';
import { SaveSlotsModal } from './components/SaveSlotsModal';
import type {
  GameState,
  ProfessionState,
  SkillTask,
  SavedGameState,
  SavedGameDocument,
  InventoryItem,
  InventorySlot,
} from './types';

const BASE_INVENTORY_CAPACITY = 25;
const INVENTORY_UPGRADE_STEP = 5;
const TICK_RATE = 100; // ms
const SETTINGS_STORAGE_KEY = 'idle-rpg::settings';

const calculateXPForNextLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.25, level - 1));
};

const loadSettings = () => {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (error) {
    console.warn('Failed to parse saved settings', error);
    return DEFAULT_SETTINGS;
  }
};

const slugify = (input: string) => {
  const trimmed = input.trim().toLowerCase();
  const slug = trimmed.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug || `save-${Date.now()}`;
};

const formatLastSaveLabel = (timestamp?: number) => {
  if (!timestamp) {
    return undefined;
  }
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) {
    return 'Just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

type GameSettings = {
  musicVolume: number;
  effectsVolume: number;
  showTooltips: boolean;
  showNotifications: boolean;
};

const DEFAULT_SETTINGS: GameSettings = {
  musicVolume: 70,
  effectsVolume: 80,
  showTooltips: true,
  showNotifications: true,
};

type LootGain = {
  id: string;
  name: string;
  quantity: number;
};

type NotificationType = 'gain' | 'sell' | 'warning';

type NotificationMessage = {
  id: string;
  message: string;
  type: NotificationType;
};

const MINING_TASKS: SkillTask[] = [
  { id: 'copper_ore', name: 'Mine Copper Ore', description: 'Basic ore found in surface rocks.', requiredLevel: 1, experience: 10, timeToComplete: 3000, resourceId: 'Copper Ore', resourceQuantity: 1 },
  { id: 'tin_ore', name: 'Mine Tin Ore', description: 'A soft metal often mixed with copper.', requiredLevel: 1, experience: 10, timeToComplete: 3000, resourceId: 'Tin Ore', resourceQuantity: 1 },
  { id: 'iron_ore', name: 'Mine Iron Ore', description: 'A common and sturdy metal.', requiredLevel: 15, experience: 35, timeToComplete: 5000, resourceId: 'Iron Ore', resourceQuantity: 1 },
  { id: 'coal', name: 'Mine Coal', description: 'A vital fuel for smelting.', requiredLevel: 30, experience: 50, timeToComplete: 7000, resourceId: 'Coal', resourceQuantity: 1 },
];

const WOODCUTTING_TASKS: SkillTask[] = [
  { id: 'logs', name: 'Chop Trees', description: 'Standard logs from common trees.', requiredLevel: 1, experience: 25, timeToComplete: 4000, resourceId: 'Logs', resourceQuantity: 1 },
  { id: 'oak_logs', name: 'Chop Oak Trees', description: 'Sturdy logs from mighty oaks.', requiredLevel: 15, experience: 60, timeToComplete: 8000, resourceId: 'Oak Logs', resourceQuantity: 1 },
];

const PROFESSION_TEMPLATES: Array<Pick<ProfessionState, 'id' | 'name' | 'tasks'>> = [
  { id: 'mining', name: 'Mining', tasks: MINING_TASKS },
  { id: 'woodcutting', name: 'Woodcutting', tasks: WOODCUTTING_TASKS },
  { id: 'fishing', name: 'Fishing', tasks: [] },
  { id: 'farming', name: 'Farming', tasks: [] },
];

type ItemDefinition = {
  name: string;
  value: number;
  description: string;
  category: InventoryItem['category'];
  icon: string;
  lore?: string;
  uses?: string[];
};

const ITEM_CATALOG: Record<string, ItemDefinition> = {
  'Copper Ore': {
    name: 'Copper Ore',
    value: 4,
    description: 'A malleable metal good for early smithing recipes.',
    category: 'resource',
    icon: '??',
    lore: 'Weathered miners swear you can smell the tang of copper before you see it.',
    uses: ['Bronze Bars', 'Basic Smithing Contracts'],
  },
  'Tin Ore': {
    name: 'Tin Ore',
    value: 5,
    description: 'Combine with copper to create sturdy bronze alloys.',
    category: 'resource',
    icon: '?',
    lore: 'Soft to the touch, but priceless when alloyed.',
    uses: ['Bronze Bars'],
  },
  'Iron Ore': {
    name: 'Iron Ore',
    value: 8,
    description: 'A dependable ore used in everyday equipment.',
    category: 'resource',
    icon: '??',
    lore: 'The backbone of every blacksmith.',
    uses: ['Iron Bars', 'Fortified Tools'],
  },
  'Coal': {
    name: 'Coal',
    value: 6,
    description: 'Essential fuel for forges and cooking fires alike.',
    category: 'resource',
    icon: '??',
    lore: 'Still warm from the depths below.',
    uses: ['Furnace Fuel', 'Campfire Meals'],
  },
  'Logs': {
    name: 'Logs',
    value: 3,
    description: 'Fresh-cut timber, perfect for crafting basic structures.',
    category: 'resource',
    icon: '??',
    lore: 'Sap still clings to the bark.',
    uses: ['Campfire', 'Simple Bows'],
  },
  'Oak Logs': {
    name: 'Oak Logs',
    value: 7,
    description: 'Dense hardwood prized by skilled carpenters.',
    category: 'resource',
    icon: '??',
    lore: 'The rings whisper stories of centuries.',
    uses: ['Reinforced Beams', 'Carved Furniture'],
  },
};

const DEFAULT_ITEM_META: ItemDefinition = {
  name: 'Mysterious Find',
  value: 2,
  description: 'A curious item recovered during your travels.',
  category: 'misc',
  icon: '??',
  lore: 'You are not entirely sure what this does, but it looks important.',
};

const getItemDefinition = (resourceId: string): ItemDefinition => {
  return ITEM_CATALOG[resourceId] ?? { ...DEFAULT_ITEM_META, name: resourceId };
};

const createInitialInventory = (capacity: number): InventorySlot[] =>
  Array.from({ length: capacity }, () => null);

const createInitialProfessions = (): ProfessionState[] =>
  PROFESSION_TEMPLATES.map(template => ({
    id: template.id,
    name: template.name,
    level: 1,
    currentXP: 0,
    xpToNextLevel: calculateXPForNextLevel(1),
    activeTaskIndex: null,
    isPaused: false,
    taskProgress: 0,
    tasks: template.tasks,
  }));

const createInitialGameState = (): GameState => ({
  resources: { gold: new Decimal(10) },
  professions: createInitialProfessions(),
  inventory: createInitialInventory(BASE_INVENTORY_CAPACITY),
  inventoryCapacity: BASE_INVENTORY_CAPACITY,
});

const calculateInventoryUpgradeCost = (capacity: number): number => {
  const upgradesPurchased = Math.max(0, Math.floor((capacity - BASE_INVENTORY_CAPACITY) / INVENTORY_UPGRADE_STEP));
  return Math.round(250 * Math.pow(1.6, upgradesPurchased));
};

type MergeInventoryResult = {
  updatedInventory: InventorySlot[];
  added: LootGain[];
  rejected: LootGain[];
};

const mergeInventoryWithCapacity = (
  inventory: InventorySlot[],
  loot: LootGain[],
  capacity: number,
): MergeInventoryResult => {
  if (loot.length === 0) {
    return { updatedInventory: inventory, added: [], rejected: [] };
  }

  const slots: InventorySlot[] = [...inventory];
  while (slots.length < capacity) {
    slots.push(null);
  }

  const addedTracker = new Map<string, LootGain>();
  const rejectedTracker = new Map<string, LootGain>();

  const recordGain = (tracker: Map<string, LootGain>, gain: LootGain) => {
    const existing = tracker.get(gain.id);
    if (existing) {
      existing.quantity += gain.quantity;
    } else {
      tracker.set(gain.id, { ...gain });
    }
  };

  loot.forEach(gain => {
    const existingIndex = slots.findIndex(slot => slot && slot.id === gain.id);

    if (existingIndex !== -1) {
      const slot = slots[existingIndex];
      if (slot) {
        slot.quantity += gain.quantity;
      }
      recordGain(addedTracker, gain);
      return;
    }

    const emptyIndex = slots.findIndex(slot => slot === null);
    if (emptyIndex !== -1) {
      const definition = getItemDefinition(gain.id);
      slots[emptyIndex] = {
        id: gain.id,
        name: definition.name,
        quantity: gain.quantity,
        value: definition.value,
        description: definition.description,
        category: definition.category,
        icon: definition.icon,
        lore: definition.lore,
        uses: definition.uses,
      };
      recordGain(addedTracker, gain);
      return;
    }

    recordGain(rejectedTracker, gain);
  });

  if (slots.length > capacity) {
    slots.length = capacity;
  }

  return {
    updatedInventory: slots,
    added: Array.from(addedTracker.values()),
    rejected: Array.from(rejectedTracker.values()),
  };
};

const serializeGameState = (state: GameState, overrides?: Partial<SavedGameState>): SavedGameState => ({
  resources: Object.fromEntries(
    Object.entries(state.resources).map(([key, value]) => [key, value.toString()])
  ),
  professions: state.professions.map(prof => ({ ...prof })),
  inventory: state.inventory.map(slot => (slot ? { ...slot } : null)),
  inventoryCapacity: state.inventoryCapacity,
  savedAt: Date.now(),
  ...overrides,
});

const hydrateSavedGame = (saved: SavedGameState): GameState => {
  const capacity = saved.inventoryCapacity ?? BASE_INVENTORY_CAPACITY;
  const baseInventory = createInitialInventory(capacity);
  (saved.inventory ?? []).forEach((slot, index) => {
    if (index < baseInventory.length) {
      baseInventory[index] = slot ? { ...slot } : null;
    }
  });

  const resources = Object.fromEntries(
    Object.entries(saved.resources ?? { gold: '10' }).map(([key, value]) => [key, new Decimal(value)])
  );

  return {
    resources,
    professions: (saved.professions ?? []).map(prof => ({ ...prof })),
    inventory: baseInventory,
    inventoryCapacity: capacity,
  };
};

const parseSavedDocument = (data: any): SavedGameDocument => {
  if (!data) {
    return { slots: {} };
  }

  if (data.resources) {
    const legacy = data as SavedGameState;
    const snapshot: SavedGameState = {
      ...legacy,
      savedAt: legacy.savedAt ?? Date.now(),
      slotName: legacy.slotName ?? 'autosave',
      saveName: legacy.saveName ?? 'Autosave',
    };
    return {
      current: snapshot,
      slots: { autosave: snapshot },
      lastSlot: 'autosave',
    };
  }

  const docData = data as SavedGameDocument;
  const slots: Record<string, SavedGameState> = {};

  if (docData.slots) {
    Object.entries(docData.slots).forEach(([key, value]) => {
      slots[key] = {
        ...value,
        slotName: value.slotName ?? key,
        saveName: value.saveName ?? key,
        savedAt: value.savedAt ?? Date.now(),
      };
    });
  }

  if (docData.current) {
    const currentSnapshot: SavedGameState = {
      ...docData.current,
      slotName: docData.current.slotName ?? 'autosave',
      saveName: docData.current.saveName ?? 'Autosave',
      savedAt: docData.current.savedAt ?? Date.now(),
    };
    slots[currentSnapshot.slotName ?? 'autosave'] = currentSnapshot;
    return {
      current: currentSnapshot,
      slots,
      lastSlot: docData.lastSlot ?? currentSnapshot.slotName ?? 'autosave',
    };
  }

  return {
    slots,
    lastSlot: docData.lastSlot,
  };
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [hasNewInventoryItems, setHasNewInventoryItems] = useState(false);
  const [highlightedItems, setHighlightedItems] = useState<string[]>([]);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(true);
  const [menuStatus, setMenuStatus] = useState<'loading' | 'ready'>('loading');
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [savedDoc, setSavedDoc] = useState<SavedGameDocument | null>(null);

  const gameStateRef = useRef(gameState);
  const notificationTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const highlightTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const settingsRef = useRef(settings);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    settingsRef.current = settings;
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to persist settings', error);
    }
    document.body.dataset.tooltips = settings.showTooltips ? 'enabled' : 'disabled';
  }, [settings]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        setUser(currentUser);
        setMenuStatus('loading');
        try {
          const snap = await getDoc(doc(db, 'users', currentUser.uid));
          const parsed = snap.exists() ? parseSavedDocument(snap.data()) : { slots: {} };
          setSavedDoc(parsed);
        } catch (error) {
          console.error('Failed to retrieve saved games', error);
          setSavedDoc({ slots: {} });
        } finally {
          setMenuStatus('ready');
          setIsMainMenuOpen(true);
          setHasActiveSession(false);
        }
      } else {
        setUser(null);
        setSavedDoc({ slots: {} });
        setHasActiveSession(false);
        setMenuStatus('loading');
        setIsMainMenuOpen(true);
        await signInAnonymously(auth);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    return () => {
      Object.values(notificationTimeouts.current).forEach(clearTimeout);
      Object.values(highlightTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (!isInventoryOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsInventoryOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInventoryOpen]);

  useEffect(() => {
    if (isInventoryOpen) {
      setHasNewInventoryItems(false);
    }
  }, [isInventoryOpen]);

  useEffect(() => {
    if (!hasActiveSession) {
      return;
    }

    const interval = setInterval(() => {
      const addedLoot: LootGain[] = [];
      const rejectedLoot: LootGain[] = [];

      setGameState(prev => {
        let hasChanges = false;
        const lootCollector: Record<string, LootGain> = {};

        const professions = prev.professions.map(prof => {
          if (prof.activeTaskIndex === null || prof.isPaused) {
            return prof;
          }

          const activeTask = prof.tasks[prof.activeTaskIndex];
          if (!activeTask || prof.level < activeTask.requiredLevel) {
            if (prof.activeTaskIndex !== null || prof.taskProgress !== 0) {
              hasChanges = true;
            }
            return { ...prof, activeTaskIndex: null, isPaused: false, taskProgress: 0 };
          }

          const progress = prof.taskProgress + TICK_RATE;
          const taskDuration = Math.max(activeTask.timeToComplete, 1);
          const completions = Math.floor(progress / taskDuration);
          let newProgress = progress;
          let newLevel = prof.level;
          let newXP = prof.currentXP;
          let xpToNext = prof.xpToNextLevel;

          if (completions > 0) {
            hasChanges = true;
            newProgress = progress % taskDuration;

            const lootQuantity = activeTask.resourceQuantity * completions;
            if (lootQuantity > 0) {
              const definition = getItemDefinition(activeTask.resourceId);
              const existing = lootCollector[activeTask.resourceId];
              if (existing) {
                existing.quantity += lootQuantity;
              } else {
                lootCollector[activeTask.resourceId] = {
                  id: activeTask.resourceId,
                  name: definition.name,
                  quantity: lootQuantity,
                };
              }
            }

            for (let i = 0; i < completions; i += 1) {
              newXP += activeTask.experience;
              while (newXP >= xpToNext) {
                newXP -= xpToNext;
                newLevel += 1;
                xpToNext = calculateXPForNextLevel(newLevel);
              }
            }
          } else if (newProgress !== prof.taskProgress) {
            hasChanges = true;
          }

          return {
            ...prof,
            level: newLevel,
            currentXP: newXP,
            xpToNextLevel: xpToNext,
            taskProgress: newProgress,
          };
        });

        const lootList = Object.values(lootCollector);
        const mergeResult = mergeInventoryWithCapacity(prev.inventory, lootList, prev.inventoryCapacity);
        if (mergeResult.added.length > 0) {
          addedLoot.push(...mergeResult.added);
        }
        if (mergeResult.rejected.length > 0) {
          rejectedLoot.push(...mergeResult.rejected);
        }

        if (!hasChanges && mergeResult.added.length === 0 && mergeResult.rejected.length === 0) {
          return prev;
        }

        const updatedResources = { ...prev.resources };
        mergeResult.added.forEach(gain => {
          const currentAmount = updatedResources[gain.id] || new Decimal(0);
          updatedResources[gain.id] = currentAmount.add(gain.quantity);
        });

        return {
          ...prev,
          professions,
          resources: updatedResources,
          inventory: mergeResult.updatedInventory,
        };
      });

      if (addedLoot.length > 0) {
        addedLoot.forEach(gain => {
          pushNotification(`+${gain.quantity} ${gain.name}`, 'gain');
        });
        markItemsHighlighted(addedLoot.map(item => item.id));
        setHasNewInventoryItems(true);
      }

      if (rejectedLoot.length > 0) {
        rejectedLoot.forEach(gain => {
          pushNotification(`Inventory full! Lost ${gain.quantity} ${gain.name}.`, 'warning');
        });
      }
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [hasActiveSession]);

  useEffect(() => {
    if (!user || !hasActiveSession) {
      return undefined;
    }

    const interval = setInterval(() => {
      saveGameToCloud(gameStateRef.current).catch(error => {
        console.error('Auto-save failed', error);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [user, hasActiveSession]);

  const pushNotification = (message: string, type: NotificationType) => {
    if (!settingsRef.current.showNotifications && type !== 'warning') {
      return;
    }

    const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setNotifications(prev => {
      const next = [...prev, { id, message, type }];
      return next.slice(-6);
    });

    if (notificationTimeouts.current[id]) {
      clearTimeout(notificationTimeouts.current[id]);
    }

    const timeoutDuration = type === 'gain' ? 3200 : type === 'sell' ? 2600 : 3600;
    notificationTimeouts.current[id] = setTimeout(() => {
      setNotifications(prev => prev.filter(note => note.id !== id));
      delete notificationTimeouts.current[id];
    }, timeoutDuration);
  };

  const markItemsHighlighted = (itemIds: string[]) => {
    if (itemIds.length === 0) {
      return;
    }

    setHighlightedItems(prev => {
      const merged = new Set(prev);
      itemIds.forEach(id => merged.add(id));
      return Array.from(merged);
    });

    itemIds.forEach(id => {
      const existing = highlightTimeouts.current[id];
      if (existing) {
        clearTimeout(existing);
      }
      highlightTimeouts.current[id] = setTimeout(() => {
        setHighlightedItems(prev => prev.filter(itemId => itemId !== id));
        delete highlightTimeouts.current[id];
      }, 2000);
    });
  };

  const saveGameToCloud = async (state: GameState, options?: { slotName?: string; displayName?: string }) => {
    if (!user) {
      return null;
    }

    const slug = options?.slotName ?? 'autosave';
    const display = options?.displayName ?? (slug === 'autosave' ? 'Autosave' : slug);
    const snapshot = serializeGameState(state, { slotName: slug, saveName: display });

    const update: Record<string, unknown> = {
      current: snapshot,
    };
    update[`slots.${slug}`] = snapshot;
    update.lastSlot = slug;

    await setDoc(doc(db, 'users', user.uid), update, { merge: true });

    setSavedDoc(prev => {
      const slots = { ...(prev?.slots ?? {}) };
      slots[slug] = snapshot;
      return {
        current: snapshot,
        slots,
        lastSlot: slug,
      };
    });

    return { slug, snapshot };
  };

  const applySavedGame = (saved: SavedGameState | undefined, slotKey?: string) => {
    if (!saved) {
      return false;
    }
    setGameState(hydrateSavedGame(saved));
    setHasActiveSession(true);
    setHasNewInventoryItems(false);
    setSavedDoc(prev => {
      const slots = { ...(prev?.slots ?? {}) };
      const key = slotKey ?? saved.slotName ?? 'autosave';
      slots[key] = saved;
      return {
        current: saved,
        slots,
        lastSlot: key,
      };
    });
    return true;
  };

  const handleSetTask = (professionId: string, taskIndex: number) => {
    setGameState(prev => ({
      ...prev,
      professions: prev.professions.map(prof => {
        if (prof.id !== professionId) {
          return prof;
        }

        if (prof.activeTaskIndex === taskIndex) {
          return {
            ...prof,
            isPaused: !prof.isPaused,
          };
        }

        return {
          ...prof,
          activeTaskIndex: taskIndex,
          isPaused: false,
          taskProgress: 0,
        };
      })
    }));
  };

  const handleSellItem = (slotIndex: number, quantity: number) => {
    if (quantity <= 0) {
      return;
    }

    let saleSummary: { name: string; quantity: number; goldValue: number } | null = null;

    setGameState(prev => {
      if (slotIndex < 0 || slotIndex >= prev.inventory.length) {
        return prev;
      }

      const slots = prev.inventory.map(slot => (slot ? { ...slot } : null));
      const slot = slots[slotIndex];
      if (!slot) {
        return prev;
      }

      const sellQuantity = Math.min(quantity, slot.quantity);
      if (sellQuantity <= 0) {
        return prev;
      }

      const updatedInventory = slots;
      const updatedResources = { ...prev.resources };
      const goldBefore = updatedResources.gold || new Decimal(0);
      const saleValue = new Decimal(slot.value).mul(sellQuantity);
      updatedResources.gold = goldBefore.add(saleValue);

      if (updatedResources[slot.id]) {
        const remaining = updatedResources[slot.id].sub(sellQuantity);
        updatedResources[slot.id] = remaining.gt(0) ? remaining : new Decimal(0);
      }

      const remainingQuantity = slot.quantity - sellQuantity;
      if (remainingQuantity <= 0) {
        updatedInventory[slotIndex] = null;
      } else {
        updatedInventory[slotIndex] = { ...slot, quantity: remainingQuantity };
      }

      saleSummary = { name: slot.name, quantity: sellQuantity, goldValue: saleValue.toNumber() };

      return {
        ...prev,
        inventory: updatedInventory,
        resources: updatedResources,
      };
    });

    if (saleSummary) {
      const { name, quantity: soldQty, goldValue } = saleSummary;
      pushNotification(`Sold ${soldQty} ${name} for +${goldValue} Gold`, 'sell');
    }
  };

  const handleMoveInventoryItem = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) {
      return;
    }

    setGameState(prev => {
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= prev.inventory.length ||
        toIndex >= prev.inventory.length
      ) {
        return prev;
      }

      const slots = [...prev.inventory];
      const fromItem = slots[fromIndex];
      if (!fromItem) {
        return prev;
      }

      const toItem = slots[toIndex];
      slots[toIndex] = fromItem;
      slots[fromIndex] = toItem;

      return {
        ...prev,
        inventory: slots,
      };
    });
  };

  const handleEquipItem = (slotIndex: number) => {
    const slot = gameState.inventory[slotIndex];
    if (!slot) {
      return;
    }

    if (slot.category === 'weapon' || slot.category === 'armor') {
      pushNotification(`Equipped ${slot.name}.`, 'gain');
    } else {
      pushNotification(`${slot.name} cannot be equipped.`, 'warning');
    }
  };

  const handleUpgradeInventory = () => {
    const costValue = calculateInventoryUpgradeCost(gameStateRef.current.inventoryCapacity);
    const costDecimal = new Decimal(costValue);

    let upgradeApplied = false;
    let resultingCapacity = gameStateRef.current.inventoryCapacity;

    setGameState(prev => {
      const currentGold = prev.resources.gold || new Decimal(0);
      if (currentGold.lt(costDecimal)) {
        return prev;
      }

      upgradeApplied = true;
      resultingCapacity = prev.inventoryCapacity + INVENTORY_UPGRADE_STEP;
      const updatedResources = { ...prev.resources, gold: currentGold.sub(costDecimal) };
      const expandedInventory = [...prev.inventory, ...createInitialInventory(INVENTORY_UPGRADE_STEP)];

      return {
        ...prev,
        resources: updatedResources,
        inventoryCapacity: resultingCapacity,
        inventory: expandedInventory,
      };
    });

    if (upgradeApplied) {
      pushNotification(`Inventory expanded to ${resultingCapacity} slots!`, 'gain');
    } else {
      pushNotification('Not enough gold to upgrade your inventory.', 'warning');
    }
  };

  const handleManualSave = async () => {
    if (!hasActiveSession) {
      pushNotification('Start a game before saving.', 'warning');
      return;
    }

    const rawName = window.prompt('Enter a name for this save file:');
    if (rawName === null) {
      return;
    }
    const trimmed = rawName.trim();
    if (!trimmed) {
      pushNotification('Save name cannot be empty.', 'warning');
      return;
    }

    const slug = slugify(trimmed);
    if (savedDoc?.slots && savedDoc.slots[slug]) {
      const overwrite = window.confirm(`Overwrite existing save "${savedDoc.slots[slug].saveName ?? slug}"?`);
      if (!overwrite) {
        return;
      }
    }

    try {
      await saveGameToCloud(gameStateRef.current, { slotName: slug, displayName: trimmed });
      pushNotification(`Saved game as "${trimmed}"`, 'gain');
    } catch (error) {
      console.error('Manual save failed', error);
      pushNotification('Save failed. Please try again.', 'warning');
    }
  };

  const handleLoadSlot = (slotKey: string) => {
    const slot = savedDoc?.slots?.[slotKey];
    if (!slot) {
      pushNotification('Save slot not found.', 'warning');
      return;
    }
    applySavedGame(slot, slotKey);
    setIsLoadModalOpen(false);
    setIsMainMenuOpen(false);
  };

  const handleContinueGame = () => {
    if (hasActiveSession) {
      setIsMainMenuOpen(false);
      return;
    }

    const slots = savedDoc?.slots ?? {};
    const preferredKey = savedDoc?.lastSlot ?? Object.keys(slots)[0];
    const snapshot = preferredKey ? slots[preferredKey] : savedDoc?.current;

    if (applySavedGame(snapshot, preferredKey)) {
      setIsMainMenuOpen(false);
    } else {
      pushNotification('No saved game available.', 'warning');
    }
  };

  const handleLoadGame = () => {
    if (!savedDoc || Object.keys(savedDoc.slots ?? {}).length === 0) {
      pushNotification('No saved games available yet.', 'warning');
      return;
    }
    setIsLoadModalOpen(true);
  };

  const handleNewGame = () => {
    const freshState = createInitialGameState();
    setGameState(freshState);
    setHasActiveSession(true);
    setHasNewInventoryItems(false);
    setIsMainMenuOpen(false);

    if (user) {
      saveGameToCloud(freshState).catch(error => {
        console.error('Failed to create initial save', error);
      });
    }
  };

  const handleOpenMainMenu = () => {
    setIsMainMenuOpen(true);
  };

  const handleQuitGame = () => {
    window.close();
    setTimeout(() => {
      window.location.href = 'about:blank';
    }, 150);
  };

  if (!user) {
    return <div style={{ padding: '20px' }}>Loading and authenticating...</div>;
  }

  const slotsUsed = gameState.inventory.filter(slot => slot !== null).length;
  const totalStacks = gameState.inventory.reduce((sum, slot) => (slot ? sum + slot.quantity : sum), 0);
  const upgradeCost = calculateInventoryUpgradeCost(gameState.inventoryCapacity);
  const goldAmount = gameState.resources.gold || new Decimal(0);
  const canAffordUpgrade = goldAmount.gte(new Decimal(upgradeCost));

  const hasSaveAvailable = savedDoc ? Object.keys(savedDoc.slots ?? {}).length > 0 : false;
  const lastSaveLabel = formatLastSaveLabel(savedDoc?.current?.savedAt);

  return (
    <>
      <MainMenu
        isOpen={isMainMenuOpen}
        isLoading={menuStatus === 'loading'}
        hasSave={hasSaveAvailable}
        hasActiveSession={hasActiveSession}
        lastSaveLabel={lastSaveLabel}
        onContinue={handleContinueGame}
        onNewGame={handleNewGame}
        onManualSave={handleManualSave}
        onOpenLoad={handleLoadGame}
        onSettings={() => setIsSettingsOpen(true)}
        onCredits={() => setIsCreditsOpen(true)}
        onQuit={handleQuitGame}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onChange={setSettings}
        onClose={() => setIsSettingsOpen(false)}
        onReset={() => setSettings(DEFAULT_SETTINGS)}
      />

      <CreditsModal isOpen={isCreditsOpen} onClose={() => setIsCreditsOpen(false)} />

      <SaveSlotsModal
        isOpen={isLoadModalOpen}
        slots={savedDoc?.slots ?? {}}
        onLoad={handleLoadSlot}
        onClose={() => setIsLoadModalOpen(false)}
      />

      <Dashboard
        gameState={gameState}
        handleSetTask={handleSetTask}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenMainMenu={handleOpenMainMenu}
        hasNewInventoryItems={hasNewInventoryItems}
        lastSaveLabel={lastSaveLabel}
      />

      <InventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        inventory={gameState.inventory}
        inventoryCapacity={gameState.inventoryCapacity}
        slotsUsed={slotsUsed}
        totalQuantity={totalStacks}
        upgradeCost={upgradeCost}
        upgradeStep={INVENTORY_UPGRADE_STEP}
        onUpgradeCapacity={handleUpgradeInventory}
        canAffordUpgrade={canAffordUpgrade}
        goldAmount={goldAmount}
        highlightedItems={highlightedItems}
        onSellItem={handleSellItem}
        onEquipItem={handleEquipItem}
        onMoveItem={handleMoveInventoryItem}
      />

      <NotificationCenter notifications={notifications} />
    </>
  );
}

export default App;
