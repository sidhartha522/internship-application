import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  RefreshCw, Download, LogOut, Search, Star, Mail, Phone, 
  CheckCircle, Calendar, TrendingUp, Users, FileText,
  Grid3x3, List, ExternalLink 
} from 'lucide-react';
import BackgroundBeams from './components/BackgroundBeams';
import AdminLogin from './AdminLogin';

function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadApplications();
    }
  }, [authenticated]);

  useEffect(() => {
    filterApplications();
  }, [searchTerm, positionFilter, skillFilter, applications, sortBy]);

  const verifyToken = async () => {
    try {
      const response = await axios.get('/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuthenticated(true);
      setApplications(response.data);
    } catch (err) {
      localStorage.removeItem('adminToken');
      setToken(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
    setAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setAuthenticated(false);
    setApplications([]);
  };

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      } else {
        setError(err.response?.data?.error || 'Failed to load applications');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        `${app.firstName} ${app.lastName}`.toLowerCase().includes(search) ||
        app.email?.toLowerCase().includes(search) ||
        app.position?.toLowerCase().includes(search)
      );
    }

    if (positionFilter) {
      filtered = filtered.filter(app => app.position === positionFilter);
    }

    if (skillFilter) {
      filtered = filtered.filter(app => app.skillLevel === skillFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'skill':
          return (b.skillLevel || 0) - (a.skillLevel || 0);
        default:
          return 0;
      }
    });

    setFilteredApps(filtered);
  };

  const exportToCSV = () => {
    if (applications.length === 0) return;

    const headers = [
      'First Name', 'Last Name', 'Email', 'Phone', 'LinkedIn', 'GitHub',
      'Birth Date', 'Position', 'Skill Level', 'Availability', 'Full-Time Commit',
      'Employment Status', 'Why Join', 'Start Date', 'Resume', 'Timestamp'
    ];

    const rows = applications.map(app => [
      app.firstName || '',
      app.lastName || '',
      app.email || '',
      app.phone || '',
      app.linkedin || '',
      app.github || '',
      app.birthDate || '',
      app.position || '',
      app.skillLevel || '',
      app.availability || '',
      app.fullTimeCommit || '',
      Array.isArray(app.employmentStatus) ? app.employmentStatus.join('; ') : app.employmentStatus || '',
      app.whyJoin || '',
      app.startDate || '',
      app.resume || '',
      app.timestamp || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `internship-applications-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const stats = {
    total: applications.length,
    today: applications.filter(app => {
      const appDate = new Date(app.timestamp);
      const today = new Date();
      return appDate.toDateString() === today.toDateString();
    }).length,
    withResumes: applications.filter(app => app.resume).length
  };

  const positions = [...new Set(applications.map(app => app.position).filter(Boolean))];

  // Show login page if not authenticated and not loading
  if (!authenticated && !loading) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Show loading spinner while verifying token
  if (loading && !authenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <BackgroundBeams />
        <div className="relative z-10 text-center">
          <div className="inline-block w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundBeams />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold glow-text">
              <span className="text-accent">Ekthaa</span> Admin Dashboard
            </h1>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadApplications}
                className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-all glow"
              >
                <RefreshCw size={18} />
                Refresh
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToCSV}
                disabled={applications.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                Export CSV
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Total Applications', value: stats.total, Icon: Users },
              { label: 'Today', value: stats.today, Icon: Calendar },
              { label: 'With Resume', value: stats.withResumes, Icon: FileText }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-dark-card border border-dark-border rounded-xl p-6 text-center"
              >
                <div className="flex justify-center mb-3">
                  <stat.Icon size={32} className="text-accent" />
                </div>
                <div className="text-3xl font-bold text-accent mb-1">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Filters and Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">All Positions</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              <select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="px-4 py-3 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">All Skill Levels</option>
                {[1, 2, 3, 4, 5].map(level => (
                  <option key={level} value={level}>Level {level}</option>
                ))}
              </select>
            </div>

            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white text-sm focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="skill">Skill Level</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm font-medium">View:</span>
                <div className="flex bg-dark-card border border-dark-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                      viewMode === 'grid' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid3x3 size={16} />
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                      viewMode === 'list' ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <List size={16} />
                    List
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                Showing <span className="text-white font-semibold">{filteredApps.length}</span> of <span className="text-white font-semibold">{applications.length}</span> applications
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-block w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400 text-lg">Loading applications...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/20 border border-red-500 rounded-xl p-6 text-center"
          >
            <p className="text-red-400 text-lg">❌ {error}</p>
          </motion.div>
        )}

        {/* Applications Grid */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
          >
            {filteredApps.length === 0 ? (
              <div className="col-span-full text-center py-20 text-gray-400 text-lg">
                No applications found
              </div>
            ) : (
              filteredApps.map((app, idx) => (
                <motion.div
                  key={app.timestamp || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  whileHover={{ y: viewMode === 'grid' ? -5 : 0, x: viewMode === 'list' ? 5 : 0 }}
                  onClick={() => setSelectedApp(app)}
                  className={`bg-dark-card border border-dark-border rounded-xl p-6 cursor-pointer hover:border-accent transition-all ${
                    viewMode === 'list' ? 'flex items-center gap-6' : ''
                  }`}
                >
                  <div className={`flex justify-between items-start ${viewMode === 'list' ? 'flex-1' : 'mb-4'}`}>
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <h3 className="text-xl font-bold text-white mb-1">
                        {app.firstName} {app.lastName}
                      </h3>
                      <p className="text-accent text-sm">{app.position}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-accent/20 px-3 py-1 rounded-full shrink-0">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold">{app.skillLevel}</span>
                    </div>
                  </div>

                  <div className={`space-y-2 text-sm ${viewMode === 'list' ? 'flex-1 flex gap-8' : ''}`}>
                    <div className="flex items-start gap-2">
                      <Mail size={16} className="text-gray-400 mt-0.5" />
                      <span className="text-gray-100 break-all">{app.email}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone size={16} className="text-gray-400 mt-0.5" />
                      <span className="text-gray-100">{app.phone}</span>
                    </div>
                    {app.resume && (
                      <div className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-400 mt-0.5" />
                        <span className="text-green-300">Resume uploaded</span>
                      </div>
                    )}
                  </div>

                  <div className={`text-xs text-gray-400 ${
                    viewMode === 'list' ? 'shrink-0 w-40 text-right' : 'mt-4 pt-4 border-t border-dark-border'
                  }`}>
                    {viewMode === 'list' ? new Date(app.timestamp).toLocaleDateString() : new Date(app.timestamp).toLocaleString()}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedApp(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-card border border-dark-border rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-white">
                  {selectedApp.firstName} {selectedApp.lastName}
                </h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400 hover:text-white text-3xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailField label="Email" value={selectedApp.email} />
                <DetailField label="Phone" value={selectedApp.phone} />
                <DetailField label="LinkedIn" value={selectedApp.linkedin} link />
                <DetailField label="GitHub" value={selectedApp.github} link />
                <DetailField label="Birth Date" value={selectedApp.birthDate} />
                <DetailField label="Position" value={selectedApp.position} />
                <DetailField label="Skill Level" value={selectedApp.skillLevel} icon={Star} />
                <DetailField label="Availability" value={`${selectedApp.availability} hrs/week`} />
                <DetailField label="Full-Time Commit" value={selectedApp.fullTimeCommit} />
                <DetailField label="Start Date" value={selectedApp.startDate} />
              </div>

              {selectedApp.employmentStatus && (
                <div className="mt-6">
                  <h3 className="text-accent font-semibold mb-2">Employment Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedApp.employmentStatus) 
                      ? selectedApp.employmentStatus 
                      : [selectedApp.employmentStatus]
                    ).map((status, idx) => (
                      <span key={idx} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedApp.whyJoin && (
                <div className="mt-6 bg-dark/50 rounded-lg p-4 border border-dark-border">
                  <h3 className="text-accent font-semibold mb-3">Why Join Ekthaa?</h3>
                  <p className="text-gray-100 leading-relaxed">{selectedApp.whyJoin}</p>
                </div>
              )}

              {selectedApp.resume && (
                <div className="mt-6">
                  <a
                    href={selectedApp.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-all"
                  >
                    <FileText size={18} />
                    View Resume
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-dark-border text-sm text-gray-400">
                <span className="font-medium">Submitted:</span> {new Date(selectedApp.timestamp).toLocaleString()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailField({ label, value, link, icon: Icon }) {
  if (!value) return null;

  return (
    <div>
      <div className="text-gray-300 text-sm font-medium mb-1">{label}</div>
      {link ? (
        <a
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-accent hover:text-blue-400 hover:underline break-all"
        >
          {value}
          <ExternalLink size={14} />
        </a>
      ) : (
        <div className="flex items-center gap-2 text-gray-100 font-medium">
          {Icon && <Icon size={16} className="text-yellow-400 fill-yellow-400" />}
          {value}
        </div>
      )}
    </div>
  );
}

export default Admin;
