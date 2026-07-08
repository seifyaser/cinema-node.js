import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="flex items-center justify-center animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 50,
        backdropFilter: 'blur(4px)'
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '1rem', position: 'relative' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontSize: '1.25rem' }}>{title}</h2>
          <button onClick={onClose} className="p-2" style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
