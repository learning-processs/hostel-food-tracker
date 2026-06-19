import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { notify } from '../../components/Notification';

// Small reusable star-rating control, kept in this file since it's only used here for now
function StarRating({ value, onRate }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onRate(star)}
          className={`text-2xl leading-none ${star <= value ? 'text-amber-400' : 'text-zinc-600'}`}>
          ★
        </button>
      ))}
    </div>
  );
}

function StudentDashboard() {
  const { user, logout, backendUrl } = useContext(AuthContext);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({ breakfast: 0, lunch: 0, dinner: 0 });
  const [attendance, setAttendance] = useState({ breakfast: true, lunch: true, dinner: true });

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/menu/today`, authHeader);
        setMenu(response.data);
      } catch (err) {
        if (err.response?.status !== 404) {
          notify(err.response?.data?.message || 'Could not load today\'s menu', 'error');
        }
        setMenu(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleRate = async (mealType, stars) => {
    setRatings((prev) => ({ ...prev, [mealType]: stars }));

    try {
      await axios.post(
        `${backendUrl}/api/ratings`,
        { date: new Date().toISOString(), mealType, stars },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notify(`Rated ${mealType} ${stars} star${stars > 1 ? 's' : ''}`, 'success');
    } catch (err) {
      notify(err.response?.data?.message || 'Could not submit rating', 'error');
    }
  };

  const handleAttendance = async (mealType, isAttending) => {
  setAttendance((prev) => ({ ...prev, [mealType]: isAttending }));

  try {
    await axios.post(
      `${backendUrl}/api/attendance`,
      { date: new Date().toISOString(), mealType, isAttending },
      authHeader
    );
    notify(isAttending ? `Marked attending ${mealType}` : `Marked not attending ${mealType}`, 'success');
  } catch (err) {
    notify(err.response?.data?.message || 'Could not update attendance', 'error');
  }
};

  const meals = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-8">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-zinc-50">Hi, {user?.name}</h1>
        <div className="flex gap-4 items-center">
            <a href="/student/complaint" className="text-sm text-amber-400 font-medium hover:underline">Submit a complaint</a>
            <button onClick={logout} className="text-sm text-red-400 hover:underline">Log out</button>
        </div>
        </div>

        {loading ? (
        <p className="text-zinc-400">Loading today's menu...</p>
        ) : !menu ? (
        <p className="text-zinc-400">Today's menu hasn't been posted yet — check back later.</p>
        ) : (
        <div className="grid gap-4 sm:grid-cols-3">
            {meals.map(({ key, label }) => (
            <div key={key} className="bg-zinc-900 rounded-xl shadow-lg border border-zinc-800 p-4">
                <h2 className="font-semibold text-zinc-50 mb-1">{label}</h2>
                <p className="text-xs text-zinc-500 mb-2">{menu[key]?.time}</p>
                <ul className="text-sm text-zinc-300 mb-4 list-disc list-inside">
                {(menu[key]?.items || []).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
                <StarRating value={ratings[key]} onRate={(stars) => handleRate(key, stars)} />
                <button
                  onClick={() => handleAttendance(key, !attendance[key])}
                  className={`mt-3 text-xs px-3 py-1.5 rounded-full font-medium transition ${
                    attendance[key] ? 'bg-emerald-400 text-zinc-950' : 'bg-zinc-700 text-zinc-300'
                  }`}
                >
                  {attendance[key] ? '✓ Attending' : 'Not attending'}
              </button>
            </div>
            ))}
        </div>
        )}
    </div>
    );
}

export default StudentDashboard;