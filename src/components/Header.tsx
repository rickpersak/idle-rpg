// src/components/Header.tsx
import { ResourceDisplay } from './ResourceDisplay';

interface HeaderProps {
  gold: string;
  gps: string;
}

export function Header({ gold, gps }: HeaderProps) {
  return (
    <header className="header">
      <h1>Idle RPG</h1>
      <ResourceDisplay name="Gold" value={gold} perSecond={gps} />
    </header>
  );
}