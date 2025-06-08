'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

/** Placeholder follow up screen for the global weight loss funnel. */
export default function GlobalWhatsNext() {
  return (
    <div className="flex flex-col items-center gap-4">
      <BioType className="inter-h5-question-header">What's Next</BioType>
      <p className="text-sm text-gray-600">We'll follow up with next steps shortly.</p>
    </div>
  );
}
