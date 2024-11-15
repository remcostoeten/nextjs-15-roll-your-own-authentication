'use client';

import { Toaster as HotToaster } from 'react-hot-toast';

export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#000',
          color: '#fff',
          border: '1px solid #333',
        },
        success: {
          duration: 4000,
          iconTheme: {
            primary: '#fff',
            secondary: '#000',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ff4b4b',
            secondary: '#000',
          },
        },
      }}
    />
  );
}
