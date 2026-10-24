import React, { useState } from 'react'
import Generator from './Generator'
import Detector from './Detector'
import Humanizer from './Humanizer'
import './Tools.css'

function Tools({ activeTab: externalTab, onTabChange }) {
  const [internalTab, setInternalTab] = useState('generator')
  const activeTab = externalTab !== undefined ? externalTab : internalTab
  const setActiveTab = onTabChange || setInternalTab

  return (
    <div className='tools-wrapper'>
      <div className='tools-card'>
        {/* Navigation Tabs */}
        <div className='tools-nav-tabs'>
          <button
            onClick={() => setActiveTab('generator')}
            className={`tools-tab-btn ${activeTab === 'generator' ? 'active' : ''}`}
          >
            AI Generator
          </button>
          <button
            onClick={() => setActiveTab('detector')}
            className={`tools-tab-btn ${activeTab === 'detector' ? 'active' : ''}`}
          >
            AI Detector
          </button>
          <button
            onClick={() => setActiveTab('humanizer')}
            className={`tools-tab-btn ${activeTab === 'humanizer' ? 'active' : ''}`}
          >
            AI Humanizer
          </button>
        </div>

        {/* Render Active Tool */}
        <div className='tools-content-area'>
          {activeTab === 'generator' && <Generator />}
          {activeTab === 'detector' && <Detector />}
          {activeTab === 'humanizer' && <Humanizer />}
        </div>
      </div>
    </div>
  )
}

export default Tools
