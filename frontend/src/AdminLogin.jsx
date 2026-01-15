import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/admin/login', { username, password })
      localStorage.setItem('adminToken', response.data.token)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-brand-dark">ekthaa</h1>
          <p className="text-gray-500 mt-2">Admin Dashboard</p>
        </div>

        <div className="bg-white border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-brand-dark mb-6">Sign In</h2>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-teal text-white py-3 font-semibold hover:bg-teal-600 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-brand-teal text-sm hover:underline">Back to Careers</a>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
