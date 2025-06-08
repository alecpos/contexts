'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { useState } from 'react';

const MEDICATIONS = ['Ozempic', 'Mounjaro', 'Zepbound', 'BIOVERSE Weight Loss Capsule'];

/** Displays selectable medication options. */
export default function MedicationOptions() {
  const [selected, setSelected] = useState('');

  return (
    <div className="flex flex-col items-center gap-4">
      <BioType className="inter-h5-question-header">Choose your medication</BioType>
      <ul className="flex flex-col gap-2">
        {MEDICATIONS.map((m) => (
          <li
            key={m}
            className={`border p-2 rounded-md cursor-pointer hover:bg-gray-50 ${selected === m ? 'bg-gray-100' : ''}`}
            onClick={() => setSelected(m)}
          >
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}
