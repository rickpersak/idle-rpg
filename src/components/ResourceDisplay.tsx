// src/components/ResourceDisplay.tsx
interface ResourceDisplayProps {
    name: string;
    value: number | string; // Can be a number or a formatted string
    perSecond: number | string; // Gold per second display
  }
  
  export function ResourceDisplay({ name, value, perSecond }: ResourceDisplayProps) {
    return (
      <div>
        <h2>{name}: {value}</h2>
        <p>Per second: {perSecond}</p>
      </div>
    );
  }