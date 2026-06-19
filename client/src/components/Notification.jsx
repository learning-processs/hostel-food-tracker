import toast from 'react-hot-toast';

export const notify = (message, type = 'info') => {
  toast.custom(() => (
    <div className="flex items-start gap-3 bg-zinc-900 rounded-xl shadow-lg border border-zinc-700 px-4 py-3 max-w-sm">
      <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-zinc-950 text-sm font-bold ${
        type === 'success' ? 'bg-emerald-400' : type === 'error' ? 'bg-red-400' : 'bg-amber-400'
      }`}>
        {type === 'success' ? '✓' : type === 'error' ? '!' : 'i'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-50">
          {type === 'success' ? 'Success' : type === 'error' ? 'Something went wrong' : 'Notice'}
        </p>
        <p className="text-sm text-zinc-400">{message}</p>
      </div>
    </div>
  ));
};