'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { useState } from 'react';

/**
 * Renders an interactive BMI comparison graph. Users can adjust their
 * current and goal weight to see projected BMI changes.
 */
export default function InteractiveBMI() {
  const [currentWeight, setCurrentWeight] = useState(200);
  const [goalWeight, setGoalWeight] = useState(180);
  const HEIGHT_M = 1.75;

  const currentBmi = currentWeight / (HEIGHT_M * HEIGHT_M);
  const goalBmi = goalWeight / (HEIGHT_M * HEIGHT_M);

  return (
    <div className="flex flex-col items-center gap-4">
      <BioType className="inter-h5-question-header">BMI Progress</BioType>
      <div className="flex gap-4">
        <label className="flex flex-col text-sm">
          Current
          <input
            type="number"
            className="border p-1 rounded"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(Number(e.target.value))}
          />
        </label>
        <label className="flex flex-col text-sm">
          Goal
          <input
            type="number"
            className="border p-1 rounded"
            value={goalWeight}
            onChange={(e) => setGoalWeight(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="h-40 w-full border flex flex-col items-center justify-center gap-2">
        <span className="text-xs text-gray-600">Current BMI: {currentBmi.toFixed(1)}</span>
        <span className="text-xs text-gray-600">Goal BMI: {goalBmi.toFixed(1)}</span>
      </div>
    </div>
  );
}
