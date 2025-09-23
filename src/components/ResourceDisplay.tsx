// src/components/ResourceDisplay.tsx
interface ResourceDisplayProps {
    name: string;
    value: number | string; // Can be a number or a formatted string
    perSecond: number | string; // Gold per second display
  }
  
  export function ResourceDisplay({ name, value, perSecond }: ResourceDisplayProps) {
    return (
      <div className="resource-display">
        <div className="resource-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <div className="resource-info">
          <div className="resource-name">{name}</div>
          <div className="resource-value">{value}</div>
          <div className="resource-rate">+{perSecond}/sec</div>
        </div>
      </div>
    );
  }