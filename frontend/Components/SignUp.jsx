import React, { useState } from 'react'
import './SignUp.css'

function SignUp({ onBackToTools, onSwitchToSignIn }) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage("")

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!")
      return
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.")
      return
    }

    if (!agreeTerms) {
      setErrorMessage("You must agree to the Terms of Service.")
      return
    }

    setIsLoading(true)

    fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password
      }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Failed to create account")
        }
        return data
      })
      .then((data) => {
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user))
        }
        setIsSignedUp(true)
      })
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className='signup-wrapper'>
      <div className='signup-card'>
        
        {/* Back Button */}
        {onBackToTools && (
          <button onClick={onBackToTools} className='signup-back-btn'>
            <span>←</span>
            <span>Back</span>
          </button>
        )}

        {/* Header Title */}
        <div className='signup-header'>
          <h2 className='signup-title'>
            Create an Account
          </h2>
          <p className='signup-subtitle'>
            Join Research Buddy to save research, check plagiarism, and track history.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className='signup-error-box'>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Success Alert if Submitted */}
        {isSignedUp ? (
          <div className='signup-success-box'>
            <div className='signup-success-badge'>
              ✓
            </div>
            <div>
              <h3 className='signup-success-title'>Account Created Successfully!</h3>
              <p className='signup-success-text'>
                Welcome, <span className='signup-success-name'>{fullName}</span>! Your account has been created with email: {email}.
              </p>
            </div>
            <button onClick={onBackToTools} className='signup-submit-btn'>
              Start Using AI Tools
            </button>
          </div>
        ) : (
          /* Sign Up Form */
          <form onSubmit={handleSubmit} className='signup-form'>
            {/* Full Name */}
            <div className='signup-form-group'>
              <label className='signup-label'>
                Full Name
              </label>
              <input
                type='text'
                required
                placeholder='John Doe'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className='signup-input'
              />
            </div>

            {/* Email Address */}
            <div className='signup-form-group'>
              <label className='signup-label'>
                Email Address
              </label>
              <input
                type='email'
                required
                placeholder='john@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='signup-input'
              />
            </div>

            {/* Password */}
            <div className='signup-form-group'>
              <label className='signup-label'>
                Password
              </label>
              <div className='signup-password-wrapper'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder='At least 6 characters'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='signup-input signup-input-password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='signup-password-toggle'
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className='signup-form-group'>
              <label className='signup-label'>
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder='Re-enter your password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='signup-input'
              />
            </div>

            {/* Terms Checkbox */}
            <div className='signup-checkbox-group'>
              <input
                type='checkbox'
                id='terms'
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className='signup-checkbox'
              />
              <label htmlFor='terms' className='signup-checkbox-label'>
                I agree to the <a href='#' className='signup-link'>Terms of Service</a> and <a href='#' className='signup-link'>Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              className='signup-submit-btn'
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Switch to Sign In Link */}
            <p className='signup-switch-prompt'>
              Already have an account?{' '}
              <button
                type='button'
                onClick={onSwitchToSignIn}
                className='signup-switch-link'
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default SignUp
