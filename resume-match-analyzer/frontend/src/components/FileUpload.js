import React, { useRef } from 'react';
import './FileUpload.css';

function FileUpload({ onFileSelect, selectedFile }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        onFileSelect(file);
      } else {
        alert('Please upload a .docx file');
        event.target.value = null;
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleRemove = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="file-upload-section">
      <h2>📄 Upload Your Resume</h2>
      <div className="file-upload-container">
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        {!selectedFile ? (
          <div className="upload-area" onClick={handleClick}>
            <div className="upload-icon">📎</div>
            <p className="upload-text">Click to upload resume</p>
            <p className="upload-hint">Supports .docx files only</p>
          </div>
        ) : (
          <div className="file-selected">
            <div className="file-info">
              <span className="file-icon">📄</span>
              <div className="file-details">
                <p className="file-name">{selectedFile.name}</p>
                <p className="file-size">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button 
              className="remove-btn"
              onClick={handleRemove}
              type="button"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
