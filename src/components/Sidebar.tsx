// src/components/Sidebar.tsx
import type { ProfessionState } from '../types';

interface SidebarProps {
  professions: ProfessionState[];
  activeSkill: string;
  onSkillClick: (skillName: string) => void;
}

// SVG Icons (re-pasted for completeness)
const MiningIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 13L2 9l4-6z"/><path d="M11 3L8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>
    </svg>
);
const WoodcuttingIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 6l-2-2-2 2-6 2 2 6 2-2 2 2 6-2-2-6z"/><path d="M2 22l4-4 3 3 4-4-3-3 4-4"/>
    </svg>
);
const FishingIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/><path d="M12 1v6"/><path d="M12 17v6"/>
    </svg>
);
const FarmingIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
    </svg>
);

const getSkillIcon = (skillId: string) => {
  switch (skillId) {
    case 'mining': return <MiningIcon />;
    case 'woodcutting': return <WoodcuttingIcon />;
    case 'fishing': return <FishingIcon />;
    case 'farming': return <FarmingIcon />;
    default: return <MiningIcon />;
  }
};

export function Sidebar({ professions, activeSkill, onSkillClick }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Professions</h2>
      </div>
      <ul className="skill-list">
        {professions.map((prof) => {
            const xpPercentage = prof.xpToNextLevel > 0 ? (prof.currentXP / prof.xpToNextLevel) * 100 : 0;
            return (
                <li
                    key={prof.id}
                    className={`skill-item ${activeSkill === prof.name ? 'active' : ''}`}
                    onClick={() => onSkillClick(prof.name)}
                >
                    <div className="skill-icon">{getSkillIcon(prof.id)}</div>
                    <div className="skill-info">
                        <span className="skill-name">{prof.name}</span>
                        <span className="skill-level">Level {prof.level}</span>
                        <div className="skill-progress-bar-container">
                           <div className="skill-progress-bar" style={{ width: `${xpPercentage}%` }}></div>
                        </div>
                    </div>
                    <div className="level-badge">{prof.level}</div>
                </li>
            );
        })}
      </ul>
    </aside>
  );
}