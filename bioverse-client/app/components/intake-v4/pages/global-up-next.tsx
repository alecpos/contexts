'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

/** Simple "up next" page for the global weight loss funnel. */
export default function GlobalWLUpNext() {
  return (
    <div className="flex flex-col items-center gap-4">
      <BioType className="inter-h5-question-header">You're all set!</BioType>
      <p className="text-sm text-gray-600">Next we'll gather a bit more information to personalize your plan.</p>
    </div>
  );
}
