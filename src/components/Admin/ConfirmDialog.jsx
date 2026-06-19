import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  type = 'confirm', // 'confirm' | 'alert' | 'prompt'
  variant = 'primary', // 'primary' | 'danger' | 'warning' | 'success'
  confirmText,
  cancelText = 'Cancel',
  promptPlaceholder = 'Type here...',
  defaultValue = '',
  onConfirm,
  onCancel,
}) {
  const [inputValue, setInputValue] = useState(defaultValue);

  // Reset input value when modal opens/changes
  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    if (type === 'prompt') {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
  };

  const buttonColors = {
    primary: 'bg-[#70d64d] text-black hover:bg-[#8ee67b]',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    warning: 'bg-amber-500 text-black hover:bg-amber-600',
    success: 'bg-[#70d64d] text-black hover:bg-[#8ee67b]',
  };

  const defaultConfirms = {
    confirm: confirmText || 'Confirm',
    alert: confirmText || 'OK',
    prompt: confirmText || 'Submit',
  };

  const getHeaderIcon = () => {
    if (variant === 'danger' || variant === 'warning') {
      return <AlertTriangle className={`${variant === 'danger' ? 'text-red-500' : 'text-amber-500'} shrink-0`} size={22} />;
    }
    return null;
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onCancel} className="fixed inset-0 bg-black/80 backdrop-blur-[4px] z-[900]" />
      
      {/* Modal Dialog */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[480px] bg-[#121215] border border-[#23232a] rounded-[14px] p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.7)] z-[901] flex flex-col gap-4">
        
        {/* Header */}
        <div className="flex justify-between items-start gap-3 border-b border-[#23232a] pb-3">
          <div className="flex items-center gap-2">
            {getHeaderIcon()}
            <h3 className="m-0 text-[1.1rem] font-bold text-white leading-tight">
              {title || 'Confirm Action'}
            </h3>
          </div>
          <button 
            type="button"
            onClick={onCancel} 
            className="bg-transparent border-none text-gray-500 hover:text-white cursor-pointer transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleConfirm} className="flex flex-col gap-4 m-0">
          <div className="text-gray-300 text-[0.88rem] leading-relaxed whitespace-pre-wrap">
            {message}
          </div>

          {type === 'prompt' && (
            <div className="flex flex-col gap-1">
              <input 
                type="text" 
                autoFocus
                required
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={promptPlaceholder}
                className="w-full rounded-[6px] border border-[#23232a] bg-[#0c0c0e] px-3 py-2.5 text-white text-[0.85rem] outline-none focus:border-[#70d64d] transition-colors"
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 border-t border-[#23232a] pt-4 mt-1">
            {type !== 'alert' && (
              <button 
                type="button" 
                onClick={onCancel} 
                className="bg-transparent border border-[#2c2c35] text-[#a1a1aa] rounded-[6px] px-4 py-2 text-[0.82rem] font-semibold cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button 
              type="submit" 
              className={`${buttonColors[variant]} border-none rounded-[6px] px-5 py-2 text-[0.82rem] font-bold cursor-pointer transition-colors`}
            >
              {defaultConfirms[type]}
            </button>
          </div>
        </form>

      </div>
    </>
  );
}
