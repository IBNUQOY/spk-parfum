import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const toastStyles = {
    success: {
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/50',
      text: 'text-emerald-100',
      icon: 'text-emerald-400',
      gradient: 'from-emerald-500/30 to-transparent'
    },
    error: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/50',
      text: 'text-red-100',
      icon: 'text-red-400',
      gradient: 'from-red-500/30 to-transparent'
    },
    info: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/50',
      text: 'text-blue-100',
      icon: 'text-blue-400',
      gradient: 'from-blue-500/30 to-transparent'
    },
    warning: {
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/50',
      text: 'text-amber-100',
      icon: 'text-amber-400',
      gradient: 'from-amber-500/30 to-transparent'
    },
  }[type];

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  }[type];

  return (
    <div className={`toast-enter w-full max-w-sm ${toastStyles.bg} border ${toastStyles.border} rounded-xl shadow-lg shadow-black/40 p-4 flex gap-4 items-start backdrop-blur-sm bg-gradient-to-r ${toastStyles.gradient}`}>
      <Icon className={`${toastStyles.icon} flex-shrink-0 mt-0.5 w-5 h-5`} />
      <div className={`flex-1 ${toastStyles.text} text-sm font-medium leading-relaxed`}>{message}</div>
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className={`flex-shrink-0 ${toastStyles.icon} hover:opacity-70 transition-opacity`}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
