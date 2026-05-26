import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login } = useAuth()

  const from = location.state?.from?.pathname || '/'

  const [mode, setMode]       = useState('login') // 'login' | 'forgot'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // ── Login ─────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      // Server sends back message in err.response.data.message
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── Forgot password — Phase 2 ─────────────────
  async function handleForgot(e) {
    e.preventDefault()
    setSuccess('Password reset is coming soon. Please contact support for now.')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <span className="allah-symbol" style={{ fontSize: '2.5rem' }}>ﷲ</span>
          <h2 className="auth-brand">Sakinah</h2>
        </div>

        {mode === 'login' ? (
          <>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">
              Sign in to access your personal dashboard
            </p>

            {error && <p className="form-error">{error}</p>}

            <form onSubmit={handleLogin}>
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
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="button"
                className="auth-link-btn"
                onClick={() => { setMode('forgot'); setError('') }}
              >
                Forgot password?
              </button>

              <button
                type="submit"
                className="action-button"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="auth-footer-text">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">Sign up</Link>
            </p>
          </>

        ) : (
          <>
            <h1 className="auth-title">Reset password</h1>
            <p className="auth-subtitle">
              Enter your email and we'll send a reset link
            </p>

            {error   && <p className="form-error">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <form onSubmit={handleForgot}>
              <div className="input-wrapper">
                <label className="field-label" htmlFor="reset-email">
                  Email
                </label>
                <input
                  id="reset-email"
                  className="text-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="action-button"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <button
              type="button"
              className="auth-link-btn"
              style={{ marginTop: '1rem' }}
              onClick={() => { setMode('login'); setError(''); setSuccess('') }}
            >
              ← Back to login
            </button>
          </>
        )}
      </div>
    </div>
  )
}