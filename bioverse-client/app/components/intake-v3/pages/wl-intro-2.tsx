'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { useState } from 'react';
import WordByWord from '../../global-components/bioverse-typography/animated-type/word-by-word';
import { getIntakeURLParams } from '../../intake-v2/intake-functions';
import AnimatedContinueButtonV3 from '../buttons/AnimatedContinueButtonV3';

interface GoodToGoProps {}

export default function WLIntroSecondClientComponentNew({}: GoodToGoProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const pushToNextRoute = () => {
       //setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);

        const searchParams = new URLSearchParams(search);

        // Remove the 'nu' parameter
        searchParams.delete('nu');

        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();

        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };

    // const [showButton, setShowButton] = useState(false);

    // // useEffect to change the state after a certain delay, e.g., 5 seconds
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setShowButton(true);
    //     }, 2000); // 5000 milliseconds = 5 seconds

    //     // Cleanup function to clear the timer if the component unmounts
    //     return () => clearTimeout(timer);
    // }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div className={`justify-center flex animate-slideRight mt-[1.25rem] md:mt-[48px]`}>
            <div className="flex flex-row">
                <div className="flex flex-col gap-[1.25rem] md:gap-[48px]">
                    <WordByWord className={`inter-h5-question-header`}>
                        At
                        <span className="inter-h5-question-header-bold bg-clip-text m-0">
                            Bioverse,
                        </span>
                         our approach to weight loss is backed by strong
                        science, so you can see real results - all based on your
                        unique weight loss goals.
                    </WordByWord>

                    <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
                </div>
            </div>
        </div>
    );
}
