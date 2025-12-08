import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {message && (
        <StyledWrapper>
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.3 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`toast toast-${type}`}
          >
            <div className="toast-icon">
              {type === 'success' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="toast-content">
              <div className="toast-title">{type === 'success' ? 'Success!' : 'Error'}</div>
              <div className="toast-message">{message}</div>
            </div>
            <button onClick={onClose} className="toast-close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </motion.div>
        </StyledWrapper>
      )}
    </AnimatePresence>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 9999;

  .toast {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    background: #111111;
    border-radius: 0.75rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    min-width: 350px;
    max-width: 500px;
    border: 1px solid;
  }

  .toast-success {
    border-color: #10b981;
  }

  .toast-error {
    border-color: #ef4444;
  }

  .toast-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .toast-success .toast-icon {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
  }

  .toast-error .toast-icon {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }

  .toast-content {
    flex: 1;
  }

  .toast-title {
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }

  .toast-success .toast-title {
    color: #10b981;
  }

  .toast-error .toast-title {
    color: #ef4444;
  }

  .toast-message {
    font-size: 0.875rem;
    color: #d1d5db;
    line-height: 1.4;
  }

  .toast-close {
    flex-shrink: 0;
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s;
  }

  .toast-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    left: 1rem;

    .toast {
      min-width: auto;
      max-width: none;
      padding: 1rem;
      gap: 0.75rem;
    }

    .toast-icon {
      width: 32px;
      height: 32px;
    }

    .toast-icon svg {
      width: 18px;
      height: 18px;
    }

    .toast-title {
      font-size: 0.875rem;
    }

    .toast-message {
      font-size: 0.8125rem;
    }
  }
`;

export default Toast;
