// src/components/SkillPage.tsx
import { Generator } from './Generator';
import type { GameState, ProfessionState } from '../App'; // Assuming types are exported from App.tsx
import Decimal from 'break_infinity.js';


interface SkillPageProps {
  professions: ProfessionState[];
  activeSkill: string;
  onPurchase: (index: number) => void;
  gameState: GameState;
  formatNumber: (num: Decimal) => string;
}

export function SkillPage({ professions, activeSkill, onPurchase, gameState, formatNumber }: SkillPageProps) {
  return (
    <main className="skill-page">
      <h3>{activeSkill}</h3>
      <div className="generators-grid">
        {professions.map((prof, index) => {
           if (prof.name === activeSkill) {
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
                onPurchase={() => onPurchase(index)}
              />
            );
          }
          return null;
        })}
      </div>
    </main>
  );
}