import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { notify } from '../components/Notification';

function Insights() {
  const { user, backendUrl } = useContext(AuthContext);
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [qualityScore, setQualityScore] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loadingScore, setLoadingScore] = useState(false);
  const [loadingBoard, setLoadingBoard] = useState(false);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchQualityScore = async () => {
    setLoadingScore(true);
    try {
      const response = await axios.get(`${backendUrl}/api/quality-score/${date}`, authHeader);
      setQualityScore(response.data);
    } catch (err) {
      notify(err.response?.data?.message || 'Could not load quality score', 'error');
    } finally {
      setLoadingScore(false);
    }
  };

  const fetchLeaderboard = async () => {
    setLoadingBoard(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/leaderboard/meals?month=${month}&year=${year}`,
        authHeader
      );
      setLeaderboard(response.data);
    } catch (err) {
      notify(err.response?.data?.message || 'Could not load leaderboard', 'error');
    } finally {
      setLoadingBoard(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-8">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-zinc-50">Insights</h1>
        <button
          onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/mess-manager')}
          className="text-sm text-zinc-400 hover:underline"
        >
          ← Back
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 max-w-5xl">
        {/* Daily Quality Score */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 sm:p-6">
          <h2 className="font-semibold text-zinc-50 mb-3">Daily Quality Score</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
            />
            <button
              onClick={fetchQualityScore}
              disabled={loadingScore}
              className="bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-zinc-950 text-sm font-medium px-3 py-2 rounded-lg transition"
            >
              {loadingScore ? '...' : 'Check'}
            </button>
          </div>

          {qualityScore && (
            <div>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-amber-400">{qualityScore.qualityScore}</p>
                <p className="text-xs text-zinc-500">out of 100</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm mb-3">
                <div>
                  <p className="text-zinc-500 text-xs">Avg Rating</p>
                  <p className="text-zinc-100">{qualityScore.overallAverageStars} ★</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs">Complaints</p>
                  <p className="text-zinc-100">{qualityScore.complaintCount}</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs">Resolved</p>
                  <p className="text-zinc-100">{qualityScore.resolutionRate}%</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 sm:p-6">
          <h2 className="font-semibold text-zinc-50 mb-3">Monthly Leaderboard</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              min={1}
              max={12}
              placeholder="Month"
              className="w-20 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
            />
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
              className="w-24 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100"
            />
            <button
              onClick={fetchLeaderboard}
              disabled={loadingBoard}
              className="bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-zinc-950 text-sm font-medium px-3 py-2 rounded-lg transition"
            >
              {loadingBoard ? '...' : 'Check'}
            </button>
          </div>

          {leaderboard && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-emerald-400 font-medium mb-1">Best rated</p>
                {leaderboard.bestMeals.map((m, i) => (
                  <div key={i} className="text-sm text-zinc-300 flex justify-between">
                    <span className="capitalize">{m.mealType} · {new Date(m.date).toLocaleDateString()}</span>
                    <span className="text-amber-400">{m.averageStars} ★</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-red-400 font-medium mb-1">Worst rated</p>
                {leaderboard.worstMeals.map((m, i) => (
                  <div key={i} className="text-sm text-zinc-300 flex justify-between">
                    <span className="capitalize">{m.mealType} · {new Date(m.date).toLocaleDateString()}</span>
                    <span className="text-amber-400">{m.averageStars} ★</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Insights;