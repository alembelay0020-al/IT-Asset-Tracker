
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:8080/api'

function Assets() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [assets, setAssets] = useState([])
  const [categories, setCategories] = useState([])
  const [role, setRole] = useState('User')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [assignmentIds, setAssignmentIds] = useState({})

  const [name, setName] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userRole = payload.roles?.[0] || 'User'
      setRole(String(userRole).replace('ROLE_', ''))
    } catch {
      localStorage.removeItem('token')
      navigate('/login', { replace: true })
    }
  }, [navigate, token])

  async function loadData() {
    if (!token) return

    try {
      setLoading(true)

      const [assetResponse, categoryResponse] = await Promise.all([
        axios.get(`${API_URL}/assets`, {
          headers,
          params: statusFilter ? { status: statusFilter } : {},
        }),
        axios.get(`${API_URL}/categories`, { headers }),
      ])

      setAssets(Array.isArray(assetResponse.data) ? assetResponse.data : [])
      setCategories(Array.isArray(categoryResponse.data) ? categoryResponse.data : [])
      setError('')
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/login', { replace: true })
        return
      }

      setError(err.response?.data?.message || 'Could not load assets and categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) loadData()
  }, [token, statusFilter])

  async function addAsset(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      await axios.post(`${API_URL}/assets`, {
        name: name.trim(),
        serialNumber: serialNumber.trim(),
        categoryId: Number(categoryId),
      }, { headers })

      setName('')
      setSerialNumber('')
      setCategoryId('')
      setMessage('Asset added successfully.')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add asset.')
    }
  }

  async function assignAsset(assetId) {
    const userId = assignmentIds[assetId]?.trim()

    if (!userId) {
      setError('Enter the staff member user UUID before assigning.')
      return
    }

    setError('')
    setMessage('')

    try {
      await axios.patch(
        `${API_URL}/assets/${assetId}/assign/${userId}`,
        {},
        { headers }
      )

      setMessage('Asset assigned successfully.')
      setAssignmentIds((previous) => ({ ...previous, [assetId]: '' }))
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not assign this asset. Check the user UUID and asset status.')
    }
  }

  async function returnAsset(assetId) {
    setError('')
    setMessage('')

    try {
      await axios.patch(
        `${API_URL}/assets/${assetId}/return`,
        {},
        { headers }
      )

      setMessage('Asset returned successfully.')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not return this asset.')
    }
  }

  async function deleteAsset(assetId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this asset? This cannot be undone.'
    )

    if (!confirmed) return

    setError('')
    setMessage('')

    try {
      await axios.delete(`${API_URL}/assets/${assetId}`, { headers })

      setMessage('Asset deleted successfully.')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete this asset.')
    }
  }

  function formatStatus(status) {
    if (!status) return 'Unknown'
    return status.charAt(0) + status.slice(1).toLowerCase()
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>IT Asset Tracker</h2>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link className="active" to="/assets">Assets</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/my-assets">My Assets</Link>
        </nav>
        <div className="sidebar-footer">Equipment Management</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Assets</h1>
            <p>View and manage your organization's IT equipment.</p>
          </div>
          <span className="user-badge">{role}</span>
        </header>

        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}

        {role === 'ADMIN' && (
          <section className="assets-panel">
            <div className="panel-header">
              <div>
                <h2>Add New Asset</h2>
                <p>Register equipment in your inventory.</p>
              </div>
            </div>

            <form onSubmit={addAsset} className="category-form">
              <label htmlFor="assetName">Asset name</label>
              <input
                id="assetName"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. HP Monitor"
                maxLength={150}
                required
              />

              <label htmlFor="serialNumber">Serial number</label>
              <input
                id="serialNumber"
                value={serialNumber}
                onChange={(event) => setSerialNumber(event.target.value)}
                placeholder="e.g. MON-002"
                maxLength={100}
                required
              />

              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <button type="submit">Add Asset</button>
            </form>
          </section>
        )}

        <section className="assets-panel">
          <div className="panel-header">
            <div>
              <h2>All Assets</h2>
              <p>Equipment retrieved from your backend.</p>
            </div>
          </div>

          <div className="filter-section">
            <label htmlFor="statusFilter">Filter by status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>

          {loading && <p>Loading assets...</p>}

          {!loading && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Serial Number</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    {role === 'ADMIN' && <th>Actions</th>}
                  </tr>
                </thead>

                <tbody>
                  {assets.length === 0 ? (
                    <tr>
                      <td colSpan={role === 'ADMIN' ? 6 : 5}>
                        No assets found.
                      </td>
                    </tr>
                  ) : (
                    assets.map((asset) => (
                      <tr key={asset.id}>
                        <td>{asset.name || '—'}</td>
                        <td>{asset.serialNumber || '—'}</td>
                        <td>
                          {asset.categoryName || asset.category?.name || '—'}
                        </td>
                        <td>
                          <span className={`status ${asset.status?.toLowerCase() || ''}`}>
                            {formatStatus(asset.status)}
                          </span>
                        </td>
                        <td>
                          {asset.assignedToUsername || asset.assignedTo?.username || '—'}
                        </td>

                        {role === 'ADMIN' && (
                          <td>
                            {asset.status === 'AVAILABLE' && (
                              <div>
                                <input
                                  type="text"
                                  placeholder="Staff user UUID"
                                  value={assignmentIds[asset.id] || ''}
                                  onChange={(event) =>
                                    setAssignmentIds((previous) => ({
                                      ...previous,
                                      [asset.id]: event.target.value,
                                    }))
                                  }
                                />
                                <button type="button" onClick={() => assignAsset(asset.id)}>
                                  Assign
                                </button>
                              </div>
                            )}

                            {asset.status === 'ASSIGNED' && (
                              <button type="button" onClick={() => returnAsset(asset.id)}>
                                Return
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => deleteAsset(asset.id)}
                            >
                              Delete
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Assets
