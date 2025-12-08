import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const ProgressBar = ({ progress }) => {
  return (
    <StyledWrapper>
      <div className="progress-container">
        <div className="progress-info">
          <span className="progress-label">Form Progress</span>
          <span className="progress-percentage">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar-bg">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="progress-glow"></div>
          </motion.div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .progress-container {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(17, 17, 17, 0.5);
    border: 1px solid #1f1f1f;
    border-radius: 0.75rem;
    backdrop-filter: blur(10px);
  }

  .progress-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .progress-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #d1d5db;
  }

  .progress-percentage {
    font-size: 1rem;
    font-weight: 700;
    color: #3b82f6;
  }

  .progress-bar-bg {
    height: 12px;
    background: #1a1a1a;
    border-radius: 9999px;
    overflow: hidden;
    position: relative;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 50%, #3b82f6 100%);
    background-size: 200% 100%;
    border-radius: 9999px;
    position: relative;
    animation: shimmer 2s linear infinite;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }

  .progress-glow {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: slide 1.5s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @keyframes slide {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(300%);
    }
  }

  @media (max-width: 768px) {
    .progress-container {
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .progress-label {
      font-size: 0.75rem;
    }

    .progress-percentage {
      font-size: 0.875rem;
    }

    .progress-bar-bg {
      height: 10px;
    }
  }
`;

export default ProgressBar;
