// src/App.tsx
import { useState, useEffect, useRef, useMemo } from 'react';
import Decimal from 'break_infinity.js'; // Import the big number library
import { auth, db } from './firebase';
import { signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Import our new components
import { ResourceDisplay } from './components/ResourceDisplay';
import { Generator } from './components/Generator'; // Reusing Generator component for professions

// == DATA STRUCTURE DEFINITIONS ==
// The state for a single profession (e.g., Mining)
interface ProfessionState {
  id: string;
  name: string;
  level: number;
  baseCost: number;
  baseProduction: number; // Resources Per Second
}

// The overall game state, now using the Decimal type for gold
interface GameState {
  gold: Decimal;
  professions: ProfessionState[];
}

// The shape of the data as it's saved in Firebase (strings instead of Decimals)
interface SavedGameState {
  gold: string;
  professions: ProfessionState[];
}

// == INITIAL GAME CONFIGURATION ==
// This is where you define all your game's content. Adding a new object here
// will automatically add a new profession to the game!
const INITIAL_GAME_STATE: GameState = {
  gold: new Decimal(0),
  professions: [
    { id: 'mining', name: 'Mining', level: 0, baseCost: 10, baseProduction: 1 },
    { id: 'woodcutting', name: 'Woodcutting', level: 0, baseCost: 100, baseProduction: 8 },
    { id: 'fishing', name: 'Fishing', level: 0, baseCost: 1200, baseProduction: 50 },
    { id: 'farming', name: 'Farming', level: 0, baseCost: 15000, baseProduction: 250 },
  ],
};

// A helper function to format our big numbers for display
const formatNumber = (num: Decimal): string => {
  if (num.lt(1000)) {
    return num.floor().toString();
  }
  return num.toExponential(2).replace('+', '');
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // == 1. AUTHENTICATION & LOADING ==
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

  // == 2. GAME LOOP ==
  // Calculates total Gold Per Second (GPS) from all professions.
  // Each profession level produces resources that can be sold for gold.
  // useMemo ensures this only recalculates when profession levels change.
  const totalGPS = useMemo(() => {
    if (!gameState.professions || gameState.professions.length === 0) {
      return new Decimal(0);
    }
    return gameState.professions.reduce((total, prof) => {
      const professionProduction = new Decimal(prof.baseProduction).times(prof.level);
      return total.add(professionProduction);
    }, new Decimal(0));
  }, [gameState.professions]);

  // The main tick loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold.add(totalGPS.divide(10)), // Add a tenth of GPS every 100ms for smoother updates
      }));
    }, 100);
    return () => clearInterval(interval);
  }, [totalGPS]);

  // == 3. AUTOSAVE ==
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        saveGame(user, gameStateRef.current);
      }
    }, 10000); // Save every 10 seconds
    return () => clearInterval(interval);
  }, [user]);

  // == 4. DATA MANAGEMENT (SAVE/LOAD) ==
  // We need to convert Decimal objects to strings before saving to Firebase.
  const saveGame = async (currentUser: User, state: GameState) => {
    console.log("Saving game with gold:", formatNumber(state.gold));
    const gameDocRef = doc(db, 'users', currentUser.uid);
    
    const dataToSave: SavedGameState = {
      gold: state.gold.toString(), // Convert Decimal to string
      professions: state.professions,
    };

    await setDoc(gameDocRef, {
      ...dataToSave,
      lastSaved: serverTimestamp()
    });
  };

  // We need to convert strings back to Decimal objects after loading.
  const loadGame = async (currentUser: User) => {
    console.log("Loading game...");
    const gameDocRef = doc(db, 'users', currentUser.uid);
    const docSnap = await getDoc(gameDocRef);

    if (docSnap.exists()) {
      const savedData = docSnap.data() as any; // Use any to handle old save format
      
      // Handle backward compatibility: old saves had 'generators', new saves have 'professions'
      const professions = savedData.professions || savedData.generators || INITIAL_GAME_STATE.professions;
      
      setGameState({
        gold: new Decimal(savedData.gold), // Convert string back to Decimal
        professions: professions,
      });
      console.log("Game loaded!");
    } else {
      console.log("No save file found, starting new game.");
      // If no save, we ensure the state is the initial one
      setGameState(INITIAL_GAME_STATE);
    }
  };

  // == 5. GAME LOGIC FUNCTIONS ==
  const handlePurchaseProfession = (professionIndex: number) => {
    const profession = gameState.professions[professionIndex];
    const cost = new Decimal(profession.baseCost).times(Math.pow(1.15, profession.level));

    if (gameState.gold.gte(cost)) { // Use .gte() for Decimal comparison
      const newProfessions = [...gameState.professions];
      newProfessions[professionIndex] = {
        ...newProfessions[professionIndex],
        level: newProfessions[professionIndex].level + 1,
      };

      setGameState(prev => ({
        gold: prev.gold.subtract(cost), // Use .subtract()
        professions: newProfessions,
      }));
    }
  };

  // == 6. RENDER THE UI ==
  if (!user) {
    return <div style={{ padding: '20px' }}>Loading and authenticating...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <ResourceDisplay
        name="Gold"
        value={formatNumber(gameState.gold)}
        perSecond={formatNumber(totalGPS)}
      />
      <hr />
      <h3>Professions</h3>
      {gameState.professions.map((prof, index) => {
        const cost = new Decimal(prof.baseCost).times(Math.pow(1.15, prof.level));
        const production = new Decimal(prof.baseProduction).times(prof.level);
        return (
          <Generator
            key={prof.id}
            name={prof.name}
            level={prof.level}
            cost={formatNumber(cost)}
            production={formatNumber(production)}
            canAfford={gameState.gold.gte(cost)}
            onPurchase={() => handlePurchaseProfession(index)}
          />
        );
      })}
    </div>
  );
}

export default App;