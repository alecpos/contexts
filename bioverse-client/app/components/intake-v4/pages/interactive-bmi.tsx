'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import AnimatedContinueButtonV3 from '@/app/components/intake-v3/buttons/AnimatedContinueButtonV3';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getIntakeURLParams } from '@/app/components/intake-v2/intake-functions';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { useState } from 'react';

function barHeight(bmi: number) {
  return Math.min(100, Math.max(10, bmi * 2));
}

/**
 * Renders an interactive BMI comparison graph. Users can adjust their
 * current and goal weight to see projected BMI changes.
 */
interface Props {
  userId: string;
}

export default function InteractiveBMI({ userId }: Props) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const [currentWeight, setCurrentWeight] = useState(200);
    const [goalWeight, setGoalWeight] = useState(180);
    const [loading, setLoading] = useState(false);
    const HEIGHT_M = 1.75;

    const currentBmi = currentWeight / (HEIGHT_M * HEIGHT_M);
    const goalBmi = goalWeight / (HEIGHT_M * HEIGHT_M);

    const pushToNextRoute = async () => {
        setLoading(true);
        try {
            await fetch('/api/patient/goal-weight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, weight: goalWeight }),
            });
        } catch (e) {
            console.error('Failed to save goal weight', e);
        }
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        router.push(`/intake/prescriptions/${product_href}/${nextRoute}?${search}`);
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-6">
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
                <div className="flex items-end w-full gap-4 mt-2 px-4">
                    <div className="flex flex-col items-center flex-1">
                        <div
                            className="bg-blue-500 w-6"
                            style={{ height: `${barHeight(currentBmi)}%` }}
                        />
                        <span className="text-xs mt-1">Current</span>
                    </div>
                    <div className="flex flex-col items-center flex-1">
                        <div
                            className="bg-green-500 w-6"
                            style={{ height: `${barHeight(goalBmi)}%` }}
                        />
                        <span className="text-xs mt-1">Goal</span>
                    </div>
                </div>
            </div>
            <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
        </div>
    );
}
