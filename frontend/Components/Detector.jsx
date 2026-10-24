import React, { useState } from 'react'
import { downloadAsPdf } from '../utils/downloadUtils'
import './Detector.css'

function Detector() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sample academic text for quick testing
  const sampleAcademicText = `Artificial Intelligence in healthcare is transforming clinical paradigms. Machine learning models and deep neural networks are increasingly applied in diagnostic imaging, pathology, and genomics to identify abnormalities with high accuracy. However, concerns regarding algorithmic transparency, ethical accountability, and data privacy remain significant challenges.`;

  const handleTextChange = (event) => {
    const value = event.target.value;
    setText(value);
    const words = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
    setWordCount(words);
    setCharCount(value.length);
  };

  const handleLoadSample = () => {
    setText(sampleAcademicText);
    const words = sampleAcademicText.trim().split(/\s+/).length;
    setWordCount(words);
    setCharCount(sampleAcademicText.length);
  };

  const handleClear = () => {
    setText("");
    setWordCount(0);
    setCharCount(0);
    setResult("");
  };

  const handleCopyReport = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDetect = () => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setResult("");

    fetch("http://localhost:5000/detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to check plagiarism");
        }
        return data;
      })
      .then((data) => {
        setResult(data.result || "No report returned.");
      })
      .catch((err) => {
        console.error("Error connecting to backend:", err);
        setResult(`Error: ${err.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Helper to extract score and risk from Gemini output
  const parseMetrics = (report) => {
    if (!report) return { score: null, risk: null };
    const scoreMatch = report.match(/Originality Score[:\s]*(\d+)%/i);
    const riskMatch = report.match(/Plagiarism Risk[:\s]*(Low|Moderate|High)/i);
    return {
      score: scoreMatch ? parseInt(scoreMatch[1], 10) : null,
      risk: riskMatch ? riskMatch[1] : null,
    };
  };

  const { score, risk } = parseMetrics(result);

  const handleDownloadPdf = () => {
    if (!result) return;
    const docTitle = "Originality & Plagiarism Audit Report";
    downloadAsPdf(docTitle, result, `Originality_Report_${Date.now()}.pdf`);
  };

  return (
    <div className='detector-container'>

      {/* Modern Header Banner */}
      <div className='detector-header-banner'>
        <div className='detector-banner-left'>
          <div className='detector-icon-badge'>
            🛡️
          </div>
          <div>
            <h2 className='detector-banner-title'>Plagiarism &amp; Originality Detector</h2>
            <p className='detector-banner-subtitle'>
              Deep linguistic scanner powered by NLTK and AI to evaluate originality and detect copied content.
            </p>
          </div>
        </div>

        {/* Live Text Stats */}
        <div className='detector-banner-stats'>
          <div className='detector-stat-pill'>
            <span>Words:</span>
            <strong>{wordCount}</strong>
          </div>
          <div className='detector-stat-pill'>
            <span>Chars:</span>
            <strong>{charCount}</strong>
          </div>
          <div className='detector-stat-pill'>
            <span>Est. Read:</span>
            <strong>{Math.ceil(wordCount / 200) || 0}m</strong>
          </div>
        </div>
      </div>

      {/* Two-Column Workspace Grid */}
      <div className='detector-grid'>

        {/* LEFT COLUMN: Input Card */}
        <div className='detector-card'>
          <div className='detector-card-header'>
            <div className='detector-card-title'>
              <span>✍️</span> Document Text to Inspect
            </div>
            <div className='detector-header-actions'>
              <button onClick={handleLoadSample} className='detector-action-link' title='Load sample text'>
                Load Sample
              </button>
              {text && (
                <button onClick={handleClear} className='detector-action-link' title='Clear text'>
                  Clear
                </button>
              )}
            </div>
          </div>

          <textarea
            placeholder='Paste your essay, article, or research paper draft here to inspect originality, duplicate phrasing, and plagiarism risk...'
            className='detector-textarea'
            value={text}
            onChange={handleTextChange}
          />

          <div className='detector-bottom-bar'>
            <div className='detector-word-meta'>
              Document contains <strong>{wordCount}</strong> words
            </div>
            <button
              className='detector-check-btn'
              disabled={isLoading || !text.trim()}
              onClick={handleDetect}
            >
              <span>🔍</span>
              {isLoading ? "Analyzing..." : "Check Originality"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Output & Report Card */}
        <div className='detector-card'>
          <div className='detector-card-header'>
            <div className='detector-card-title'>
              <span>📊</span> Originality &amp; Plagiarism Report
            </div>
            {result && !isLoading && (
              <div className='detector-header-actions'>
                <button
                  onClick={handleCopyReport}
                  className={`detector-action-btn ${copied ? 'copied' : ''}`}
                  title='Copy report to clipboard'
                >
                  {copied ? "Copied! ✓" : "📋 Copy"}
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className='detector-action-btn pdf'
                  title='Download audit report as PDF (.pdf)'
                >
                  📄 Download PDF
                </button>
              </div>
            )}
          </div>

          {/* Radar Scanning Loading State */}
          {isLoading && (
            <div className='detector-scanning-overlay'>
              <div className='detector-radar-spinner'></div>
              <div className='detector-scanning-title'>Scanning Text &amp; Matching N-Grams...</div>
              <div className='detector-scanning-subtext'>
                Checking linguistic predictability, shared vocabularies, and originality...
              </div>
            </div>
          )}

          {/* Empty State */}
          {!result && !isLoading && (
            <div className='detector-empty-state'>
              <div className='detector-empty-icon'>📄</div>
              <div className='detector-empty-text'>
                Paste text on the left and click <strong>"Check Originality"</strong> to generate a comprehensive originality score and similarity breakdown.
              </div>
            </div>
          )}

          {/* Results State */}
          {result && !isLoading && (
            <>
              {/* Score Cards Row if Parsed */}
              {score !== null && (
                <div className='detector-score-cards'>
                  <div className='detector-metric-card'>
                    <span className='detector-metric-label'>Originality Score</span>
                    <span className={`detector-metric-value ${
                      score >= 80 ? 'high-originality' : score >= 50 ? 'moderate-originality' : 'low-originality'
                    }`}>
                      {score}%
                    </span>
                  </div>

                  <div className='detector-metric-card'>
                    <span className='detector-metric-label'>Plagiarism Risk</span>
                    {risk ? (
                      <span className={`detector-risk-pill ${risk.toLowerCase()}`}>
                        {risk} Risk
                      </span>
                    ) : (
                      <span className='detector-risk-pill low'>Low Risk</span>
                    )}
                  </div>
                </div>
              )}

              {/* Full Detailed Report Box */}
              <div className='detector-report-box'>
                {result}
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default Detector;
