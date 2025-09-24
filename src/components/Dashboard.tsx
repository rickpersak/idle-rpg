// src/components/Dashboard.tsx
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SkillPage } from './SkillPage';
import type { GameState } from '../types';
import Decimal from 'break_infinity.js';
import '../Dashboard.css';

interface DashboardProps {
  gameState: GameState;
  handleSetTask: (professionId: string, taskIndex: number) => void;
  onOpenInventory: () => void;
  onOpenMainMenu: () => void;
  hasNewInventoryItems: boolean;
  lastSaveLabel?: string;
}

export function Dashboard({ gameState, handleSetTask, onOpenInventory, onOpenMainMenu, hasNewInventoryItems, lastSaveLabel }: DashboardProps) {
  const [activeSkill, setActiveSkill] = useState<string>('Mining');

  const formatNumber = (num: Decimal): string => {
    if (num.lt(1000)) {
      return num.floor().toString();
    }
    return num.toExponential(2).replace('+', '');
  };

  const inventorySlotsUsed = gameState.inventory.filter(slot => slot !== null).length;
  const totalInventoryQuantity = gameState.inventory.reduce((sum, slot) => (slot ? sum + slot.quantity : sum), 0);
  const totalInventoryValue = gameState.inventory.reduce((sum, slot) => (slot ? sum + (slot.value * slot.quantity) : sum), 0);
  const inventoryValueDecimal = new Decimal(totalInventoryValue);

  return (
    <div className="dashboard">
      <Sidebar
        professions={gameState.professions}
        activeSkill={activeSkill}
        onSkillClick={setActiveSkill}
      />
      <div className="main-content">
        <Header
          gold={gameState.resources.gold || new Decimal(0)}
          formatNumber={formatNumber}
          onOpenInventory={onOpenInventory}
          onOpenMenu={onOpenMainMenu}
          slotsUsed={inventorySlotsUsed}
          inventoryCapacity={gameState.inventoryCapacity}
          totalQuantity={totalInventoryQuantity}
          inventoryValue={inventoryValueDecimal}
          hasNewItems={hasNewInventoryItems}
          lastSaveLabel={lastSaveLabel}
        />
        <SkillPage
          activeSkill={activeSkill}
          onSetTask={handleSetTask}
          gameState={gameState}
          formatNumber={formatNumber}
        />
      </div>
    </div>
  );
}
