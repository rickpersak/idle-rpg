// src/components/Generator.tsx
interface GeneratorProps {
    name: string;
    cost: string;
    production: string;
    level: number;
    onPurchase: () => void;
    canAfford: boolean;
  }
  
  export function Generator({ name, cost, production, level, onPurchase, canAfford }: GeneratorProps) {
    return (
      <div style={{ border: '1px solid grey', padding: '10px', margin: '5px 0' }}>
        <h4>{name} (Level {level})</h4>
        <p>Produces: {production} gold/sec</p>
        <button onClick={onPurchase} disabled={!canAfford}>
          Upgrade (Cost: {cost} Gold)
        </button>
      </div>
    );
  }