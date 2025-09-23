// src/components/Dashboard.tsx
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SkillPage } from './SkillPage';
import type { GameState } from '../App'; // Assuming types are exported from App.tsx
import '../Dashboard.css'; // Import the new styles

interface DashboardProps {
  gameState: GameState;
  totalGPS: any; // Use 'any' or a specific Decimal type
  handlePurchaseProfession: (index: number) => void;
}

export function Dashboard({ gameState, totalGPS, handlePurchaseProfession }: DashboardProps) {
  const [activeSkill, setActiveSkill] = useState<string>('Mining'); // Default to Mining

  const formatNumber = (num: any): string => {
    if (num.lt(1000)) {
      return num.floor().toString();
    }
    return num.toExponential(2).replace('+', '');
  };

  return (
    <div className="dashboard">
      <Sidebar
        professions={gameState.professions}
        activeSkill={activeSkill}
        onSkillClick={setActiveSkill}
      />
      <div className="main-content">
        <Header gold={formatNumber(gameState.gold)} gps={formatNumber(totalGPS)} />
        <SkillPage
          professions={gameState.professions}
          activeSkill={activeSkill}
          onPurchase={handlePurchaseProfession}
          gameState={gameState}
          formatNumber={formatNumber}
        />
      </div>
    </div>
  );
}