import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast() {
  const { apiError, setApiError, successMsg, setSuccessMsg } = useAuth();

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => setApiError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [apiError, setApiError]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, setSuccessMsg]);

  if (!apiError && !successMsg) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {apiError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-lg pointer-events-auto animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm font-medium flex-1">{apiError}</p>
          <button 
            onClick={() => setApiError(null)} 
            className="text-red-400 hover:text-red-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl shadow-lg pointer-events-auto animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-sm font-medium flex-1">{successMsg}</p>
          <button 
            onClick={() => setSuccessMsg(null)} 
            className="text-emerald-400 hover:text-emerald-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
