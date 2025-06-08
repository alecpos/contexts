'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { useState } from 'react';

/** Collects the patient's target weight. */
export default function GoalWeight() {
  const [weight, setWeight] = useState(180);

  return (
    <div className="flex flex-col items-center gap-4">
      <BioType className="inter-h5-question-header">What is your goal weight?</BioType>
      <input
        type="number"
        className="border p-2"
        value={weight}
        onChange={(e) => setWeight(Number(e.target.value))}
      />
    </div>
  );
}
