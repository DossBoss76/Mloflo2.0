import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-end">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl min-w-[260px] max-w-sm cursor-pointer select-none ${toast.removing ? 'animate-toast-out' : 'animate-toast-in'} ${
            toast.type === 'success'
              ? 'bg-[#04d39e] text-[#0a0c0f]'
              : toast.type === 'error'
              ? 'bg-[#ff5c5c] text-white'
              : 'bg-[#1c222c] text-[#e8eaed] border border-white/10'
          }`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.type === 'success' && <CheckCircle size={16} strokeWidth={2.5} />}
          {toast.type === 'error' && <XCircle size={16} strokeWidth={2.5} />}
          {toast.type === 'info' && <Info size={16} strokeWidth={2.5} />}
          <span className="font-roboto font-500 text-[13px] flex-1 leading-snug">{toast.message}</span>
          <X size={14} strokeWidth={2} className="opacity-60" />
        </div>
      ))}
    </div>
  );
}
