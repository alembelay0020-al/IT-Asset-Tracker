
import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

const API_URL = 'http://localhost:8080/api'

function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const cleanUsername = username.trim()

    if (cleanUsername.length < 3 || cleanUsername.length > 50) {
      setError('Username must be between 3 and 50 characters.')
      return
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(cleanUsername)) {
      setError('Username can contain letters, numbers, dots, underscores, and hyphens only.')
      return
    }

    if (password.length < 8 || password.length > 72) {
      setError('Password must be between 8 and 72 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)

      await axios.post(`${API_URL}/auth/register`, {
        username: cleanUsername,
        password,
      })

      setSuccess('Registration successful! Redirecting to login...')
      setUsername('')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1500)
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This username already exists. Please choose another username.')
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || 'Invalid registration details.')
      } else if (err.response?.status === 403) {
        setError('You are not authorized to register. Please contact your administrator.')
      } else if (!err.response) {
        setError('Cannot connect to the server. Please check that the backend is running.')
      } else {
        setError(err.response.data?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo">IT</div>

        <span className="auth-eyebrow">ASSET MANAGEMENT SYSTEM</span>

        <h1>Create your account</h1>

        <p className="auth-description">
          Register as a staff member to access the IT Asset Tracker.
        </p>

        <form onSubmit={handleRegister} className="auth-form">
          {error && <p className="auth-error" role="alert">{error}</p>}
          {success && <p className="auth-success" role="status">{success}</p>}

          <div className="auth-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Choose a username"
              minLength={3}
              maxLength={50}
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              required
              disabled={loading}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Enter your password again"
              autoComplete="new-password"
              required
              disabled={loading}
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider" />

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <p className="auth-security">
          Secure access · Authorized users only
        </p>
      </section>
    </main>
  )
}

export default Register
