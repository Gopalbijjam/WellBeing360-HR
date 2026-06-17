import React, { useState } from 'react';

/** Props for the modal */
interface EapReferenceModalProps {
  /** The EAP session object (any shape – we only display a few fields) */
  session: any;
  /** Called when the user clicks “Cancel” or the overlay */
  onClose: () => void;
  /** Called with the reference string when the user clicks “Save”. Must return a promise so the caller can await it. */
  onSave: (reference: string) => Promise<void>;
}

/**
 * A reusable modal that lets a Wellness Coordinator assign a reference
 * person (e.g., a counsellor) to a pending EAP session.
 *
 * The UI follows the project’s design system:
 * – glass‑morphic backdrop,
 * – subtle fade‑in animation,
 * – Tailwind utilities for spacing, colours and shadows.
 */
export default function EapReferenceModal({
  session,
  onClose,
  onSave,
}: EapReferenceModalProps) {
  const [reference, setReference] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Handles the Save button click */
  const handleSave = async () => {
    if (!reference.trim()) {
      setError('Reference name cannot be empty.');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await onSave(reference.trim());
    } catch (e: any) {
      setError(e.message ?? 'Failed to assign reference.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 animate-fade-in"
      onClick={onClose}
    >
      {/* Modal container – stop click propagation so interior clicks don’t close */}
      <div
        className="bg-white/90 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-md p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          Assign Reference
        </h2>
        <div className="mb-4 text-sm text-slate-600">
          <p className="font-medium">
            Service: <span className="text-slate-800">{session?.serviceName}</span>
          </p>
          <p>
            Requested by: <span className="text-slate-800">{session?.employeeName}</span>
          </p>
        </div>
        <input
          type="text"
          placeholder="Reference person (e.g., John Doe)"
          className="custom-input w-full mb-3"
          value={reference}
          onChange={e => setReference(e.target.value)}
          disabled={isSaving}
        />
        {error && (
          <p className="text-red-600 text-xs mb-2">
            <strong>⚠️</strong> {error}
          </p>
        )}
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
