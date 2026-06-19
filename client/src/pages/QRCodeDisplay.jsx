import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

function QRCodeDisplay() {
  const navigate = useNavigate();
  const feedbackUrl = `${window.location.origin}/student/complaint`;

  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-8 flex flex-col items-center justify-center">
      <button onClick={() => navigate(-1)} className="self-start text-sm text-zinc-400 hover:underline mb-6">
        ← Back
      </button>

      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <QRCodeSVG value={feedbackUrl} size={240} />
      </div>

      <p className="text-zinc-300 mt-6 text-center max-w-xs">
        Scan this code to submit feedback or a complaint about today's meal.
      </p>
      <p className="text-zinc-500 text-xs mt-1">{feedbackUrl}</p>

      <p className="text-zinc-500 text-xs mt-8">
        Print this page and display it at the mess entrance.
      </p>
    </div>
  );
}

export default QRCodeDisplay;