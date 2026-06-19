import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { notify } from '../../components/Notification';

function AdminUsers() {
  const { backendUrl } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'mess_manager',
    assignedMess: '',
  });
  const [creating, setCreating] = useState(false);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = async () => {
    try {
      const url = roleFilter
        ? `${backendUrl}/api/admin/users?role=${roleFilter}`
        : `${backendUrl}/api/admin/users`;
      const response = await axios.get(url, authHeader);
      setUsers(response.data);
    } catch (err) {
      notify(err.response?.data?.message || 'Could not load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await axios.post(`${backendUrl}/api/admin/users`, formData, authHeader);
      notify('User created', 'success');
      setFormData({ name: '', email: '', password: '', role: 'mess_manager', assignedMess: '' });
      fetchUsers();
    } catch (err) {
      notify(err.response?.data?.message || 'Could not create user', 'error');
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await axios.put(`${backendUrl}/api/admin/users/${id}/status`, { isActive: !isActive }, authHeader);
      fetchUsers();
    } catch (err) {
      notify(err.response?.data?.message || 'Could not update user', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/admin/users/${id}`, authHeader);
      notify('User deleted', 'success');
      fetchUsers();
    } catch (err) {
      notify(err.response?.data?.message || 'Could not delete user', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-8">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-zinc-50">Manage Users</h1>
        <button onClick={() => navigate('/admin')} className="text-sm text-zinc-400 hover:underline">
          ← Back to dashboard
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 max-w-5xl">
        {/* Create user form */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 sm:p-6 h-fit">
          <h2 className="font-semibold text-zinc-50 mb-3">Create a new account</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <input
              type="password"
              placeholder="Temporary password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="mess_manager">Mess Manager</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
            {formData.role === 'mess_manager' && (
              <input
                placeholder="Assigned mess (e.g. Block A Mess)"
                value={formData.assignedMess}
                onChange={(e) => setFormData({ ...formData, assignedMess: e.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            )}
            <button
              type="submit"
              disabled={creating}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-zinc-950 font-medium py-2 rounded-lg transition"
            >
              {creating ? 'Creating...' : 'Create account'}
            </button>
          </form>
        </div>

        {/* User list */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 sm:p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-zinc-50">All users</h2>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1 text-sm text-zinc-100"
            >
              <option value="">All roles</option>
              <option value="student">Students</option>
              <option value="mess_manager">Mess Managers</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {loading ? (
            <p className="text-zinc-400 text-sm">Loading...</p>
          ) : (
            <div className="space-y-2 max-h-[28rem] overflow-y-auto">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="flex flex-wrap justify-between items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2"
                >
                  <div>
                    <p className="text-sm text-zinc-100">{u.name} <span className="text-zinc-500">({u.role})</span></p>
                    <p className="text-xs text-zinc-500">{u.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleActive(u._id, u.isActive)}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        u.isActive ? 'bg-emerald-400 text-zinc-950' : 'bg-zinc-600 text-zinc-200'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;