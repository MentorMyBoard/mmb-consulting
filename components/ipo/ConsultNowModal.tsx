'use client';

export function ConsultNowModal({
  consultNowUrl,
  onClose,
}: {
  consultNowUrl: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-md p-6 md:p-8 text-center">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          ×
        </button>

        <h3 className="font-serif text-2xl text-slate-900 mb-2">You&apos;ve completed the quiz.</h3>
        <p className="text-slate-600 text-sm mb-6">
          Ready to take the next step on your IPO journey? Our advisory team is here to help.
        </p>

        {consultNowUrl ? (
          <a
            href={consultNowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#F7A21B] text-[#1A1A1A] text-sm uppercase tracking-wider font-semibold px-8 py-3"
          >
            Consult Now
          </a>
        ) : (
          <p className="text-xs text-slate-400">Consultation link coming soon.</p>
        )}
      </div>
    </div>
  );
}
