import React, { useState } from 'react'
import './SignIn.css'

function SignIn({ onBackToTools, onSwitchToSignUp }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage("")

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.")
      return
    }

    setIsLoading(true)

    fetch("http://localhost:5000/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Failed to sign in")
        }
        return data
      })
      .then((data) => {
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user))
        }
        setIsSignedIn(true)
      })
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className='auth-wrapper'>
      <div className='auth-card'>
        
        {/* Back Button */}
        {onBackToTools && (
          <button onClick={onBackToTools} className='auth-back-btn'>
            <span>←</span>
            <span>Back</span>
          </button>
        )}

        {/* Header Title */}
        <div className='auth-header'>
          <h2 className='auth-title'>
            Sign in to Research Buddy
          </h2>
          <p className='auth-subtitle'>
            Welcome back! Access your AI tools and saved research history.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className='signup-error-box' style={{ marginBottom: "1rem" }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Success Alert if Submitted */}
        {isSignedIn ? (
          <div className='auth-success-box'>
            <div className='auth-success-badge'>
              ✓
            </div>
            <div>
              <h3 className='auth-success-title'>Signed in successfully!</h3>
              <p className='auth-success-text'>Signed in as <span className='auth-success-email'>{email}</span></p>
            </div>
            <button onClick={onBackToTools} className='auth-submit-btn'>
              Continue to AI Tools
            </button>
          </div>
        ) : (
          /* Sign In Form */
          <form onSubmit={handleSubmit} className='auth-form'>
            {/* Email Input */}
            <div className='auth-form-group'>
              <label className='auth-label'>
                Email Address
              </label>
              <input
                type='email'
                required
                placeholder='name@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='auth-input'
              />
            </div>

            {/* Password Input */}
            <div className='auth-form-group'>
              <label className='auth-label'>
                Password
              </label>
              <div className='auth-password-wrapper'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='auth-input auth-input-password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='auth-password-toggle'
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='auth-submit-btn'
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* Sign Up Link */}
            <p className='auth-switch-prompt'>
              Don't have an account?{' '}
              <button
                type='button'
                onClick={onSwitchToSignUp}
                className='auth-switch-link'
              >
                Sign up for free
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default SignIn
