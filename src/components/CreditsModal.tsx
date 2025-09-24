// src/components/CreditsModal.tsx
interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreditsModal({ isOpen, onClose }: CreditsModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="credits-modal" role="dialog" aria-modal="true">
      <div className="credits-panel">
        <header className="credits-header">
          <h2>Credits</h2>
          <button type="button" className="credits-close" onClick={onClose}>
            Close
          </button>
        </header>
        <div className="credits-body">
          <p>This space is reserved for the brave souls behind Idle RPG.</p>
          <p>Design inspiration: Melvor Idle. Built with a whole lot of TypeScript and coffee.</p>
          <p className="credits-footer">Full credits coming soon!</p>
        </div>
      </div>
    </div>
  );
}
