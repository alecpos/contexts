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

const MEDICATIONS = ['Ozempic', 'Mounjaro', 'Zepbound', 'BIOVERSE Weight Loss Capsule'];

/** Displays selectable medication options. */
export default function MedicationOptions() {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const [selected, setSelected] = useState('');

    const pushToNextRoute = () => {
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        router.push(`/intake/prescriptions/${product_href}/${nextRoute}?${search}`);
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-6">
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
            <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
        </div>
    );
}
