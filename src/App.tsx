// src/App.tsx
import { useState, useEffect, useRef, useMemo } from 'react';
import Decimal from 'break_infinity.js';
import { auth, db } from './firebase';
import { signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Dashboard } from './components/Dashboard';

// Exporting these types so other components can use them
export interface ProfessionState {
  id: string;
  name: string;
  level: number;
  baseCost: number;
  baseProduction: number;
}

export interface GameState {
  gold: Decimal;
  professions: ProfessionState[];
}

interface SavedGameState {
  gold: string;
  professions: ProfessionState[];
}

const INITIAL_GAME_STATE: GameState = {
  gold: new Decimal(0),
  professions: [
    { id: 'mining', name: 'Mining', level: 0, baseCost: 10, baseProduction: 1 },
    { id: 'woodcutting', name: 'Woodcutting', level: 0, baseCost: 100, baseProduction: 8 },
    { id: 'fishing', name: 'Fishing', level: 0, baseCost: 1200, baseProduction: 50 },
    { id: 'farming', name: 'Farming', level: 0, baseCost: 15000, baseProduction: 250 },
  ],
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadGame(currentUser);
      } else {
        await signInAnonymously(auth);
      }
    });
    return () => unsubscribe();
  }, []);

  const totalGPS = useMemo(() => {
    if (!gameState.professions || gameState.professions.length === 0) {
      return new Decimal(0);
    }
    return gameState.professions.reduce((total, prof) => {
      const professionProduction = new Decimal(prof.baseProduction).times(prof.level);
      return total.add(professionProduction);
    }, new Decimal(0));
  }, [gameState.professions]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold.add(totalGPS.divide(10)),
      }));
    }, 100);
    return () => clearInterval(interval);
  }, [totalGPS]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        saveGame(user, gameStateRef.current);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const saveGame = async (currentUser: User, state: GameState) => {
    const gameDocRef = doc(db, 'users', currentUser.uid);
    
    const dataToSave: SavedGameState = {
      gold: state.gold.toString(),
      professions: state.professions,
    };

    await setDoc(gameDocRef, {
      ...dataToSave,
      lastSaved: serverTimestamp()
    });
  };

  const loadGame = async (currentUser: User) => {
    const gameDocRef = doc(db, 'users', currentUser.uid);
    const docSnap = await getDoc(gameDocRef);

    if (docSnap.exists()) {
      const savedData = docSnap.data() as any;
      const professions = savedData.professions || savedData.generators || INITIAL_GAME_STATE.professions;
      
      setGameState({
        gold: new Decimal(savedData.gold),
        professions: professions,
      });
    } else {
      setGameState(INITIAL_GAME_STATE);
    }
  };

  const handlePurchaseProfession = (professionIndex: number) => {
    const profession = gameState.professions[professionIndex];
    const cost = new Decimal(profession.baseCost).times(Math.pow(1.15, profession.level));

    if (gameState.gold.gte(cost)) {
      const newProfessions = [...gameState.professions];
      newProfessions[professionIndex] = {
        ...newProfessions[professionIndex],
        level: newProfessions[professionIndex].level + 1,
      };

      setGameState(prev => ({
        gold: prev.gold.subtract(cost),
        professions: newProfessions,
      }));
    }
  };

  if (!user) {
    return <div style={{ padding: '20px' }}>Loading and authenticating...</div>;
  }

  return (
    <Dashboard 
      gameState={gameState}
      totalGPS={totalGPS}
      handlePurchaseProfession={handlePurchaseProfession}
    />
  );
}

export default App;