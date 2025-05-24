
import { useState } from 'react';
import { useToastContext } from './toast-context';
import { ToastItem } from './toast-item';

export function ToastManager() {
const { toasts } = useToastContext();
  const [isHovered, setIsHovered] = useState(false);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-2 right-2 z-50 pointer-events-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="pointer-events-auto">
        {toasts.map((toast: { id: any; }, index: any) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            index={index}
            isHovered={isHovered}
          />
        ))}
      </div>
    </div>
  );
};
