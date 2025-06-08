'use client';

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

interface GreetingProps {
    first_name: string;
}

export default function GreetingClientComponentV3({
    first_name,
}: GreetingProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);


        // useEffect to change the state after a certain delay, e.g., 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            // setShowButton(true);
            pushToNextRoute();
        }, 3000); // 5000 milliseconds = 5 seconds

        // Cleanup function to clear the timer if the component unmounts
        return () => clearTimeout(timer);
    }, []); // Empty dependency array means this effect runs once on mount

    const pushToNextRoute = () => {
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`,
        );
    };


    return (
        <div className={`
            greeting-bg w-full overflow-hidden
            ${product_href === 'sermorelin' 
                ? "flex items-center justify-center" 
                : "flex items-center justify-center animate-slideRight"
            }
        `}
        style={{
            height: 'calc(100vh - 300px)', // Adjust based on your header/progress bar height
            marginTop: '60px' // Half of the top space to center within available area
        }}>
            {/* Sermorelin Layout */}
            {product_href === 'sermorelin' && (
                <div className="w-full max-w-[490px] px-4">
                    <div className="text-center">
                        <span className="greeting-heading block">
                            Nice to meet you,&nbsp;
                            <span className="greeting-highlight">
                                {first_name}
                            </span>
                        </span>
                    </div>
                </div>
            )}

            {/* Non-sermorelin layout */}
            {product_href !== 'sermorelin' && (
                <div className="w-full max-w-[490px] px-4">
                    <div className="text-center">
                        <AnimatedBioType
                            text={`Nice to meet you, ${first_name}`}
                            className="greeting-heading"
                            gap_y={1}
                            delay={0}
                            custom_class="greeting-highlight"
                            custom_class_start_index={15}
                            custom_class_end_index={15 + first_name.length}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
