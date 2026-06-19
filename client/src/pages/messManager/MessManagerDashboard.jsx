import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { notify } from '../../components/Notification';

const emptyMeal = { items: '', time: '', preparedQuantity: '' };

function MessManagerDashboard() {
  const { user, logout, backendUrl } = useContext(AuthContext);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState({
    breakfast: { ...emptyMeal },
    lunch: { ...emptyMeal },
    dinner: { ...emptyMeal },
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/menu/${date}`, authHeader);
        const menu = response.data;
        setMeals({
          breakfast: {
            items: (menu.breakfast?.items || []).join(', '),
            time: menu.breakfast?.time || '',
            preparedQuantity: menu.breakfast?.preparedQuantity || '',
          },
          lunch: {
            items: (menu.lunch?.items || []).join(', '),
            time: menu.lunch?.time || '',
            preparedQuantity: menu.lunch?.preparedQuantity || '',
          },
          dinner: {
            items: (menu.dinner?.items || []).join(', '),
            time: menu.dinner?.time || '',
            preparedQuantity: menu.dinner?.preparedQuantity || '',
          },
        });
      } catch (err) {
        // 404 just means no menu set for this date yet — leave the form empty
        if (err.response?.status !== 404) {
          notify(err.response?.data?.message || 'Could not load menu', 'error');
        }
      }
    };
    fetchMenu();
  }, [date]);

  const updateMeal = (mealType, field, value) => {
    setMeals((prev) => ({ ...prev, [mealType]: { ...prev[mealType], [field]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      date,
      breakfast: {
        items: meals.breakfast.items.split(',').map((i) => i.trim()).filter(Boolean),
        time: meals.breakfast.time,
        preparedQuantity: Number(meals.breakfast.preparedQuantity) || 0,
      },
      lunch: {
        items: meals.lunch.items.split(',').map((i) => i.trim()).filter(Boolean),
        time: meals.lunch.time,
        preparedQuantity: Number(meals.lunch.preparedQuantity) || 0,
      },
      dinner: {
        items: meals.dinner.items.split(',').map((i) => i.trim()).filter(Boolean),
        time: meals.dinner.time,
        preparedQuantity: Number(meals.dinner.preparedQuantity) || 0,
      },
    };

    try {
      await axios.post(`${backendUrl}/api/menu`, payload, authHeader);
      notify('Menu saved', 'success');
    } catch (err) {
      notify(err.response?.data?.message || 'Could not save menu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mealTypes = ['breakfast', 'lunch', 'dinner'];

  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-8">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-zinc-50">Hi, {user?.name}</h1>
        <div className="flex gap-4 items-center">
          <a href="/mess-manager/complaints" className="text-sm text-amber-400 font-medium hover:underline">
            View complaints
          </a>
          <a href="/insights" className="text-sm text-amber-400 font-medium hover:underline">Insights</a>
          
          <a href="/qr-code" className="text-sm text-amber-400 font-medium hover:underline">QR Code</a>

          <button onClick={logout} className="text-sm text-red-400 hover:underline">Log out</button>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 sm:p-6 max-w-3xl">
        <div className="mb-4">
          <label className="block text-sm font-medium text-zinc-300 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {mealTypes.map((mealType) => (
            <div key={mealType} className="border-t border-zinc-800 pt-4 first:border-t-0 first:pt-0">
              <h2 className="font-semibold text-zinc-50 capitalize mb-2">{mealType}</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label className="block text-xs text-zinc-400 mb-1">Items (comma-separated)</label>
                  <input
                    value={meals[mealType].items}
                    onChange={(e) => updateMeal(mealType, 'items', e.target.value)}
                    placeholder="Rice, Dal, Paneer Curry, Salad"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Time</label>
                  <input
                    value={meals[mealType].time}
                    onChange={(e) => updateMeal(mealType, 'time', e.target.value)}
                    placeholder="8:00 AM - 9:30 AM"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Prepared quantity</label>
                  <input
                    type="number"
                    value={meals[mealType].preparedQuantity}
                    onChange={(e) => updateMeal(mealType, 'preparedQuantity', e.target.value)}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-zinc-950 font-medium px-5 py-2 rounded-lg transition"
          >
            {loading ? 'Saving...' : 'Save menu'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessManagerDashboard;