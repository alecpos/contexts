'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

/** Placeholder order summary screen for the global weight loss funnel. */
export default function GlobalOrderSummary() {
  return (
    <div className="flex flex-col items-center gap-4">
      <BioType className="inter-h5-question-header">Order Summary</BioType>
      <p className="text-sm text-gray-600">Review your selections before finalizing.</p>
    </div>
  );
}
