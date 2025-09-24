// src/components/InventoryModal.tsx
import { useEffect, useMemo, useState } from 'react';
import type { DragEvent } from 'react';
import Decimal from 'break_infinity.js';
import type { InventorySlot } from '../types';

type InventoryFilter = 'all' | 'resource' | 'weapon' | 'armor' | 'consumable' | 'tool' | 'misc';

type InventoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventorySlot[];
  inventoryCapacity: number;
  slotsUsed: number;
  totalQuantity: number;
  upgradeCost: number;
  upgradeStep: number;
  onUpgradeCapacity: () => void;
  canAffordUpgrade: boolean;
  goldAmount: Decimal;
  highlightedItems: string[];
  onSellItem: (slotIndex: number, quantity: number) => void;
  onEquipItem: (slotIndex: number) => void;
  onMoveItem: (fromIndex: number, toIndex: number) => void;
};

const FILTERS: Array<{ id: InventoryFilter; label: string; icon: string }> = [
  { id: 'all', label: 'All', icon: '?' },
  { id: 'resource', label: 'Resources', icon: '??' },
  { id: 'weapon', label: 'Weapons', icon: '???' },
  { id: 'armor', label: 'Armor', icon: '???' },
  { id: 'consumable', label: 'Consumables', icon: '??' },
  { id: 'tool', label: 'Tools', icon: '???' },
  { id: 'misc', label: 'Misc', icon: '??' },
];

export function InventoryModal({
  isOpen,
  onClose,
  inventory,
  inventoryCapacity,
  slotsUsed,
  totalQuantity,
  upgradeCost,
  upgradeStep,
  onUpgradeCapacity,
  canAffordUpgrade,
  goldAmount,
  highlightedItems,
  onSellItem,
  onEquipItem,
  onMoveItem,
}: InventoryModalProps) {
  const [activeFilter, setActiveFilter] = useState<InventoryFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sellAmount, setSellAmount] = useState(1);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const searchLower = searchTerm.trim().toLowerCase();
  const isReorderLocked = activeFilter !== 'all' || searchLower.length > 0;

  useEffect(() => {
    if (!isOpen) {
      setActiveFilter('all');
      setSearchTerm('');
      setSelectedIndex(null);
      setSellAmount(1);
      setDraggingIndex(null);
      setDragOverIndex(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }
    const slot = inventory[selectedIndex];
    if (!slot) {
      setSellAmount(1);
      return;
    }
    setSellAmount(prev => {
      if (prev <= 0) {
        return 1;
      }
      return Math.min(prev, slot.quantity);
    });
  }, [inventory, selectedIndex]);

  const slots = useMemo(() => {
    return inventory.map((slot, index) => {
      const matchesFilter = activeFilter === 'all' || (slot && slot.category === activeFilter);
      const matchesSearch = slot
        ? slot.name.toLowerCase().includes(searchLower) || (slot.description ?? '').toLowerCase().includes(searchLower)
        : searchLower.length === 0;
      const filteredOut = slot ? !(matchesFilter && matchesSearch) : !(activeFilter === 'all' && searchLower.length === 0);
      const highlighted = !!slot && highlightedItems.includes(slot.id);
      return {
        slot,
        index,
        filteredOut,
        highlighted,
      };
    });
  }, [inventory, activeFilter, searchLower, highlightedItems]);

  const totalValue = useMemo(
    () => inventory.reduce((sum, slot) => (slot ? sum + (slot.value * slot.quantity) : sum), 0),
    [inventory],
  );

  if (!isOpen) {
    return null;
  }

  const matchingItems = slots.filter(entry => entry.slot && !entry.filteredOut).length;
  const selectedItem = selectedIndex !== null ? inventory[selectedIndex] : null;
  const inventoryFull = slotsUsed >= inventoryCapacity;

  const handleSelectSlot = (index: number) => {
    const slot = inventory[index];
    if (!slot) {
      setSelectedIndex(null);
      setSellAmount(1);
      return;
    }
    setSelectedIndex(index);
    setSellAmount(Math.min(slot.quantity, 1));
  };

  const handleSell = (amount: number) => {
    if (selectedIndex === null || !selectedItem) {
      return;
    }
    const sellQty = Math.min(Math.max(1, amount), selectedItem.quantity);
    onSellItem(selectedIndex, sellQty);
  };

  const handleSellAll = () => {
    if (selectedIndex === null || !selectedItem) {
      return;
    }
    onSellItem(selectedIndex, selectedItem.quantity);
  };

  const handleEquip = () => {
    if (selectedIndex === null || !selectedItem) {
      return;
    }
    onEquipItem(selectedIndex);
  };

  const handleDragStart = (event: DragEvent<HTMLButtonElement>, index: number) => {
    if (isReorderLocked) {
      event.preventDefault();
      return;
    }
    const slot = inventory[index];
    if (!slot) {
      event.preventDefault();
      return;
    }
    setDraggingIndex(index);
    event.dataTransfer.setData('text/plain', String(index));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: DragEvent<HTMLElement>, index: number) => {
    if (isReorderLocked) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (event: DragEvent<HTMLElement>, targetIndex: number) => {
    if (isReorderLocked) {
      return;
    }
    event.preventDefault();
    const fromIndex = Number(event.dataTransfer.getData('text/plain'));
    if (Number.isNaN(fromIndex)) {
      return;
    }
    onMoveItem(fromIndex, targetIndex);
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const sellPerItem = selectedItem ? selectedItem.value : 0;
  const sellTotal = selectedItem ? sellPerItem * sellAmount : 0;
  const equipDisabled = !selectedItem || !['weapon', 'armor'].includes(selectedItem.category);
  const showNoMatches = matchingItems === 0 && slots.some(entry => entry.slot !== null);

  return (
    <div className="inventory-modal" role="dialog" aria-modal="true">
      <div className="inventory-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="inventory-content">
        <div className="inventory-header">
          <div>
            <h2>Inventory</h2>
            <p className="inventory-subtitle">Drag items to rearrange and manage your equipment loadout.</p>
          </div>
          <div className="inventory-controls">
            <button className="inventory-close" onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        <div className="inventory-summary">
          <span>{slotsUsed}/{inventoryCapacity} slots used</span>
          <span>{totalQuantity} total items</span>
          <span>Total value: {totalValue.toLocaleString()} gold</span>
        </div>

        <div className="inventory-toolbar">
          <div className="inventory-filters" role="tablist" aria-label="Inventory filters">
            {FILTERS.map(filter => (
              <button
                key={filter.id}
                type="button"
                role="tab"
                className={`inventory-filter ${activeFilter === filter.id ? 'is-active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                <span className="inventory-filter-icon" aria-hidden="true">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
          <div className="inventory-search">
            <input
              type="search"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
            />
          </div>
        </div>

        <div className="inventory-upgrade">
          <div>
            <h4>Expand capacity</h4>
            <p>Upgrade to gain {upgradeStep} additional slots. Current gold: {goldAmount.floor().toString()}</p>
          </div>
          <button
            type="button"
            className="inventory-upgrade-button"
            onClick={onUpgradeCapacity}
            disabled={!canAffordUpgrade}
          >
            Upgrade (+{upgradeStep}) � Cost: {upgradeCost.toLocaleString()} gold
          </button>
        </div>

        {inventoryFull && (
          <div className="inventory-alert" role="status">
            Your bags are full. Sell or upgrade to capture more loot.
          </div>
        )}

        {isReorderLocked && (
          <div className="inventory-tip" role="note">
            Dragging is disabled while filters or search are active.
          </div>
        )}

        {showNoMatches && (
          <div className="inventory-filtered-message" role="status">
            No items match the current filters. Try adjusting your search.
          </div>
        )}

        <div className="inventory-layout">
          <div className="inventory-grid" role="list">
            {slots.map(({ slot, index, filteredOut, highlighted }) => {
              const isSelected = selectedIndex === index && !!slot;
              const isEmpty = slot === null;
              const className = [
                'inventory-slot',
                isEmpty ? 'is-empty' : '',
                isSelected ? 'is-selected' : '',
                filteredOut && slot ? 'is-filtered-out' : '',
                highlighted ? 'is-highlighted' : '',
                draggingIndex === index ? 'is-dragging' : '',
                dragOverIndex === index ? 'is-drop-target' : '',
              ]
                .filter(Boolean)
                .join(' ');

              if (slot) {
                return (
                  <button
                    key={index}
                    type="button"
                    role="listitem"
                    className={className}
                    onClick={() => handleSelectSlot(index)}
                    draggable={!isReorderLocked}
                    onDragStart={event => handleDragStart(event, index)}
                    onDragOver={event => handleDragOver(event, index)}
                    onDrop={event => handleDrop(event, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <span className="inventory-item-icon" aria-hidden="true">{slot.icon ?? '??'}</span>
                    <span className="inventory-item-name">{slot.name}</span>
                    <span className="inventory-item-qty">x{slot.quantity}</span>
                  </button>
                );
              }

              return (
                <div
                  key={index}
                  role="presentation"
                  className={className}
                  onDragOver={event => handleDragOver(event, index)}
                  onDrop={event => handleDrop(event, index)}
                  onDragEnd={handleDragEnd}
                >
                  <span className="inventory-slot-empty" aria-hidden="true"></span>
                </div>
              );
            })}
          </div>

          <aside className="inventory-detail-panel">
            {selectedItem ? (
              <>
                <div className="inventory-detail-header">
                  <span className="inventory-detail-icon" aria-hidden="true">{selectedItem.icon ?? '??'}</span>
                  <div>
                    <h3>{selectedItem.name}</h3>
                    <p className="inventory-detail-category">{selectedItem.category.toUpperCase()}</p>
                  </div>
                </div>
                <p className="inventory-detail-description">{selectedItem.description}</p>
                {selectedItem.lore && <p className="inventory-detail-lore">{selectedItem.lore}</p>}
                {selectedItem.uses && selectedItem.uses.length > 0 && (
                  <div className="inventory-detail-uses">
                    <h4>Used for</h4>
                    <ul>
                      {selectedItem.uses.map(use => (
                        <li key={use}>{use}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="inventory-detail-meta">
                  <span>Stack size: {selectedItem.quantity}</span>
                  <span>Value each: {selectedItem.value} gold</span>
                </div>

                <div className="inventory-detail-actions">
                  <div className="inventory-sell-controls">
                    <label htmlFor="inventory-sell-range">Sell amount</label>
                    <input
                      id="inventory-sell-range"
                      type="range"
                      min={1}
                      max={selectedItem.quantity}
                      value={Math.min(sellAmount, selectedItem.quantity)}
                      onChange={event => setSellAmount(Number(event.target.value))}
                    />
                    <div className="inventory-sell-inputs">
                      <input
                        type="number"
                        min={1}
                        max={selectedItem.quantity}
                        value={Math.min(sellAmount, selectedItem.quantity)}
                        onChange={event => setSellAmount(Number(event.target.value) || 1)}
                      />
                      <span className="inventory-sell-total">{sellTotal.toLocaleString()} gold</span>
                    </div>
                    <div className="inventory-sell-buttons">
                      <button type="button" onClick={() => handleSell(1)} disabled={selectedItem.quantity === 0}>
                        Sell 1
                      </button>
                      <button type="button" onClick={() => handleSell(Math.min(sellAmount, selectedItem.quantity))}>
                        Sell {Math.min(sellAmount, selectedItem.quantity)}
                      </button>
                      <button type="button" onClick={handleSellAll}>
                        Sell All
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inventory-equip-button"
                    onClick={handleEquip}
                    disabled={equipDisabled}
                  >
                    Equip Item
                  </button>
                </div>
              </>
            ) : (
              <div className="inventory-detail-placeholder">
                <h3>No item selected</h3>
                <p>Select an item slot to see detailed information, sell items, or equip gear.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}




