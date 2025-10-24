'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DocumentViewerProps {
  documentUrl: string;
  checkboxes: string[];
  userId: string;
  contentItemId: string;
  isCompleted: boolean;
}

export default function DocumentViewer({
  documentUrl,
  checkboxes,
  userId,
  contentItemId,
  isCompleted,
}: DocumentViewerProps) {
  const router = useRouter();
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allChecked = checkedItems.size === checkboxes.length;

  const handleCheckboxChange = (index: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!allChecked) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/content/mark-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          contentItemId,
          completed: true,
        }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting agreement:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Document Link */}
      <div className="p-8">
        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">📄 Review the Document</h2>
        <p className="text-gray-600 mb-6">
          Please read the full document carefully before acknowledging the terms below.
        </p>
        <a
          href={documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0A84FF] to-[#0077ED] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          <span>Open Document</span>
          <span>↗</span>
        </a>
      </div>

      {/* Dashed Divider */}
      {!isCompleted && (
        <div className="border-t-2 border-dashed border-gray-300 mx-8"></div>
      )}

      {/* Acknowledgement Checkboxes */}
      {!isCompleted && (
        <div className="p-8">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">✓ Acknowledge and Agree</h2>
          <p className="text-gray-600 mb-6">
            Please check all boxes below to confirm you have read and agree to the terms:
          </p>

          <div className="space-y-4 mb-8">
            {checkboxes.map((item, index) => (
              <label
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checkedItems.has(index)}
                  onChange={() => handleCheckboxChange(index)}
                  className="mt-1 w-5 h-5 text-[#0A84FF] border-gray-300 rounded focus:ring-[#0A84FF] focus:ring-2"
                />
                <span className="text-gray-700 leading-relaxed">{item}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!allChecked || isSubmitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#0A84FF] to-[#0077ED] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Agreement ✓'}
          </button>

          {!allChecked && (
            <p className="text-sm text-gray-500 text-center mt-3">
              Please check all boxes to continue
            </p>
          )}
        </div>
      )}

      {/* Dashed Divider for Completed State */}
      {isCompleted && (
        <div className="border-t-2 border-dashed border-gray-300 mx-8"></div>
      )}

      {/* Completed State */}
      {isCompleted && (
        <div className="p-8 bg-green-50">
          <div className="flex items-center justify-center gap-3 text-green-700 mb-4">
            <span className="text-3xl">✓</span>
            <h2 className="text-2xl font-bold">Agreement Completed!</h2>
          </div>
          <p className="text-center text-gray-600">
            You have successfully acknowledged and agreed to all terms.
          </p>
        </div>
      )}
    </>
  );
}

