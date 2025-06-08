'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import AnimatedBioType from '../../global-components/bioverse-typography/animated-type/animation-type-v3';
import { useEffect } from 'react';
import { getIntakeURLParams } from '../../intake-v2/intake-functions';

interface GoodToGoProps {}

export default function WLSecurityDisclaimerComponent({}: GoodToGoProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);

    const pushToNextRoute = () => {
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`,
        );
    };

    // const [showButton, setShowButton] = useState(false);

    // useEffect to change the state after a certain delay, e.g., 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            // setShowButton(true);
            pushToNextRoute();
        }, 3000); // 5000 milliseconds = 5 seconds

        // Cleanup function to clear the timer if the component unmounts
        return () => clearTimeout(timer);
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div
            className={`mt-[25vh] mx-2 p-2 justify-center items-start flex md:mt-24 animate-slideRight w-full `}
        >
            <div className="flex flex-row gap-8 ">
                <div className="flex flex-col gap-4 md:min-w-[560px] max-w-[600px] justify-center items-center md:mt-[8rem]">
                    <AnimatedBioType
                        text={`Now for security reasons, we need to make sure you're you.`}
                        className={
                            'inter-h5-question-header text-[1.56rem] md:text-[33px] leading-[38px] font-[200]'
                        }
                        gap_y={1}
                        delay={0}
                        custom_class={`inter-h5-question-header text-[1.56rem] md:text-[33px] leading-[38px] font-[200]`}
                        custom_class_end_index={4}
                        custom_class_start_index={4}
                    />
                </div>
            </div>
        </div>
    );
}
