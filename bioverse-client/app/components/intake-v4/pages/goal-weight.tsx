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

/** Collects the patient's target weight. */
interface Props {
  userId: string;
}

export default function GoalWeight({ userId }: Props) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [weight, setWeight] = useState(180);
    const [loading, setLoading] = useState(false);

    const pushToNextRoute = async () => {
        setLoading(true);
        try {
            await fetch('/api/patient/goal-weight', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, weight }),
            });
        } catch (e) {
            console.error('Failed to save goal weight', e);
        }
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        router.push(`/intake/prescriptions/${product_href}/${nextRoute}?${search}`);
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-6">
            <BioType className="inter-h5-question-header">What is your goal weight?</BioType>
            <input
                type="number"
                className="border p-2"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
            />
            <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
        </div>
    );
}
