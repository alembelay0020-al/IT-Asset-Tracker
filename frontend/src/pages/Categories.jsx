import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tags,
  UserRound,
  LogOut,
  Plus,
  Search,
  FolderOpen,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

const API_URL = 'http://localhost:8080/api'

function Categories() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [categories, setCategories] = useState([])
  const [role, setRole] = useState('User')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [search, setSearch] = useState('')
  const [submitting, setSubmitting] = useState(false)

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

  async function loadCategories() {
    if (!token) return

    try {
      setLoading(true)

      const response = await axios.get(`${API_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setCategories(Array.isArray(response.data) ? response.data : [])
      setError('')
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/login', { replace: true })
        return
      }

      setError(err.response?.data?.message || 'Could not load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) loadCategories()
  }, [token])

  async function addCategory(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (role !== 'ADMIN') {
      setError('Only administrators can add categories.')
      return
    }

    if (!name.trim()) {
      setError('Please enter a category name.')
      return
    }

    try {
      setSubmitting(true)

      await axios.post(
        `${API_URL}/categories`,
        { name: name.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setName('')
      setMessage('Category added successfully.')
      await loadCategories()
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not add category. Check the category name.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  function logout() {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name?.toLowerCase().includes(search.toLowerCase())
    )
  }, [categories, search])

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

          <Link to="/categories" className="flex items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
            <Tags size={18} />
            Categories
          </Link>

          <Link to="/my-assets" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
            <UserRound size={18} />
            My Assets
          </Link>
        </nav>

        <div className="hidden border-t border-white/10 p-4 md:block">
          <button
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
            <p className="mb-1 text-sm font-medium text-blue-600">Inventory management</p>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="mt-2 text-sm text-slate-500">
              Organize and manage your organization's IT equipment categories.
            </p>
          </div>

          <span className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {role}
          </span>
        </header>

        {error && (
          <div role="alert" className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {message && (
          <div role="status" className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle2 size={20} />
            {message}
          </div>
        )}

        {role === 'ADMIN' && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Plus size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold">Add New Category</h2>
                <p className="text-sm text-slate-500">
                  Create a category for your IT equipment.
                </p>
              </div>
            </div>

            <form onSubmit={addCategory} className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <label htmlFor="categoryName" className="mb-2 block text-sm font-medium text-slate-700">
                  Category name
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Monitors"
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="sm:self-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {submitting ? <LoaderCircle size={18} className="animate-spin" /> : <Plus size={18} />}
                  {submitting ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
            <div>
              <h2 className="text-lg font-bold">Equipment Categories</h2>
              <p className="mt-1 text-sm text-slate-500">
                Categories retrieved from your database.
              </p>
            </div>

            <div className="flex h-12 min-w-28 items-center gap-3 rounded-xl bg-blue-50 px-4">
              <FolderOpen size={20} className="text-blue-600" />
              <div>
                <p className="text-xl font-bold text-slate-900">{categories.length}</p>
                <p className="text-xs text-slate-500">Total categories</p>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-100 p-5">
            <div className="relative max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search categories..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-12 text-sm text-slate-500">
              <LoaderCircle size={20} className="animate-spin text-blue-600" />
              Loading categories...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Category Name</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="px-6 py-12 text-center text-slate-500">
                        {categories.length === 0 ? 'No categories found.' : 'No matching categories found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((category) => (
                      <tr key={category.id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-500">{category.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3 font-semibold text-slate-800">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                              <Tags size={17} />
                            </div>
                            {category.name}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-slate-100 px-6 py-4 text-xs text-slate-500">
            Showing {filteredCategories.length} of {categories.length} categories
          </div>
        </section>
      </main>
    </div>
  )
}

export default Categories