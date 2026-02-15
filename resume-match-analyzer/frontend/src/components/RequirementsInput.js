import React from 'react';
import './RequirementsInput.css';

function RequirementsInput({ value, onChange }) {
  return (
    <div className="requirements-section">
      <h2>📋 Job Requirements & Skills</h2>
      <textarea
        className="requirements-textarea"
        placeholder="Enter job requirements, desired skills, keywords, and qualifications...

Example:
- 5+ years of experience in React and Node.js
- Strong understanding of RESTful APIs
- Experience with cloud platforms (AWS, Azure)
- Excellent communication and teamwork skills
- Bachelor's degree in Computer Science or related field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
      />
      <div className="char-count">
        {value.length} characters
      </div>
    </div>
  );
}

export default RequirementsInput;
