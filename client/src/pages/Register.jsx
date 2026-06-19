import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { notify } from '../components/Notification';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    hostelBlock: '',
    roomNumber: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const { login, backendUrl } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/auth/register`, formData);
      login(response.data);
      notify('Account created successfully', 'success');
      navigate('/student'); // self-registration always creates a student
    } catch (err) {
      notify(err.response?.data?.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-10">
    <div className="w-full max-w-sm bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 p-8">
      <h1 className="text-2xl font-bold text-zinc-50 mb-1">Create your account</h1>
      <p className="text-zinc-400 text-sm mb-6">Register as a student to rate meals and submit feedback.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Full name</label>
          <input name="name" value={formData.name} onChange={handleChange} required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Hostel block</label>
            <input name="hostelBlock" value={formData.hostelBlock} onChange={handleChange}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Room no.</label>
            <input name="roomNumber" value={formData.roomNumber} onChange={handleChange}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-zinc-950 font-medium py-2 rounded-lg transition">
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="text-sm text-zinc-400 mt-6 text-center">
        Already have an account?{' '}
        <a href="/login" className="text-amber-400 font-medium hover:underline">Log in</a>
      </p>
    </div>
  </div>
);
}

export default Register;