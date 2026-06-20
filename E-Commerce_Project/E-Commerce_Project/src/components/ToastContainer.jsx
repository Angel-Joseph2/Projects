import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" style={containerStyle}>
      {toasts.map(toast => (
        <div key={toast.id} className="toast-item" style={toastStyle}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};

const containerStyle = {
  position: 'fixed',
  bottom: '2.5rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 3000,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  pointerEvents: 'none',
  alignItems: 'center',
};

const toastStyle = {
  background: 'var(--navy)',
  color: '#fff',
  padding: '0.75rem 1.75rem',
  borderRadius: '50px',
  fontSize: '0.88rem',
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 500,
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  animation: 'toast-appear 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
  whiteSpace: 'nowrap',
  border: '1px solid var(--border)',
};
