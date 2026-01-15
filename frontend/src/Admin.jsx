import { useState, useEffect } from 'react'
import axios from 'axios'

function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'))
  const [authenticated, setAuthenticated] = useState(false)
  const [applications, setApplications] = useState([])
  const [filteredApps, setFilteredApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    if (token) verifyToken()
    else { setLoading(false); window.location.href = '/admin/login' }
  }, [])

  useEffect(() => { if (authenticated) loadApplications() }, [authenticated])
  useEffect(() => { filterApplications() }, [searchTerm, positionFilter, applications, sortBy])

  const verifyToken = async () => {
    try {
      const response = await axios.get('/api/applications', { headers: { Authorization: `Bearer ${token}` } })
      setAuthenticated(true)
      setApplications(response.data)
    } catch {
      localStorage.removeItem('adminToken')
      setToken(null)
      navigate('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
    setAuthenticated(false)
    navigate('/admin/login')
  }

  const loadApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get('/api/applications', { headers: { Authorization: `Bearer ${token}` } })
      setApplications(response.data)
    } catch (err) {
      if (err.response?.status === 401) handleLogout()
      else setError(err.response?.data?.error || 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = [...applications]
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(app =>
        `${app.firstName} ${app.lastName}`.toLowerCase().includes(search) ||
        app.email?.toLowerCase().includes(search) ||
        app.position?.toLowerCase().includes(search)
      )
    }
    if (positionFilter) filtered = filtered.filter(app => app.position === positionFilter)
    filtered.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.timestamp) - new Date(a.timestamp)
      if (sortBy === 'oldest') return new Date(a.timestamp) - new Date(b.timestamp)
      if (sortBy === 'name') return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      return 0
    })
    setFilteredApps(filtered)
  }

  const exportToCSV = () => {
    if (applications.length === 0) return
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'LinkedIn', 'GitHub', 'Position', 'Skill Level', 'Availability', 'Why Join', 'Resume', 'Timestamp']
    const rows = applications.map(app => [app.firstName, app.lastName, app.email, app.phone, app.linkedin, app.github, app.position, app.skillLevel, app.availability, app.whyJoin, app.resume, app.timestamp])
    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `applications-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const stats = {
    total: applications.length,
    today: applications.filter(app => new Date(app.timestamp).toDateString() === new Date().toDateString()).length,
    withResumes: applications.filter(app => app.resume).length
  }

  const positions = [...new Set(applications.map(app => app.position).filter(Boolean))]

  if (loading) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-2xl font-bold text-brand-dark">ekthaa</span>
            <span className="bg-brand-teal text-white text-xs font-semibold px-2.5 py-1 uppercase tracking-wide">Admin</span>
          </div>
          <div className="flex gap-3">
            <button onClick={loadApplications} className="px-4 py-2 bg-brand-teal text-white text-sm font-semibold hover:bg-teal-600">Refresh</button>
            <button onClick={exportToCSV} disabled={applications.length === 0} className="px-4 py-2 bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50">Export CSV</button>
            <button onClick={handleLogout} className="px-4 py-2 bg-gray-600 text-white text-sm font-semibold hover:bg-gray-700">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[{ label: 'Total Applications', value: stats.total }, { label: 'Today', value: stats.today }, { label: 'With Resume', value: stats.withResumes }].map(stat => (
            <div key={stat.label} className="bg-white border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-brand-teal mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by name, email, position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
            <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)} className="px-4 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal">
              <option value="">All Positions</option>
              {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
            <div className="flex items-center text-sm text-gray-500">
              Showing <span className="font-semibold text-brand-dark mx-1">{filteredApps.length}</span> of <span className="font-semibold text-brand-dark mx-1">{applications.length}</span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6">{error}</div>}

        {/* Applications Table */}
        <div className="bg-white border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Applicant</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Position</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Skill</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Resume</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No applications found</td></tr>
              ) : (
                filteredApps.map((app, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedApp(app)}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-dark">{app.firstName} {app.lastName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{app.position}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{app.email}</div>
                      <div className="text-xs text-gray-400">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-brand-teal text-white text-xs font-semibold px-2 py-1">{app.skillLevel}/5</span>
                    </td>
                    <td className="px-6 py-4">
                      {app.resume ? (
                        <a href={app.resume} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-brand-teal text-sm font-medium hover:underline">View</a>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(app.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedApp(null)}>
          <div className="bg-white border border-gray-200 p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-brand-dark">{selectedApp.firstName} {selectedApp.lastName}</h2>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600 text-2xl">x</button>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              {[
                { label: 'Email', value: selectedApp.email },
                { label: 'Phone', value: selectedApp.phone },
                { label: 'LinkedIn', value: selectedApp.linkedin, link: true },
                { label: 'GitHub', value: selectedApp.github, link: true },
                { label: 'Position', value: selectedApp.position },
                { label: 'Skill Level', value: `${selectedApp.skillLevel}/5` },
                { label: 'Availability', value: selectedApp.availability },
                { label: 'Start Date', value: selectedApp.startDate },
              ].filter(f => f.value).map(field => (
                <div key={field.label}>
                  <div className="text-sm text-gray-500 mb-1">{field.label}</div>
                  {field.link ? (
                    <a href={field.value} target="_blank" rel="noopener noreferrer" className="text-brand-teal hover:underline">{field.value}</a>
                  ) : (
                    <div className="font-medium text-brand-dark">{field.value}</div>
                  )}
                </div>
              ))}
            </div>
            {selectedApp.whyJoin && (
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">Why should we select you?</div>
                <div className="bg-gray-50 border border-gray-200 p-4 text-gray-700">{selectedApp.whyJoin}</div>
              </div>
            )}
            {selectedApp.resume && (
              <a href={selectedApp.resume} target="_blank" rel="noopener noreferrer" className="inline-block bg-brand-teal text-white px-6 py-3 font-semibold hover:bg-teal-600">View Resume</a>
            )}
            <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
              Submitted: {new Date(selectedApp.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
