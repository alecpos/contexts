'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import { useState } from 'react';
import ContinueButton from '../buttons/ContinueButton';
import { continueButtonExitAnimation } from '../intake-animations';

interface WLChecklistProps {}

export default function WLChecklistComponent({}: WLChecklistProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const pushToNextRoute = async () => {
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        await continueButtonExitAnimation(150);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`,
        );
    };

    // const [showButton, setShowButton] = useState(false);

    // // useEffect to change the state after a certain delay, e.g., 5 seconds
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setShowButton(true);
    //     }, 4000); // 5000 milliseconds = 5 seconds

    //     // Cleanup function to clear the timer if the component unmounts
    //     return () => clearTimeout(timer);
    // }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div className={`justify-center flex animate-slideRight`}>
            <div className="flex flex-col gap-8 h-full overflow-y-hidden">
                <div className="flex flex-col gap-5 h-full">
                    <BioType className="h5 text-primary">
                        You can now get an affordable and clinically effective
                        way to lose weight (and keep it off)!
                    </BioType>
                    {/* <AnimatedBioType
                        text={`You can now get an affordable and clinically effective way to lose weight (and keep it off)!`}
                        className={'h5 !text-primary'}
                        gap_y={1}
                    /> */}
                    <div className="flex flex-col gap-5">
                        <BioType className="body1 items-center gap-2 flex flex-row">
                            ✅ We don&apos;t charge a membership fee like other
                            companies do.
                        </BioType>
                        {/* <AnimatedBioType
                            text={`✅ We don't charge a membership fee like other companies do.`}
                            className={'body1 items-center gap-2 flex flex-row'}
                            gap_y={1}
                            delay={1}
                        /> */}

                        <BioType className="body1 items-center gap-2 flex flex-row">
                            ✅ Your virtual consultation is FREE.
                        </BioType>
                        {/* <AnimatedBioType
                            text={`✅ Your virtual consultation is FREE.`}
                            className={'body1 items-center gap-2 flex flex-row'}
                            gap_y={1}
                            delay={1.5}
                        /> */}

                        <BioType className="body1 items-center gap-2 flex flex-row">
                            ✅ You only pay for the medication if prescribed.
                        </BioType>
                        {/* <AnimatedBioType
                            text={`✅ You only pay for the medication if prescribed.`}
                            className={'body1 items-center gap-2 flex flex-row'}
                            gap_y={1}
                            delay={2}
                        /> */}

                        <BioType className="body1 items-center gap-2 flex flex-row">
                            ✅ If prescribed, your treatment is shipped to you
                            quickly for FREE.
                        </BioType>
                        {/* <AnimatedBioType
                            text={`✅ If prescribed, your treatment is shipped to you quickly for FREE.`}
                            className={'body1 items-center gap-2 flex flex-row'}
                            gap_y={1}
                            delay={2.5}
                        /> */}

                        <BioType className="body1 items-center gap-2 flex flex-row">
                            ✅ You can message your provider at any time through
                            the BIOVERSE portal.
                        </BioType>
                        {/* <AnimatedBioType
                            text={`✅ You can message your provider at any time through the BIOVERSE portal.`}
                            className={'body1 items-center gap-2 flex flex-row'}
                            gap_y={1}
                            delay={3}
                        /> */}
                    </div>

                    {/* {showButton && ( */}

                    <div className={`mt-5 animate-slideRight`}>
                        <ContinueButton
                            onClick={pushToNextRoute}
                            buttonLoading={buttonLoading}
                        />
                    </div>
                    {/* )} */}
                </div>
            </div>
        </div>
    );
}
