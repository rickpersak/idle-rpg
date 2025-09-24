// src/components/SettingsModal.tsx
import type { ChangeEvent } from 'react';

type GameSettings = {
  musicVolume: number;
  effectsVolume: number;
  showTooltips: boolean;
  showNotifications: boolean;
};

type SettingsModalProps = {
  isOpen: boolean;
  settings: GameSettings;
  onChange: (settings: GameSettings) => void;
  onClose: () => void;
  onReset: () => void;
};

export function SettingsModal({ isOpen, settings, onChange, onClose, onReset }: SettingsModalProps) {
  if (!isOpen) {
    return null;
  }

  const handleVolumeChange = (key: keyof Pick<GameSettings, 'musicVolume' | 'effectsVolume'>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      onChange({ ...settings, [key]: value });
    };

  const handleToggleChange = (key: keyof Pick<GameSettings, 'showTooltips' | 'showNotifications'>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange({ ...settings, [key]: event.target.checked });
    };

  return (
    <div className="settings-modal" role="dialog" aria-modal="true">
      <div className="settings-panel">
        <header className="settings-header">
          <h2>Settings</h2>
          <button type="button" className="settings-close" onClick={onClose}>
            Close
          </button>
        </header>

        <section className="settings-section" aria-labelledby="settings-audio">
          <h3 id="settings-audio">Audio</h3>
          <div className="settings-row">
            <label htmlFor="settings-music">Music Volume</label>
            <input
              id="settings-music"
              type="range"
              min={0}
              max={100}
              value={settings.musicVolume}
              onChange={handleVolumeChange('musicVolume')}
            />
            <span className="settings-value">{settings.musicVolume}%</span>
          </div>
          <div className="settings-row">
            <label htmlFor="settings-effects">Effects Volume</label>
            <input
              id="settings-effects"
              type="range"
              min={0}
              max={100}
              value={settings.effectsVolume}
              onChange={handleVolumeChange('effectsVolume')}
            />
            <span className="settings-value">{settings.effectsVolume}%</span>
          </div>
        </section>

        <section className="settings-section" aria-labelledby="settings-gameplay">
          <h3 id="settings-gameplay">Gameplay</h3>
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={settings.showTooltips}
              onChange={handleToggleChange('showTooltips')}
            />
            <span>Show tooltips and helper hints</span>
          </label>
          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={settings.showNotifications}
              onChange={handleToggleChange('showNotifications')}
            />
            <span>Enable toast notifications</span>
          </label>
        </section>

        <footer className="settings-footer">
          <button type="button" className="settings-reset" onClick={onReset}>
            Restore Defaults
          </button>
        </footer>
      </div>
    </div>
  );
}
