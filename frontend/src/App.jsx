import React, { useState } from 'react'
import Header from '../Components/Header'
import Tools from '../Components/Tools'
import SignIn from '../Components/SignIn'
import SignUp from '../Components/SignUp'
import About from '../Components/About'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('tools') // 'tools', 'signin', or 'signup'
  const [activeToolTab, setActiveToolTab] = useState('generator')

  const handleGoHome = () => {
    if (currentView !== 'tools') {
      setCurrentView('tools')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectTool = (toolName) => {
    setActiveToolTab(toolName)
    if (currentView !== 'tools') {
      setCurrentView('tools')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='app-container'>
      <div className='app-sticky-header'>
        <Header
          onSignInClick={() => setCurrentView('signin')}
          onHomeClick={handleGoHome}
          onToolSelect={handleSelectTool}
        />
      </div>

      {currentView === 'tools' && (
        <>
          {/* Main AI Tools Area */}
          <Tools
            activeTab={activeToolTab}
            onTabChange={setActiveToolTab}
          />

          {/* About Section at Bottom of Home */}
          <About onBackToTools={handleGoHome} />
        </>
      )}
      
      {currentView === 'signin' && (
        <SignIn
          onBackToTools={handleGoHome}
          onSwitchToSignUp={() => setCurrentView('signup')}
        />
      )}

      {currentView === 'signup' && (
        <SignUp
          onBackToTools={handleGoHome}
          onSwitchToSignIn={() => setCurrentView('signin')}
        />
      )}
    </div>
  )
}

export default App
