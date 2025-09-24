// src/components/ResourceDisplay.tsx
interface ResourceDisplayProps {
  name: string;
  value: number | string; // Can be a number or a formatted string
  perSecond?: number | string; // Gold per second display - now optional
}

export function ResourceDisplay({ name, value, perSecond }: ResourceDisplayProps) {
  return (
    <div className="resource-display">
      <div className="resource-icon">
          {/* Using a simple coin icon for gold */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8"></circle>
              <line x1="12" y1="16" x2="12" y2="16"></line>
              <line x1="12" y1="8" x2="12" y2="13"></line>
              <path d="M12 16.5v-3.5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v0"></path>
          </svg>
      </div>
      <div className="resource-info">
        <div className="resource-name">{name}</div>
        <div className="resource-value">{value}</div>
        {perSecond && <div className="resource-rate">+{perSecond}/sec</div>}
      </div>
    </div>
  );
}