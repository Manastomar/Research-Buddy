import React from 'react'
import './About.css'

function About({ onBackToTools }) {
  const handleScrollToTop = () => {
    if (onBackToTools) {
      onBackToTools()
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div id='about-section' className='about-wrapper'>
      <div className='about-container'>

        {/* Hero Section */}
        <div className='about-hero'>
          <div className='about-hero-badge'>
            <span>✨</span> Intelligent Academic Companion
          </div>
          <h1 className='about-hero-title'>
            About <span>Research Buddy</span>
          </h1>
          <p className='about-hero-description'>
            Research Buddy is a modern, full-stack Natural Language Processing (NLP) platform engineered
            to simplify academic writing. By combining classical computational linguistics with cutting-edge
            Large Language Models and robust Microsoft SQL Server persistence, it empowers students, educators, and
            researchers to create high-quality, authentic literature.
          </p>
        </div>

        {/* Core Capabilities */}
        <div className='about-features-section'>
          <h2 className='about-section-heading'>Core Capabilities</h2>
          <div className='about-features-grid'>

            <div className='about-feature-card'>
              <div className='about-feature-icon'>📝</div>
              <h3 className='about-feature-title'>Academic Research Generator</h3>
              <p className='about-feature-text'>
                Instantly drafts structured, publication-grade research outlines based on any topic or keyword.
                Generates a formal Title, Abstract, Index Keywords, Introduction, Core Analysis, Discussion, and Conclusion.
              </p>
            </div>

            <div className='about-feature-card'>
              <div className='about-feature-icon'>🛡️</div>
              <h3 className='about-feature-title'>Plagiarism &amp; Originality Checker</h3>
              <p className='about-feature-text'>
                Scans submissions for duplicate phrases, predictability, and uncredited borrowing.
                Returns an intuitive numerical Originality Score, Risk Level assessment, and detailed phrase breakdowns.
              </p>
            </div>

            <div className='about-feature-card'>
              <div className='about-feature-icon'>✍️</div>
              <h3 className='about-feature-title'>AI Text Humanizer</h3>
              <p className='about-feature-text'>
                Transforms repetitive, robotic AI drafts into authentic, engaging human prose.
                Leverages Part-of-Speech (POS) verification and WordNet synonym substitution to preserve context.
              </p>
            </div>

          </div>
        </div>

        {/* Technology Architecture Section */}
        <div className='about-tech-card'>
          <h2 className='about-tech-title'>Hybrid NLP &amp; Engineering Stack</h2>
          <p className='about-tech-subtitle'>
            Built using industry-standard technologies to ensure high speed, fault tolerance, and zero unnecessary API overhead.
          </p>

          <div className='about-tech-pills'>
            <div className='about-tech-pill'><span>⚛️</span> React 19 &amp; Vite 8</div>
            <div className='about-tech-pill'><span>🎨</span> Modular Component CSS</div>
            <div className='about-tech-pill'><span>🐍</span> Python Flask REST API</div>
            <div className='about-tech-pill'><span>📚</span> NLTK (Tokenize, POS, WordNet)</div>
            <div className='about-tech-pill'><span>🤖</span> Google Gemini (High-Speed LLM)</div>
            <div className='about-tech-pill'><span>🗄️</span> Microsoft SQL Server</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className='about-cta'>
          <div className='about-cta-text'>
            Ready to enhance your research workflow?
          </div>
          <button onClick={handleScrollToTop} className='about-cta-btn'>
            ↑ Explore AI Tools
          </button>
        </div>

      </div>
    </div>
  )
}

export default About
