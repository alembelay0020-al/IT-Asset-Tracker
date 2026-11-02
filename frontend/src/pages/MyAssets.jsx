import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tags,
  UserRound,
  LogOut,
  Search,
  RefreshCw,
  Laptop,
  Clock,
  AlertCircle,
  LoaderCircle,
  CheckCircle2,
} from 'lucide-react'

const API_URL = 'http://localhost:8080/api'

function MyAssets() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [assets, setAssets] = useState([])
  const [role, setRole] = useState('User')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')
  const [search, setSearch] = useState('')

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

  async function loadMyAssets() {
    if (!token) return

    try {
      setLoading(true)
      setError('')

      const response = await axios.get(`${API_URL}/assets/my-assets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setAssets(Array.isArray(response.data) ? response.data : [])
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/login', { replace: true })
        return
      }

      setError(
        err.response?.data?.message ||
          'Could not load your assigned assets. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) loadMyAssets()
  }, [token])

  function logout() {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  function formatStatus(status) {
    if (!status) return 'Unknown'
    return status.charAt(0) + status.slice(1).toLowerCase()
  }

  const filteredAssets = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) return assets

    return assets.filter((asset) =>
      [
        asset.name,
        asset.serialNumber,
        asset.categoryName,
        asset.category?.name,
        asset.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [assets, search])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <aside className="flex w-full flex-col bg-slate-950 text-white md:fixed md:inset-y-0 md:w-64">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Package size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold">AssetTrack</h2>
            <p className="text-xs text-slate-400">Equipment Management</p>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-4 md:flex-1 md:flex-col">
          <Link to="/dashboard" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link to="/assets" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
            <Package size={18} />
            Assets
          </Link>

          <Link to="/categories" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
            <Tags size={18} />
            Categories
          </Link>

          <Link to="/my-assets" className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
            <UserRound size={18} />
            My Assets
          </Link>
        </nav>

        <div className="hidden border-t border-white/10 p-4 md:block">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:ml-64 md:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-blue-600">Personal equipment</p>
            <h1 className="text-3xl font-bold tracking-tight">My Assets</h1>
            <p className="mt-2 text-sm text-slate-500">
              View equipment currently assigned to your account.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {role}
            </span>

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 md:hidden"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div role="alert" className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <section className="mb-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Assigned Assets</p>
                <h2 className="mt-3 text-3xl font-bold">{assets.length}</h2>
                <p className="mt-2 text-xs text-slate-400">Equipment assigned to your account</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Laptop size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Last Updated</p>
                <h2 className="mt-3 text-xl font-bold">
                  {lastUpdated || 'Not yet updated'}
                </h2>
                <p className="mt-2 text-xs text-slate-400">Last successful data refresh</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock size={24} />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
            <div>
              <h2 className="text-lg font-bold">My Assigned Equipment</h2>
              <p className="mt-1 text-sm text-slate-500">
                Equipment assigned to your user account.
              </p>
            </div>

            <button
              type="button"
              onClick={loadMyAssets}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          <div className="border-b border-slate-100 p-5">
            <div className="relative max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, serial number, or category..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-sm text-slate-500">
              <LoaderCircle size={20} className="animate-spin text-blue-600" />
              Loading your assets...
            </div>
          ) : !error ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Asset Name</th>
                    <th className="px-6 py-4 font-semibold">Serial Number</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-500">
                          <Package size={30} className="text-slate-300" />
                          <p className="font-medium">
                            {assets.length === 0
                              ? 'No assets are currently assigned to you.'
                              : 'No matching assets found.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map((asset) => (
                      <tr key={asset.id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {asset.name || '—'}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {asset.serialNumber || '—'}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {asset.categoryName || asset.category?.name || '—'}
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            asset.status === 'AVAILABLE'
                              ? 'bg-green-50 text-green-700'
                              : asset.status === 'ASSIGNED'
                                ? 'bg-blue-50 text-blue-700'
                                : asset.status === 'MAINTENANCE'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                          }`}>
                            {formatStatus(asset.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : null}

          <div className="flex flex-wrap justify-between gap-2 border-t border-slate-100 px-6 py-4 text-xs text-slate-500">
            <span>Showing {filteredAssets.length} of {assets.length} assigned assets</span>
            {lastUpdated && <span>Last updated: {lastUpdated}</span>}
          </div>
        </section>

        <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
          <CheckCircle2 size={17} className="text-green-600" />
          Your assigned equipment is retrieved securely from your account.
        </div>
      </main>
    </div>
  )
}

export default MyAssets