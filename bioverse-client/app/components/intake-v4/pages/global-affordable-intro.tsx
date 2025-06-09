'use client';

import Image from 'next/image';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { useState } from 'react';
import AnimatedContinueButtonV3 from '@/app/components/intake-v3/buttons/AnimatedContinueButtonV3';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getIntakeURLParams } from '@/app/components/intake-v2/intake-functions';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';

export default function GlobalWLAffordableIntro() {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [loading, setLoading] = useState(false);

    const pushToNextRoute = () => {
        setLoading(true);
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`,
        );
    };

    return (
        <div className="flex justify-center mt-[1.25rem] md:mt-12 w-full">
            <div className="flex flex-col gap-8 w-full max-w-[22.5rem] md:max-w-[390px]">
                <div className="flex flex-col gap-6">
                    <BioType className="inter-h5-question-header">
                        Affordable treatments, for every body.
                    </BioType>
                    <div className="grid grid-cols-2 gap-4">
                        <Image
                            src="https://via.placeholder.com/150"
                            alt="option 1"
                            width={200}
                            height={200}
                            className="rounded-lg"
                        />
                        <Image
                            src="https://via.placeholder.com/150"
                            alt="option 2"
                            width={200}
                            height={200}
                            className="rounded-lg"
                        />
                        <Image
                            src="https://via.placeholder.com/150"
                            alt="option 3"
                            width={200}
                            height={200}
                            className="rounded-lg"
                        />
                        <Image
                            src="https://via.placeholder.com/150"
                            alt="option 4"
                            width={200}
                            height={200}
                            className="rounded-lg"
                        />
                    </div>
                    <BioType className="text-sm text-gray-600">
                        Access a range of treatment options, from compounded
                        semaglutide to brand name GLP-1 injections if you
                        qualify.
                    </BioType>
                </div>
                <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
            </div>
        </div>
    );
}
