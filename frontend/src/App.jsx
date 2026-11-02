import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Monitor,
  FolderOpen,
  Laptop,
  LogOut,
  Package,
  CheckCircle,
  UserCheck,
  Wrench,
  ArrowUpRight,
  Search,
  Bell,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import './App.css'

const API_URL = 'http://localhost:8080/api'

function App() {
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [role, setRole] = useState('User')
  const [username, setUsername] = useState('User')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    async function loadDashboard() {
      try {
        const response = await axios.get(`${API_URL}/assets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const assetList = Array.isArray(response.data)
          ? response.data
          : response.data?.content || []

        setAssets(assetList)

        const payload = JSON.parse(atob(token.split('.')[1]))
        const userRole = payload.roles?.[0] || 'User'

        setRole(String(userRole).replace('ROLE_', ''))
        setUsername(payload.sub || payload.username || 'User')
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          navigate('/login', { replace: true })
          return
        }

        setError(
          err.response?.data?.message ||
          'Could not load dashboard information.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [navigate])

  const available = assets.filter(
    (asset) => asset.status === 'AVAILABLE'
  ).length

  const assigned = assets.filter(
    (asset) => asset.status === 'ASSIGNED'
  ).length

  const maintenance = assets.filter(
    (asset) => asset.status === 'MAINTENANCE'
  ).length

  const recentAssets = [...assets]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5)

  function formatStatus(status) {
    if (!status) return 'Unknown'
    return status.charAt(0) + status.slice(1).toLowerCase()
  }

  function logout() {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  const statistics = [
    {
      title: 'Total Assets',
      value: assets.length,
      description: 'All registered equipment',
      icon: Package,
      color: 'blue',
    },
    {
      title: 'Available',
      value: available,
      description: 'Ready for assignment',
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Assigned',
      value: assigned,
      description: 'Currently in use',
      icon: UserCheck,
      color: 'purple',
    },
    {
      title: 'Maintenance',
      value: maintenance,
      description: 'Under maintenance',
      icon: Wrench,
      color: 'orange',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">

      {/* Sidebar */}
      <aside className="flex w-full flex-col border-r border-slate-200 bg-white md:fixed md:inset-y-0 md:w-64">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <Monitor size={23} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              AssetTrack
            </h2>
            <p className="text-xs text-slate-500">
              IT Management System
            </p>
          </div>
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-3 font-semibold text-blue-700"
            >
              <LayoutDashboard size={19} />
              Dashboard
            </Link>

            <Link
              to="/assets"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Laptop size={19} />
              Assets
              <ChevronRight className="ml-auto" size={16} />
            </Link>

            <Link
              to="/categories"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <FolderOpen size={19} />
              Categories
              <ChevronRight className="ml-auto" size={16} />
            </Link>

            <Link
              to="/my-assets"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Monitor size={19} />
              My Assets
              <ChevronRight className="ml-auto" size={16} />
            </Link>
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-100 p-4">
          <div className="mb-4 rounded-xl bg-slate-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-700">
              <ShieldCheck size={18} className="text-blue-600" />
              <span className="text-sm font-semibold">
                Secure Workspace
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Your equipment management workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={19} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 p-5 md:ml-64 md:p-8 lg:p-10">

        {/* Top bar */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-medium text-slate-500">
              IT Asset Management / Overview
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 sm:flex">
              <Search size={17} />
              Asset Management
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
            >
              <Bell size={19} />
            </button>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="max-w-32 truncate text-sm font-semibold text-slate-800">
                  {username}
                </p>
                <p className="text-xs text-slate-500">{role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Welcome panel */}
        <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-7 text-white shadow-lg shadow-blue-100 md:p-9">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="mb-2 text-sm font-medium text-blue-100">
                YOUR WORKSPACE
              </p>
              <h2 className="mb-3 text-2xl font-bold md:text-3xl">
                Welcome back, {username}!
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-blue-100 md:text-base">
                Manage your organization's IT equipment, monitor asset
                availability, and keep everything organized in one place.
              </p>
              <Link
                to="/assets"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                Explore Assets
                <ArrowUpRight size={17} />
              </Link>
            </div>

            <div className="hidden h-28 w-28 items-center justify-center rounded-3xl border border-white/20 bg-white/10 md:flex">
              <Monitor size={65} strokeWidth={1.3} />
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="mb-9">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Asset Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Current status of your registered equipment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statistics.map((item) => {
              const Icon = item.icon

              const colorClasses = {
                blue: 'bg-blue-50 text-blue-600',
                green: 'bg-emerald-50 text-emerald-600',
                purple: 'bg-violet-50 text-violet-600',
                orange: 'bg-orange-50 text-orange-600',
              }

              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorClasses[item.color]}`}>
                      <Icon size={22} />
                    </div>
                    <ArrowUpRight size={18} className="text-slate-300" />
                  </div>

                  <p className="text-sm font-medium text-slate-500">
                    {item.title}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    {loading ? '...' : item.value}
                  </h3>

                  <p className="mt-2 text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Quick actions */}
        <section className="mb-9">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Access your main equipment management tools.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link
              to="/assets"
              className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Laptop size={23} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-800">
                  Manage Assets
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  View and manage equipment
                </p>
              </div>
              <ArrowUpRight size={18} className="text-slate-400 transition group-hover:text-blue-600" />
            </Link>

            <Link
              to="/categories"
              className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <FolderOpen size={23} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-800">
                  Categories
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Organize equipment types
                </p>
              </div>
              <ArrowUpRight size={18} className="text-slate-400 transition group-hover:text-blue-600" />
            </Link>

            <Link
              to="/my-assets"
              className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Monitor size={23} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-800">
                  My Assets
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  View assigned equipment
                </p>
              </div>
              <ArrowUpRight size={18} className="text-slate-400 transition group-hover:text-blue-600" />
            </Link>
          </div>
        </section>

        {/* Recent assets */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5 md:p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Assets
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest equipment registered in your database.
              </p>
            </div>

            <Link
              to="/assets"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View All Assets
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {loading && (
            <p className="p-6 text-sm text-slate-500">
              Loading assets...
            </p>
          )}

          {!loading && !error && (
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
                  {recentAssets.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-10 text-center text-slate-500"
                      >
                        No assets found.
                      </td>
                    </tr>
                  ) : (
                    recentAssets.map((asset) => (
                      <tr
                        key={asset.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">
                          {asset.name || '—'}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                          {asset.serialNumber || '—'}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                          {asset.categoryName || '—'}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              asset.status === 'AVAILABLE'
                                ? 'bg-emerald-50 text-emerald-700'
                                : asset.status === 'ASSIGNED'
                                  ? 'bg-blue-50 text-blue-700'
                                  : asset.status === 'MAINTENANCE'
                                    ? 'bg-orange-50 text-orange-700'
                                    : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {formatStatus(asset.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-slate-100 px-6 py-4">
            <p className="text-xs text-slate-400">
              Showing the latest {recentAssets.length} registered assets.
            </p>
          </div>
        </section>

        <footer className="mt-8 text-center text-xs text-slate-400">
          IT Asset Tracker · Equipment Management System
        </footer>
      </main>
    </div>
  )
}

export default App