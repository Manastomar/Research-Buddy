import React, { useState } from 'react'
import { downloadAsPdf, getSafeFilename } from '../utils/downloadUtils'
import './Humanizer.css'

function Humanizer() {
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

  const handleHumanize = () => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    setResult("Rewriting text to sound more natural and human...");

    fetch("http://localhost:5000/humanize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to humanize text");
        }
        return data;
      })
      .then((data) => {
        setResult(data.result || "No result returned.");
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
    !result.startsWith("Rewriting")
  );

  const handleCopy = () => {
    if (!hasValidResult) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (!hasValidResult) return;
    const baseName = getSafeFilename(text, "Humanized_Text");
    const docTitle = "Humanized Academic Text";
    downloadAsPdf(docTitle, result, `${baseName}.pdf`);
  };

  return (
    <div className='humanizer-container'>
      {/* Input Text Box */}
      <div className='humanizer-box'>
        <div className='humanizer-box-header'>
          AI-Generated Text
        </div>
        <textarea
          placeholder='Paste your AI-generated text here to make it sound more natural and human...'
          className='humanizer-textarea'
          value={text}
          onChange={handleTextChange}
        />
        <div className='humanizer-action-bar'>
          <div>
            Words: <span className='humanizer-word-count'>{wordCount}</span>
          </div>
          <button
            className='humanizer-btn'
            disabled={isLoading || !text.trim()}
            onClick={handleHumanize}
          >
            {isLoading ? "Rewriting..." : "Humanize"}
          </button>
        </div>
      </div>

      {/* Humanized Output Text Box */}
      <div className='humanizer-result-box'>
        <div className='humanizer-result-header'>
          <span>Humanized Text</span>
          {hasValidResult && (
            <div className='humanizer-header-actions'>
              <button
                onClick={handleCopy}
                className={`humanizer-action-btn ${copied ? 'copied' : ''}`}
                title='Copy text to clipboard'
              >
                {copied ? "Copied! ✓" : "📋 Copy"}
              </button>
              <button
                onClick={handleDownloadPdf}
                className='humanizer-action-btn pdf'
                title='Download as PDF document (.pdf)'
              >
                📄 Download PDF
              </button>
            </div>
          )}
        </div>
        <div className='humanizer-result-content'>
          {result || <span className='humanizer-placeholder'>Your humanized text will appear here...</span>}
        </div>
      </div>
    </div>
  );
}

export default Humanizer;
