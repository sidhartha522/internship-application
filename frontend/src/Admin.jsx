import { useState, useEffect } from 'react'
import axios from 'axios'

function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'))
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('applications')

  // Applications State
  const [applications, setApplications] = useState([])
  const [filteredApps, setFilteredApps] = useState([])
  const [appLoading, setAppLoading] = useState(true)
  const [appError, setAppError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState('')
  const [selectedApp, setSelectedApp] = useState(null)
  const [sortBy, setSortBy] = useState('newest')

  // Roles State
  const [roles, setRoles] = useState([])
  const [rolesLoading, setRolesLoading] = useState(false)
  const [rolesError, setRolesError] = useState(null)
  const [roleForm, setRoleForm] = useState(null) // null = closed, object = open
  const [isSavingRole, setIsSavingRole] = useState(false)

  // Auth Effect
  useEffect(() => {
    if (token) verifyToken()
    else { window.location.href = '/admin/login' }
  }, [])

  // Data Loading Effects
  useEffect(() => {
    if (authenticated) {
      if (activeTab === 'applications') loadApplications()
      if (activeTab === 'roles') loadRoles()
    }
  }, [authenticated, activeTab])

  // Applications Filter Effect
  useEffect(() => { filterApplications() }, [searchTerm, positionFilter, applications, sortBy])

  // --- Authentication ---
  const verifyToken = async () => {
    try {
      // Just check if we can fetch applications to verify token
      await axios.get('/api/applications', { headers: { Authorization: `Bearer ${token}` } })
      setAuthenticated(true)
    } catch {
      localStorage.removeItem('adminToken')
      setToken(null)
      window.location.href = '/admin/login'
    } finally {
      setAppLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
    setAuthenticated(false)
    window.location.href = '/admin/login'
  }

  // --- Applications Logic ---
  const loadApplications = async () => {
    setAppLoading(true)
    setAppError(null)
    try {
      const response = await axios.get('/api/applications', { headers: { Authorization: `Bearer ${token}` } })
      setApplications(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      if (err.response?.status === 401) handleLogout()
      else setAppError(err.response?.data?.error || 'Failed to load applications')
    } finally {
      setAppLoading(false)
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

  const appStats = {
    total: applications.length,
    today: applications.filter(app => new Date(app.timestamp).toDateString() === new Date().toDateString()).length,
    withResumes: applications.filter(app => app.resume).length
  }

  const uniquePositions = [...new Set(applications.map(app => app.position).filter(Boolean))]

  // --- Roles Logic ---
  const loadRoles = async () => {
    setRolesLoading(true)
    setRolesError(null)
    try {
      // Roles are public GET, but we can assume we want to ensure we're connected
      const response = await axios.get('/api/positions')
      setRoles(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      setRolesError('Failed to load roles')
    } finally {
      setRolesLoading(false)
    }
  }

  const handleEditRole = (role) => {
    setRoleForm({
      ...role,
      tags: Array.isArray(role.tags) ? role.tags.join(', ') : '',
      responsibilities: Array.isArray(role.responsibilities) ? role.responsibilities.join('\n') : '',
      requirements: Array.isArray(role.requirements) ? role.requirements.join('\n') : '',
      preferred: Array.isArray(role.preferred) ? role.preferred.join('\n') : '',
      customApplyUrl: role.customApplyUrl || ''
    })
  }

  const handleNewRole = () => {
    setRoleForm({
      title: '', slug: '', type: 'Internship', location: 'Remote', duration: '2 months', commitment: '15-20 hrs/week',
      description: '', tags: '', featured: false, introduction: '',
      responsibilities: '', requirements: '', preferred: '', customApplyUrl: ''
    })
  }

  const handleDeleteRole = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return
    try {
      await axios.delete(`/api/positions/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      loadRoles()
    } catch (err) {
      alert('Failed to delete role')
    }
  }

  const handleRoleSubmit = async (e) => {
    e.preventDefault()
    setIsSavingRole(true)

    // Process form data back to array format
    const payload = {
      ...roleForm,
      tags: roleForm.tags.split(',').map(s => s.trim()).filter(Boolean),
      responsibilities: roleForm.responsibilities.split('\n').filter(Boolean),
      requirements: roleForm.requirements.split('\n').filter(Boolean),
      preferred: roleForm.preferred.split('\n').filter(Boolean)
    }

    try {
      if (roleForm.id) {
        // Update
        await axios.put(`/api/positions/${roleForm.id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
      } else {
        // Create
        await axios.post('/api/positions', payload, { headers: { Authorization: `Bearer ${token}` } })
      }
      setRoleForm(null)
      loadRoles()
    } catch (err) {
      alert('Failed to save role: ' + (err.response?.data?.error || err.message))
    } finally {
      setIsSavingRole(false)
    }
  }

  if (!authenticated) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Checking access...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl font-bold text-brand-dark">ekthaa</span>
              <span className="bg-brand-teal text-white text-xs font-semibold px-2.5 py-1 uppercase tracking-wide">Admin</span>
            </div>
            <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('applications')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'applications' ? 'bg-white text-brand-teal shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Applications
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'roles' ? 'bg-white text-brand-teal shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Manage Roles
              </button>
            </nav>
          </div>
          <div className="flex gap-3">
            <button onClick={handleLogout} className="px-4 py-2 bg-gray-600 text-white text-sm font-semibold hover:bg-gray-700">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* --- Applications Tab --- */}
        {activeTab === 'applications' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[{ label: 'Total Applications', value: appStats.total }, { label: 'Today', value: appStats.today }, { label: 'With Resume', value: appStats.withResumes }].map(stat => (
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
                  {uniquePositions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                </select>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name (A-Z)</option>
                </select>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Showing <span className="font-semibold text-brand-dark mx-1">{filteredApps.length}</span></span>
                  <button onClick={exportToCSV} disabled={applications.length === 0} className="text-brand-teal hover:underline font-medium disabled:opacity-50">Export CSV</button>
                </div>
              </div>
            </div>

            {/* Error */}
            {appError && <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6">{appError}</div>}

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
                  {appLoading ? (
                    <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">Loading applications...</td></tr>
                  ) : filteredApps.length === 0 ? (
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
          </>
        )}

        {/* --- Roles Tab --- */}
        {activeTab === 'roles' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-brand-dark">Manage Internship Positions</h2>
              <button onClick={handleNewRole} className="bg-brand-teal text-white px-4 py-2 font-semibold hover:bg-teal-600">+ Add New Role</button>
            </div>

            {rolesError && <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-6">{rolesError}</div>}

            <div className="grid gap-6">
              {rolesLoading ? (
                <div className="text-center py-12 text-gray-500">Loading roles...</div>
              ) : roles.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white border border-gray-200">No roles found. Create one!</div>
              ) : (
                roles.map(role => (
                  <div key={role.id} className="bg-white border border-gray-200 p-6 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-brand-dark">{role.title}</h3>
                        {role.featured && <span className="bg-brand-teal text-white text-[10px] font-bold px-2 py-0.5 uppercase">Featured</span>}
                        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5">{role.type}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{role.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(role.tags || []).map((tag, i) => <span key={i} className="bg-gray-50 text-gray-500 text-xs px-2 py-1">{tag}</span>)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {role.location} • {role.duration} • {role.commitment}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <button onClick={() => handleEditRole(role)} className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50">Edit</button>
                      <button onClick={() => handleDeleteRole(role.id)} className="px-3 py-1.5 border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* --- Detail Modal (Application) --- */}
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
          </div>
        </div>
      )}

      {/* --- Role Form Modal --- */}
      {roleForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-brand-dark">{roleForm.id ? 'Edit Role' : 'Create New Role'}</h2>
              <button onClick={() => setRoleForm(null)} className="text-gray-400 hover:text-gray-600 text-2xl">x</button>
            </div>
            <form onSubmit={handleRoleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label><input type="text" required value={roleForm.title} onChange={e => setRoleForm({ ...roleForm, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-brand-teal" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">URL Slug (e.g., frontend-intern)</label><input type="text" required value={roleForm.slug} onChange={e => setRoleForm({ ...roleForm, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-brand-teal" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><input type="text" required value={roleForm.type} onChange={e => setRoleForm({ ...roleForm, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-brand-teal" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" required value={roleForm.location} onChange={e => setRoleForm({ ...roleForm, location: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-brand-teal" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration</label><input type="text" required value={roleForm.duration} onChange={e => setRoleForm({ ...roleForm, duration: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-brand-teal" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Commitment</label><input type="text" required value={roleForm.commitment} onChange={e => setRoleForm({ ...roleForm, commitment: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-brand-teal" /></div>
              </div>

              <div><label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label><textarea required value={roleForm.description} onChange={e => setRoleForm({ ...roleForm, description: e.target.value })} rows="2" className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-brand-teal"></textarea></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Introduction (Full Text)</label><textarea required value={roleForm.introduction} onChange={e => setRoleForm({ ...roleForm, introduction: e.target.value })} rows="4" className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-brand-teal"></textarea></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities (One per line)</label><textarea required value={roleForm.responsibilities} onChange={e => setRoleForm({ ...roleForm, responsibilities: e.target.value })} rows="5" className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-brand-teal"></textarea></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Requirements (One per line)</label><textarea required value={roleForm.requirements} onChange={e => setRoleForm({ ...roleForm, requirements: e.target.value })} rows="5" className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-brand-teal"></textarea></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Preferred Skills (One per line)</label><textarea value={roleForm.preferred} onChange={e => setRoleForm({ ...roleForm, preferred: e.target.value })} rows="5" className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-brand-teal"></textarea></div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Comma separated)</label>
                  <input type="text" value={roleForm.tags} onChange={e => setRoleForm({ ...roleForm, tags: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-brand-teal mb-4" />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={roleForm.featured} onChange={e => setRoleForm({ ...roleForm, featured: e.target.checked })} className="w-5 h-5 accent-brand-teal" />
                    <span className="text-sm font-medium text-brand-dark">Featured Position</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Apply Now URL (Optional)</label>
                <input 
                  type="url" 
                  value={roleForm.customApplyUrl || ''} 
                  onChange={e => setRoleForm({ ...roleForm, customApplyUrl: e.target.value })} 
                  placeholder="https://docs.google.com/forms/..." 
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-brand-teal" 
                />
                <p className="text-xs text-gray-500 mt-1">If provided, "Apply Now" button will redirect to this URL instead of the internal form</p>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button type="button" onClick={() => setRoleForm(null)} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSavingRole} className="px-6 py-2.5 bg-brand-teal text-white font-semibold hover:bg-teal-600 disabled:opacity-50">{isSavingRole ? 'Saving...' : 'Save Role'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
