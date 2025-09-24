// src/components/SkillPage.tsx
import { SkillItemCard } from './SkillItemCard';
import type { GameState } from '../types';
import Decimal from 'break_infinity.js';

interface SkillPageProps {
  activeSkill: string;
  onSetTask: (professionId: string, taskIndex: number) => void;
  gameState: GameState;
  formatNumber: (num: Decimal) => string;
}

export function SkillPage({ activeSkill, onSetTask, gameState }: SkillPageProps) {
  const activeProfession = gameState.professions.find(p => p.name === activeSkill);
  
  if (!activeProfession) {
    return <main className="skill-page"><h3>Select a skill</h3></main>;
  }

  return (
    <main className="skill-page">
      <h3>{activeSkill}</h3>
      <div className="generators-grid">
        {activeProfession.tasks.map((task, index) => {
          const isCurrentTask = activeProfession.activeTaskIndex === index;
          const isPaused = isCurrentTask && activeProfession.isPaused;
          const progressPercent = isCurrentTask && task.timeToComplete > 0
            ? Math.min(100, (activeProfession.taskProgress / task.timeToComplete) * 100)
            : 0;

          return (
            <SkillItemCard
              key={task.id}
              task={task}
              isUnlocked={activeProfession.level >= task.requiredLevel}
              isActive={isCurrentTask}
              isPaused={isPaused}
              progressPercent={progressPercent}
              onSetTask={() => onSetTask(activeProfession.id, index)}
            />
          );
        })}
      </div>
    </main>
  );
}
