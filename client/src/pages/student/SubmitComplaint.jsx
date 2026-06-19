import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { notify } from '../../components/Notification';

function SubmitComplaint() {
  const { backendUrl } = useContext(AuthContext);
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [mealType, setMealType] = useState('lunch');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${backendUrl}/api/complaints`,
        { description, mealType, isAnonymous },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notify('Complaint submitted', 'success');
      navigate('/student');
    } catch (err) {
      notify(err.response?.data?.message || 'Could not submit complaint', 'error');
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className="min-h-screen bg-zinc-950 p-4 sm:p-8 flex justify-center">
            <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 p-6 sm:p-8 h-fit">
            <h1 className="text-xl font-bold text-zinc-50 mb-1">Submit a complaint</h1>
            <p className="text-zinc-400 text-sm mb-6">
                Be specific — our AI categorizes complaints automatically to help the mess manager respond faster.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Which meal?</label>
                <select value={mealType} onChange={(e) => setMealType(e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                </select>
                </div>

                <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">What happened?</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>

                <label className="flex items-center gap-2 text-sm text-zinc-400">
                <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-zinc-600 bg-zinc-800" />
                Submit anonymously
                </label>

                <button type="submit" disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-zinc-950 font-medium py-2 rounded-lg transition">
                {loading ? 'Submitting...' : 'Submit complaint'}
                </button>
            </form>

            <button onClick={() => navigate('/student')} className="text-sm text-zinc-500 hover:underline mt-4">
                ← Back to dashboard
            </button>
            </div>
        </div>
        );
}

export default SubmitComplaint;