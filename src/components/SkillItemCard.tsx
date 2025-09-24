// src/components/SkillItemCard.tsx
import type { SkillTask } from '../types';

interface SkillItemCardProps {
  task: SkillTask;
  onSetTask: () => void;
  isActive: boolean;
  isPaused: boolean;
  isUnlocked: boolean;
  progressPercent: number;
}

const MiningIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9l4-6z"/><path d="M11 3L8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>
    </svg>
);

export function SkillItemCard({ task, onSetTask, isActive, isPaused, isUnlocked, progressPercent }: SkillItemCardProps) {
  const isDisabled = !isUnlocked;
  const clampedProgress = Math.min(100, Math.max(0, progressPercent));

  const buttonText = (() => {
    if (isDisabled) return 'Locked';
    if (!isActive) return 'Start Training';
    return isPaused ? 'Resume Training' : 'Pause Training';
  })();

  const buttonClass = () => {
    if (!isUnlocked) return 'cannot-afford';
    if (isActive && isPaused) return 'is-paused';
    if (isActive) return 'is-training';
    return 'can-afford';
  };

  const shouldShowProgress = isActive && (clampedProgress > 0 || isPaused);

  return (
    <div className={`generator-card ${!isUnlocked ? 'locked' : ''}`}>
      <div className="generator-header">
        <div className="generator-icon">
          <MiningIcon />
        </div>
        <div className="generator-info">
          <h4 className="generator-name">{task.name}</h4>
          <div className="generator-level">Requires Level {task.requiredLevel}</div>
        </div>
      </div>
      
      <div className="generator-stats">
        <div className="stat-item">
          <span className="stat-label">Time:</span>
          <span className="stat-value">{(task.timeToComplete / 1000).toFixed(1)}s</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Experience:</span>
          <span className="stat-value">{task.experience} XP</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Yield:</span>
          <span className="stat-value">{task.resourceQuantity} {task.resourceId}</span>
        </div>
      </div>
      
      <div className="generator-actions">
        <button 
          className={`upgrade-button ${buttonClass()}`}
          onClick={onSetTask} 
          disabled={isDisabled}
        >
          <span className="button-text">{buttonText}</span>
        </button>
      </div>
      
      {shouldShowProgress && (
        <div className="generator-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${clampedProgress}%` }}></div>
          </div>
          <span className="progress-text">
            {isPaused ? 'Paused' : 'Progress'}: {Math.floor(clampedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}
