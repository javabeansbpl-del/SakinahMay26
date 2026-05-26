import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Signup() {
  const navigate    = useNavigate()
  const { register } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState('')
  const [loading,   setLoading]   = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    setError('')

    // ── Client-side validation ─────────────────
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      await register({
        firstName,
        lastName,
        email,
        password,
      })
      setSuccess('Account created! Check your email to verify before logging in.')
    } catch (err) {
      const msg = err.response?.data?.message
               || err.response?.data?.email
               || err.response?.data?.password
               || 'Sign up failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <span className="allah-symbol" style={{ fontSize: '2.5rem' }}>ﷲ</span>
          <h2 className="auth-brand">Sakinah</h2>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join the Sakinah community</p>

        {error   && <p className="form-error">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        {!success && (
          <form onSubmit={handleSignup}>

            {/* First name + Last name side by side */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div className="input-wrapper" style={{ flex: 1 }}>
                <label className="field-label" htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName"
                  className="text-input"
                  type="text"
                  placeholder="Ahmad"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </div>

              <div className="input-wrapper" style={{ flex: 1 }}>
                <label className="field-label" htmlFor="lastName">
                  Last name
                </label>
                <input
                  id="lastName"
                  className="text-input"
                  type="text"
                  placeholder="Khan"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="input-wrapper">
              <label className="field-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="text-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="input-wrapper">
              <label className="field-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="text-input"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="input-wrapper">
              <label className="field-label" htmlFor="confirm">
                Confirm password
              </label>
              <input
                id="confirm"
                className="text-input"
                type="password"
                placeholder="Repeat password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="action-button"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        )}

        {success && (
          <button
            className="action-button"
            onClick={() => navigate('/login')}
          >
            Go to login
          </button>
        )}

        {!success && (
          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        )}

      </div>
    </div>
  )
}