import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { notify } from '../components/Notification';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login,backendUrl } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
  const response = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
  console.log('LOGIN RESPONSE:', response.data); // temporary

  login(response.data);

  if (response.data.role === 'admin') navigate('/admin');
  else if (response.data.role === 'mess_manager') navigate('/mess-manager');
  else navigate('/student');
} catch (err) {
  console.log('LOGIN ERROR:', err); // temporary
  notify(err.response?.data?.message || 'Something went wrong. Please try again.', 'error');
} finally {
  setLoading(false);
}
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
    <div className="w-full max-w-sm bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 p-8">
      <h1 className="text-2xl font-bold text-zinc-50 mb-1">Hostel Food Tracker</h1>
      <p className="text-zinc-400 text-sm mb-6">Log in to rate meals, view the menu, and more.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-zinc-950 font-medium py-2 rounded-lg transition"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="text-sm text-zinc-400 mt-6 text-center">
        Don't have an account?{' '}
        <a href="/register" className="text-amber-400 font-medium hover:underline">Register</a>
      </p>
    </div>
  </div>
);
}

export default Login;