// src/components/SaveSlotsModal.tsx
import type { SavedGameState } from '../types';

type SaveSlotsModalProps = {
  isOpen: boolean;
  slots: Record<string, SavedGameState>;
  onLoad: (slotKey: string) => void;
  onClose: () => void;
};

const formatTimestamp = (timestamp?: number) => {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - timestamp;
  const diffMinutes = Math.floor(diffMs / 60000);
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
};

export function SaveSlotsModal({ isOpen, slots, onLoad, onClose }: SaveSlotsModalProps) {
  if (!isOpen) {
    return null;
  }

  const slotEntries = Object.entries(slots).sort(([, a], [, b]) => {
    const timeA = a.savedAt || 0;
    const timeB = b.savedAt || 0;
    return timeB - timeA; // Most recent first
  });

  return (
    <div className="save-slots-modal" role="dialog" aria-modal="true">
      <div className="save-slots-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="save-slots-content">
        <div className="save-slots-header">
          <h2>Load Game</h2>
          <button className="save-slots-close" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="save-slots-list">
          {slotEntries.length === 0 ? (
            <div className="save-slots-empty">
              <p>No saved games found.</p>
              <p>Start a new game and save it to see your saves here.</p>
            </div>
          ) : (
            slotEntries.map(([slotKey, save]) => {
              const totalLevel = save.professions?.reduce((sum, prof) => sum + prof.level, 0) || 0;
              const goldValue = save.resources?.gold || '0';
              
              return (
                <div key={slotKey} className="save-slot-item">
                  <div className="save-slot-info">
                    <h3 className="save-slot-name">{save.saveName || slotKey}</h3>
                    <div className="save-slot-details">
                      <span>Total Level: {totalLevel}</span>
                      <span>Gold: {goldValue}</span>
                      <span>Saved: {formatTimestamp(save.savedAt)}</span>
                    </div>
                  </div>
                  <button
                    className="save-slot-load-btn"
                    onClick={() => onLoad(slotKey)}
                  >
                    Load
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}