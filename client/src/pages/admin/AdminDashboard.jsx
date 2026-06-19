import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { notify } from '../../components/Notification';

function StatCard({ label, value }) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-zinc-50">{value}</p>
    </div>
  );
}

function AdminDashboard() {
  const { user, logout, backendUrl } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (err) {
        notify(err.response?.data?.message || 'Could not load dashboard', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-8">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-zinc-50">Hi, {user?.name}</h1>
        <div className="flex gap-4 items-center">
          <a href="/admin/users" className="text-sm text-amber-400 font-medium hover:underline">
            Manage users
          </a>
          <a href="/insights" className="text-sm text-amber-400 font-medium hover:underline">Insights</a>
          <button onClick={logout} className="text-sm text-red-400 hover:underline">Log out</button>
        </div>
      </div>

      {loading ? (
        <p className="text-zinc-400">Loading dashboard...</p>
      ) : (
        <div className="space-y-6 max-w-4xl">
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
            <StatCard label="Students" value={stats.totalStudents} />
            <StatCard label="Mess Managers" value={stats.totalMessManagers} />
            <StatCard label="Total Complaints" value={stats.totalComplaints} />
            <StatCard label="Resolution Rate" value={`${stats.resolutionRate}%`} />
            <StatCard label="Pending" value={stats.pendingComplaints} />
            <StatCard label="Resolved" value={stats.resolvedComplaints} />
            <StatCard label="Avg. Rating" value={`${stats.overallAverageRating} ★`} />
            <StatCard label="Total Ratings" value={stats.totalRatingsSubmitted} />
          </div>

          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
            <h2 className="font-semibold text-zinc-50 mb-3">Complaints by category</h2>
            {stats.categoryBreakdown.length === 0 ? (
              <p className="text-zinc-500 text-sm">No complaints yet.</p>
            ) : (
              <div className="space-y-2">
                {stats.categoryBreakdown.map((cat) => (
                  <div key={cat._id} className="flex items-center gap-3">
                    <span className="w-24 text-sm text-zinc-300 capitalize">{cat._id}</span>
                    <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-500 h-2"
                        style={{ width: `${(cat.count / stats.totalComplaints) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-zinc-400 w-8 text-right">{cat.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;