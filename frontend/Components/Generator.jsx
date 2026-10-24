import React, { useState } from 'react'
import { downloadAsPdf, getSafeFilename } from '../utils/downloadUtils'
import './Generator.css'

function Generator() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTextChange = (event) => {
    const value = event.target.value;
    setText(value);
    const words = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
    setWordCount(words);
  };

  const handleGenerate = () => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setResult("Generating structured research paper (Abstract, Introduction, Core Analysis, Discussion, Conclusion)...");

    fetch("http://localhost:5000/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to generate content");
        }
        return data;
      })
      .then((data) => {
        setResult(data.result || "No content returned.");
      })
      .catch((err) => {
        console.error("Error connecting to backend:", err);
        setResult(`Error: ${err.message}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const hasValidResult = Boolean(
    result &&
    !isLoading &&
    !result.startsWith("Error:") &&
    !result.startsWith("Generating")
  );

  const handleCopy = () => {
    if (!hasValidResult) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (!hasValidResult) return;
    const baseName = getSafeFilename(text, "Research_Paper");
    const docTitle = text.trim() ? `Research Paper: ${text.trim()}` : "Academic Research Paper";
    downloadAsPdf(docTitle, result, `${baseName}.pdf`);
  };

  return (
    <div className='generator-container'>
      {/* Input Box */}
      <div className='generator-box'>
        <div className='generator-box-header'>
          Research Topic or Keyword
        </div>
        <textarea
          placeholder="Enter a keyword or research topic (e.g., 'Artificial Intelligence in Healthcare', 'Quantum Computing', 'Renewable Energy')..."
          className='generator-textarea'
          value={text}
          onChange={handleTextChange}
        />
        <div className='generator-action-bar'>
          <div>
            Input Words: <span className='generator-word-count'>{wordCount}</span>
          </div>
          <button
            className='generator-btn'
            disabled={isLoading}
            onClick={handleGenerate}
          >
            {isLoading ? "Generating Research..." : "Generate Research Paper"}
          </button>
        </div>
      </div>

      {/* Generated Research Output Box */}
      <div className='generator-result-box'>
        <div className='generator-result-header'>
          <span>Generated Research Report</span>
          {hasValidResult && (
            <div className='generator-header-actions'>
              <button
                onClick={handleCopy}
                className={`generator-action-btn ${copied ? 'copied' : ''}`}
                title='Copy paper text to clipboard'
              >
                {copied ? "Copied! ✓" : "📋 Copy"}
              </button>
              <button
                onClick={handleDownloadPdf}
                className='generator-action-btn pdf'
                title='Download as PDF document (.pdf)'
              >
                📄 Download PDF
              </button>
            </div>
          )}
        </div>
        <div className='generator-result-content'>
          {result || (
            <span className='generator-placeholder'>
              Enter a keyword or topic above and click "Generate Research Paper" to produce a structured academic research paper with Title, Abstract, Keywords, Introduction, Core Analysis, Discussion, and Conclusion...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Generator;
