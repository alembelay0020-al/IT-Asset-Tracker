
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import './Login.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        { username, password }
      )

      const data = response.data
      const token =
        typeof data === 'string'
          ? data
          : data?.token ?? data?.accessToken ?? data?.jwt

      if (!token) {
        setError('Login response received, but the JWT field was not recognized.')
        console.error('Login response:', data)
        return
      }

      localStorage.setItem('token', token)
      navigate('/dashboard')
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data?.message ||
          'Login failed. Check your username and password.'
        )
      } else {
        setError('Cannot connect to the backend. Check that the API is running.')
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
        <h1>Welcome back</h1>
        <p className="auth-description">
          Sign in to manage your organization's equipment.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider" />

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create an account</Link>
        </p>

        <p className="auth-security">Secure access · Authorized users only</p>
      </section>
    </main>
  )
}

export default Login
