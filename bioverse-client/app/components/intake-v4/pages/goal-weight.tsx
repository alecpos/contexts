'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

export default function GoalWeight() {
  return (
    <div className="flex flex-col items-center gap-4">
      <BioType className="inter-h5-question-header">What is your goal weight?</BioType>
      <input type="number" className="border p-2" placeholder="Enter goal weight" />
    </div>
  );
}
