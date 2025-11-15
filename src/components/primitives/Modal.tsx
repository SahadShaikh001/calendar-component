import React, { ReactNode, useEffect } from 'react';
interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ open, title, onClose, children }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-modal p-6">
        {title && <h2 id="modal-title" className="text-lg font-semibold mb-2">{title}</h2>}
        <div id="modal-description">{children}</div>
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded bg-neutral-100">Close</button>
        </div>
      </div>
    </div>
  );
};
