import React from 'react';
import './AnalyzeButton.css';

function AnalyzeButton({ onClick, loading, disabled }) {
  return (
    <div className="analyze-button-container">
      <button
        className={`analyze-btn ${loading ? 'loading' : ''}`}
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Analyzing...
          </>
        ) : (
          <>
            <span className="btn-icon">✨</span>
            Tailor Resume
          </>
        )}
      </button>
    </div>
  );
}

export default AnalyzeButton;
