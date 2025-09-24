// src/components/MainMenu.tsx
interface MainMenuProps {
  isOpen: boolean;
  isLoading: boolean;
  hasSave: boolean;
  hasActiveSession: boolean;
  lastSaveLabel?: string;
  onContinue: () => void;
  onNewGame: () => void;
  onManualSave: () => void;
  onOpenLoad: () => void;
  onSettings: () => void;
  onCredits: () => void;
  onQuit: () => void;
}

export function MainMenu({
  isOpen,
  isLoading,
  hasSave,
  hasActiveSession,
  lastSaveLabel,
  onContinue,
  onNewGame,
  onManualSave,
  onOpenLoad,
  onSettings,
  onCredits,
  onQuit,
}: MainMenuProps) {
  if (!isOpen) {
    return null;
  }

  const continueDisabled = !hasActiveSession && !hasSave;
  const saveDisabled = !hasActiveSession || isLoading;
  const loadDisabled = !hasSave || isLoading;

  return (
    <div className="main-menu-page">
      <div className="main-menu-container">
        <header className="main-menu-header">
          <div className="main-menu-title">
            <h1>Idle RPG</h1>
            <p>Take a breath, adventurer. Manage your journey below.</p>
          </div>
          {lastSaveLabel && (
            <div className="main-menu-status">
              <span className="main-menu-status-label">Last Save</span>
              <span className="main-menu-status-value">{lastSaveLabel}</span>
            </div>
          )}
        </header>

        <div className="main-menu-actions">
          <button
            type="button"
            className="main-menu-button primary"
            onClick={onContinue}
            disabled={continueDisabled}
          >
            {hasActiveSession ? 'Resume Game' : 'Continue Adventure'}
          </button>
          
          <button
            type="button"
            className="main-menu-button"
            onClick={onNewGame}
            disabled={isLoading}
          >
            New Game
          </button>
          
          <div className="main-menu-row">
            <button
              type="button"
              className="main-menu-button secondary"
              onClick={onManualSave}
              disabled={saveDisabled}
            >
              Save Game
            </button>
            <button
              type="button"
              className="main-menu-button secondary"
              onClick={onOpenLoad}
              disabled={loadDisabled}
            >
              Load Game
            </button>
          </div>
        </div>

        <footer className="main-menu-footer">
          <div className="main-menu-status-text">
            {isLoading ? (
              <span>Checking cloud saves...</span>
            ) : (
              <span>
                {hasSave ? 'Cloud saves available' : 'No saves yet - start a new adventure!'}
              </span>
            )}
          </div>
          
          <div className="main-menu-links">
            <button type="button" className="main-menu-link" onClick={onSettings}>
              Settings
            </button>
            <button type="button" className="main-menu-link" onClick={onCredits}>
              Credits
            </button>
            <button type="button" className="main-menu-link danger" onClick={onQuit}>
              Quit Game
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
