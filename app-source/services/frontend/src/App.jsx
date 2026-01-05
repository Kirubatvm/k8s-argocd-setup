import { useState, useEffect } from 'react'

function App() {
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Use relative URL - Nginx will proxy to backend
  const API_URL = '/api'  // Changed from http://localhost:5000/api

  // Rest of your code stays the same...
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setError(null)
      const response = await fetch(`${API_URL}/users`)
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to load users')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      })
      
      if (!response.ok) throw new Error('Failed to add user')
      
      setName('')
      setEmail('')
      fetchUsers()
    } catch (error) {
      console.error('Error adding user:', error)
      setError('Failed to add user')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      setError(null)
      const response = await fetch(`${API_URL}/users/${id}`, { 
        method: 'DELETE' 
      })
      if (!response.ok) throw new Error('Failed to delete user')
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      setError('Failed to delete user')
    }
  }

  return (
    <div className="container">
      <h1>🚀 User Management</h1>
      
      {error && <div className="error-banner">{error}</div>}
      
      <div className="form-card">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </form>
      </div>

      <div className="users-list">
        <h2>Users List ({users.length})</h2>
        {users.length === 0 ? (
          <p className="empty-state">No users yet. Add one above!</p>
        ) : (
          users.map(user => (
            <div key={user._id} className="user-card">
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <small>{new Date(user.createdAt).toLocaleDateString()}</small>
              </div>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(user._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
