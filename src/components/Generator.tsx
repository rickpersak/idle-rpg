// src/components/Generator.tsx
interface GeneratorProps {
    name: string;
    cost: string;
    production: string;
    level: number;
    onPurchase: () => void;
    canAfford: boolean;
  }

// Skill icons as SVG components
const MiningIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3h12l4 6-10 13L2 9l4-6z"/>
    <path d="M11 3L8 9l4 13 4-13-3-6"/>
    <path d="M2 9h20"/>
  </svg>
);

const WoodcuttingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h18l-9-9-9 9z"/>
    <path d="M12 3v18"/>
    <path d="M8 12h8"/>
  </svg>
);

const FishingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6"/>
    <path d="M12 17v6"/>
  </svg>
);

const FarmingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>
);

const getSkillIcon = (skillName: string) => {
  switch (skillName.toLowerCase()) {
    case 'mining':
      return <MiningIcon />;
    case 'woodcutting':
      return <WoodcuttingIcon />;
    case 'fishing':
      return <FishingIcon />;
    case 'farming':
      return <FarmingIcon />;
    default:
      return <MiningIcon />;
  }
};
  
  export function Generator({ name, cost, production, level, onPurchase, canAfford }: GeneratorProps) {
    return (
      <div className="generator-card">
        <div className="generator-header">
          <div className="generator-icon">
            {getSkillIcon(name)}
          </div>
          <div className="generator-info">
            <h4 className="generator-name">{name}</h4>
            <div className="generator-level">Level {level}</div>
          </div>
        </div>
        
        <div className="generator-stats">
          <div className="stat-item">
            <span className="stat-label">Production:</span>
            <span className="stat-value">{production} gold/sec</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Upgrade Cost:</span>
            <span className="stat-value">{cost} Gold</span>
          </div>
        </div>
        
        <div className="generator-actions">
          <button 
            className={`upgrade-button ${canAfford ? 'can-afford' : 'cannot-afford'}`}
            onClick={onPurchase} 
            disabled={!canAfford}
          >
            <span className="button-icon">⬆</span>
            <span className="button-text">Upgrade</span>
            <span className="button-cost">{cost} Gold</span>
          </button>
        </div>
        
        {level > 0 && (
          <div className="generator-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '75%' }}></div>
            </div>
            <span className="progress-text">Experience: 75%</span>
          </div>
        )}
      </div>
    );
  }