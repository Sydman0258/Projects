import React from 'react';
import './ScoreDisplay.css';

function ScoreDisplay({ analysis, onReset }) {
  const { 
    overallScore, 
    keywordScore, 
    skillScore, 
    keywordMatches, 
    skillMatches, 
    experienceMatch,
    recommendation 
  } = analysis;

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const CircularScore = ({ score, label }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const color = getScoreColor(score);

    return (
      <div className="circular-score">
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="score-text">
          <div className="score-number" style={{ color }}>{score}%</div>
          <div className="score-label">{label}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="score-display">
      <div className="score-header">
        <h2>Analysis Complete! 🎯</h2>
      </div>

      {/* Overall Score */}
      <div className="overall-section">
        <CircularScore score={overallScore} label="Overall Match" />
        <div className="recommendation" style={{ borderColor: recommendation.color }}>
          <h3 style={{ color: recommendation.color }}>{recommendation.level}</h3>
          <p>{recommendation.message}</p>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="detailed-scores">
        <div className="score-card">
          <CircularScore score={keywordScore} label="Keywords" />
          <div className="score-details">
            <p><strong>{keywordMatches.matched}</strong> of <strong>{keywordMatches.total}</strong> keywords found</p>
          </div>
        </div>

        <div className="score-card">
          <CircularScore score={skillScore} label="Skills" />
          <div className="score-details">
            <p><strong>{skillMatches.matched}</strong> of <strong>{skillMatches.total}</strong> skills found</p>
          </div>
        </div>
      </div>

      {/* Experience Match */}
      {experienceMatch.required > 0 && (
        <div className="experience-section">
          <h3>📅 Experience Level</h3>
          <div className="experience-bar">
            <div className="experience-info">
              <span>Required: {experienceMatch.required}+ years</span>
              <span>Found: {experienceMatch.found} years</span>
            </div>
            <div className={`experience-badge ${experienceMatch.meets ? 'meets' : 'below'}`}>
              {experienceMatch.meets ? '✓ Meets Requirement' : '⚠ Below Requirement'}
            </div>
          </div>
        </div>
      )}

      {/* Matched Skills */}
      {skillMatches.matchedList.length > 0 && (
        <div className="matches-section">
          <h3>✅ Matched Skills ({skillMatches.matchedList.length})</h3>
          <div className="skills-list matched">
            {skillMatches.matchedList.map((skill, index) => (
              <span key={index} className="skill-tag matched">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {skillMatches.missingList.length > 0 && (
        <div className="matches-section">
          <h3>❌ Missing Skills ({skillMatches.missingList.length})</h3>
          <div className="skills-list missing">
            {skillMatches.missingList.map((skill, index) => (
              <span key={index} className="skill-tag missing">{skill}</span>
            ))}
          </div>
          <p className="tip">💡 Consider adding these skills to your resume if you have them!</p>
        </div>
      )}

      {/* Matched Keywords */}
      {keywordMatches.matchedList.length > 0 && (
        <div className="matches-section">
          <h3>🔑 Top Matched Keywords</h3>
          <div className="keywords-list">
            {keywordMatches.matchedList.slice(0, 15).map((keyword, index) => (
              <span key={index} className="keyword-tag">{keyword}</span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Keywords */}
      {keywordMatches.missingList.length > 0 && (
        <div className="matches-section">
          <h3>📝 Consider Adding These Keywords</h3>
          <div className="keywords-list">
            {keywordMatches.missingList.slice(0, 10).map((keyword, index) => (
              <span key={index} className="keyword-tag missing">{keyword}</span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="reset-btn" onClick={onReset}>
          <span className="btn-icon">🔄</span>
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
}

export default ScoreDisplay;
