// src/components/Header.tsx
import type Decimal from 'break_infinity.js';

interface HeaderProps {
  gold: Decimal;
  formatNumber: (num: Decimal) => string;
  onOpenInventory: () => void;
  onOpenMenu: () => void;
  slotsUsed: number;
  inventoryCapacity: number;
  totalQuantity: number;
  inventoryValue: Decimal;
  hasNewItems: boolean;
  lastSaveLabel?: string;
}

export function Header({
  gold,
  formatNumber,
  onOpenInventory,
  onOpenMenu,
  slotsUsed,
  inventoryCapacity,
  totalQuantity,
  inventoryValue,
  hasNewItems,
  lastSaveLabel,
}: HeaderProps) {
  return (
    <header className="game-header">
      <div className="header-left">
        <button type="button" className="header-menu-button" onClick={onOpenMenu}>
          <span className="header-menu-icon">☰</span>
          <span className="header-menu-text">Menu</span>
        </button>
        
        <div className="header-brand">
          <div className="header-logo">⚔️</div>
          <div className="header-titles">
            <h1>Idle RPG</h1>
            <span className="header-subtitle">Adventure Awaits</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <div className="header-stats">
          <div className="header-stat">
            <span className="stat-value">{slotsUsed}/{inventoryCapacity}</span>
            <span className="stat-label">Inventory</span>
          </div>
          <div className="header-stat">
            <span className="stat-value">{totalQuantity}</span>
            <span className="stat-label">Items</span>
          </div>
          <div className="header-stat">
            <span className="stat-value">{lastSaveLabel ?? 'Never'}</span>
            <span className="stat-label">Last Save</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="header-resources">
          <div className="resource-display gold">
            <span className="resource-icon">🪙</span>
            <span className="resource-value">{formatNumber(gold)}</span>
            <span className="resource-label">Gold</span>
          </div>
        </div>
        
        <button
          type="button"
          className={`header-inventory-button ${hasNewItems ? 'has-new-items' : ''}`}
          onClick={onOpenInventory}
        >
          <span className="inventory-icon">🎒</span>
          <div className="inventory-info">
            <span className="inventory-title">Inventory</span>
            <span className="inventory-details">{slotsUsed}/{inventoryCapacity} • {formatNumber(inventoryValue)} value</span>
          </div>
          {hasNewItems && <span className="new-items-indicator" />}
        </button>
      </div>
    </header>
  );
}
