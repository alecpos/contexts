'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

const MEDICATIONS = ['Ozempic', 'Mounjaro', 'Zepbound', 'BIOVERSE Weight Loss Capsule'];

export default function MedicationOptions() {
  return (
    <div className="flex flex-col items-center gap-4">
      <BioType className="inter-h5-question-header">Choose your medication</BioType>
      <ul className="flex flex-col gap-2">
        {MEDICATIONS.map((m) => (
          <li key={m} className="border p-2 rounded-md cursor-pointer hover:bg-gray-50">{m}</li>
        ))}
      </ul>
    </div>
  );
}
