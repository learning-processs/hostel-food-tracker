import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { notify } from '../../components/Notification';

const statusColors = {
  pending: 'bg-amber-400 text-zinc-950',
  in_progress: 'bg-blue-400 text-zinc-950',
  resolved: 'bg-emerald-400 text-zinc-950',
};

function ComplaintsInbox() {
  const { backendUrl } = useContext(AuthContext);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/complaints`, authHeader);
      setComplaints(response.data);
    } catch (err) {
      notify(err.response?.data?.message || 'Could not load complaints', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleReply = async (id, status) => {
    try {
      await axios.put(
        `${backendUrl}/api/complaints/${id}/reply`,
        { messManagerReply: replyText[id] || undefined, status },
        authHeader
      );
      notify('Complaint updated', 'success');
      fetchComplaints();
    } catch (err) {
      notify(err.response?.data?.message || 'Could not update complaint', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-8">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-zinc-50">Complaints</h1>
        <button onClick={() => navigate('/mess-manager')} className="text-sm text-zinc-400 hover:underline">
          ← Back to menu
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-400">Loading...</p>
      ) : complaints.length === 0 ? (
        <p className="text-zinc-400">No complaints yet.</p>
      ) : (
        <div className="space-y-4 max-w-2xl">
          {complaints.map((c) => (
            <div key={c._id} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                <div>
                  <p className="text-sm text-zinc-400">
                    {c.student?.name || 'Anonymous'} · {c.mealType} ·{' '}
                    <span className="text-amber-400 capitalize">{c.category}</span>
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[c.status]}`}>
                  {c.status.replace('_', ' ')}
                </span>
              </div>

              <p className="text-zinc-100 mb-2">{c.description}</p>
              <p className="text-xs text-zinc-500 mb-3">{c.votes.length} upvote(s)</p>

              {c.messManagerReply && (
                <div className="bg-zinc-800 rounded-lg px-3 py-2 mb-3 text-sm text-zinc-300">
                  <span className="font-medium text-zinc-100">Your reply: </span>
                  {c.messManagerReply}
                </div>
              )}

              <div className="flex flex-wrap gap-2 items-stretch">
                <input
                  value={replyText[c._id] || ''}
                  onChange={(e) => setReplyText((prev) => ({ ...prev, [c._id]: e.target.value }))}
                  placeholder="Write a reply..."
                  className="flex-1 min-w-[150px] rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={() => handleReply(c._id, 'in_progress')}
                  className="text-sm bg-blue-500 hover:bg-blue-400 text-zinc-950 font-medium px-3 py-2 rounded-lg transition"
                >
                  Mark in progress
                </button>
                <button
                  onClick={() => handleReply(c._id, 'resolved')}
                  className="text-sm bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-medium px-3 py-2 rounded-lg transition"
                >
                  Mark resolved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComplaintsInbox;