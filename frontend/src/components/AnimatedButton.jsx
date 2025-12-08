import React from 'react';
import styled from 'styled-components';

const AnimatedButton = ({ children, isLoading, ...props }) => {
  return (
    <StyledWrapper>
      <button className="animated-btn" disabled={isLoading} {...props}>
        {isLoading ? (
          <span className="loader-container">
            <span className="loader"></span>
            <span className="loading-text">Submitting...</span>
          </span>
        ) : (
          children
        )}
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .animated-btn {
    position: relative;
    padding: 1rem 2rem;
    width: 100%;
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  }

  .animated-btn::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  .animated-btn:hover::before {
    width: 300px;
    height: 300px;
  }

  .animated-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
  }

  .animated-btn:active {
    transform: translateY(0);
  }

  .animated-btn:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }

  .loader-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  .loader {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-text {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    .animated-btn {
      padding: 0.875rem 1.5rem;
      font-size: 1rem;
    }

    .loader {
      width: 18px;
      height: 18px;
    }
  }
`;

export default AnimatedButton;
