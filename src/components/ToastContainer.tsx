import {CheckCircle2, Info, AlertCircle, X} from 'lucide-react';
import {useSpecteQ} from '../lib/store';

export function ToastContainer() {
  const {toasts, dismissToast} = useSpecteQ();
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[90] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((t) => {
        const Icon = t.type === 'error' ? AlertCircle : t.type === 'info' ? Info : CheckCircle2;
        const accent =
          t.type === 'error'
            ? 'border-rose-500/40 bg-[#080a13]/95 text-rose-100'
            : t.type === 'info'
              ? 'border-indigo-400/40 bg-[#080a13]/95 text-indigo-100'
              : 'border-emerald-500/40 bg-[#080a13]/95 text-emerald-100';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm shadow-xl backdrop-blur-md ${accent}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{t.message}</span>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="rounded p-1 text-slate-400 hover:text-white transition-colors shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
