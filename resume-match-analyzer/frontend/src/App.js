import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import RequirementsInput from './components/RequirementsInput';
import AnalyzeButton from './components/AnalyzeButton';
import ScoreDisplay from './components/ScoreDisplay';

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!resumeFile) {
      setError('Please upload a resume file');
      return;
    }

    if (!requirements.trim()) {
      setError('Please enter job requirements');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('requirements', requirements);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume');
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResumeFile(null);
    setRequirements('');
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📊 Resume Match Analyzer</h1>
        <p className="subtitle">See how well your resume matches job requirements</p>
      </header>

      <main className="App-main">
        <div className="container">
          {!analysis ? (
            <>
              <FileUpload 
                onFileSelect={setResumeFile} 
                selectedFile={resumeFile}
              />

              <RequirementsInput 
                value={requirements}
                onChange={setRequirements}
              />

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <AnalyzeButton 
                onClick={handleAnalyze}
                loading={loading}
                disabled={!resumeFile || !requirements.trim()}
              />
            </>
          ) : (
            <ScoreDisplay 
              analysis={analysis}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      <footer className="App-footer">
        <p>No API required • 100% free</p>
      </footer>
    </div>
  );
}

export default App;
