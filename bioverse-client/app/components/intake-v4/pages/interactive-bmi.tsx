'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

export default function InteractiveBMI() {
  return (
    <div className="flex flex-col items-center gap-4">
      <BioType className="inter-h5-question-header">BMI Progress</BioType>
      <div className="h-40 w-full border flex items-center justify-center">
        {/* Visualization placeholder */}
        <span className="text-sm text-gray-600">Graph updates as user enters weight</span>
      </div>
    </div>
  );
}
