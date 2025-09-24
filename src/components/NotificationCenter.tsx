// src/components/NotificationCenter.tsx
interface NotificationCenterProps {
  notifications: Array<{
    id: string;
    message: string;
    type: 'gain' | 'sell' | 'warning';
  }>;
}

export function NotificationCenter({ notifications }: NotificationCenterProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-center" aria-live="polite" aria-atomic="true">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification-toast ${notification.type}`}>
          {notification.message}
        </div>
      ))}
    </div>
  );
}

