'use client';

import { useEffect, useRef, useState } from 'react';

type ContactModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  contactId: string | null;
  ContactDetailComponent: React.ReactElement | null
};

export default function ContactModal({
  isOpen,
  onCloseAction,
  ContactDetailComponent,
}: ContactModalProps) {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Show/hide animation
  useEffect(() => {
    if (isOpen) setShowModal(true);
    else setTimeout(() => setShowModal(false), 300);
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseAction();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onCloseAction]);

  // Autofocus on first element
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstInput = modalRef.current.querySelector('input, textarea, button');
      if (firstInput instanceof HTMLElement) {
        firstInput.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen && !showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onCloseAction}
      />

      <div
        ref={modalRef}
        className={`relative bg-gray-950 text-white rounded-lg p-6 shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onCloseAction}
          className="absolute top-3 right-4 text-2xl font-bold text-red-400 hover:text-red-600"
          aria-label="Close modal"
        >
          ✖
        </button>

        {ContactDetailComponent}
      </div>
    </div>
  );
}