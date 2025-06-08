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
import { IntakeButtonWithLoading } from '../buttons/loadable-button';
import AnimatedBioType from '../../global-components/bioverse-typography/animated-type/animation-type';
import { useEffect } from 'react';

interface GoodToGoProps {
    first_name: string;
}

export default function GreeingClientComponent({ first_name }: GoodToGoProps) {
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
            className={`mt-[25vh] mx-2 p-2 justify-center items-start flex md:mt-10 animate-slideRight`}
        >
            <div className="flex flex-row gap-8">
                <div className="flex flex-col gap-4 md:min-w-[560px] max-w-[600px]">
                    {/* <BioType className={`h4medium md:h3medium `}>
                        Nice to meet you,{' '}
                        <span className='!text-primary'>{first_name}</span>.
                    </BioType> */}

                    <AnimatedBioType
                        text={`Nice to meet you, ${first_name}`}
                        className={'h4medium md:h3medium'}
                        gap_y={1}
                        delay={0}
                        custom_class={`h4medium md:h3medium !text-primary`}
                        custom_class_end_index={4}
                        custom_class_start_index={4}
                    />

                    {/* <div className='flex justify-center mt-4'>
                        <div className='w-full md:w-[20%]'>
                            <IntakeButtonWithLoading
                                fullWidth
                                button_text={'Continue'}
                                custom_function={pushToNextRoute}
                            />
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
