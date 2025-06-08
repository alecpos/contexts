'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import React, { useEffect, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '../buttons/ContinueButton';
import useSWR from 'swr';
import { getImageRefUsingProductHref } from '@/app/utils/database/controller/products/products';
import { continueButtonExitAnimation } from '../intake-animations';

interface Props {}

export default function WLAnimatedIntroClient({}: Props) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const [renderImg1, setRenderImge1] = useState<boolean>(false);
    const [renderImg2, setRenderImge2] = useState<boolean>(false);
    const [renderImg3, setRenderImge3] = useState<boolean>(false);
    const [svgContent, setSvgContent] = useState('');

    const { data, error, isLoading } = useSWR(`${product_href}-image-ref`, () =>
        getImageRefUsingProductHref(product_href),
    );

    useEffect(() => {
        // Set renderImg1 to true after 1 second
        const timer1 = setTimeout(() => {
            setRenderImge1(true);
        }, 1000); // 1000 milliseconds = 1 second

        // Set renderImg2 to true after 2 seconds
        const timer2 = setTimeout(() => {
            setRenderImge2(true);
        }, 2000); // 2000 milliseconds = 2 seconds

        // Set renderImg3 to true after 3 seconds
        const timer3 = setTimeout(() => {
            setRenderImge3(true);
        }, 3000); // 3000 milliseconds = 3 seconds

        // Cleanup function to clear timeouts if the component unmounts
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [svgContent]); // Empty dependency array means this effect runs once on mount

    useEffect(() => {
        if (data?.data[0]) {
            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 238">
                    <defs>
                        <pattern id="product-image" patternUnits="userSpaceOnUse" width="229" height="229">
                            <image href="${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${data.data[0]}" x="0" y="0" width="229" height="229" />
                        </pattern>
                    </defs>
                    <rect x="4" y="4" width="229" height="229" rx="32" fill="url(#product-image)" stroke="white" stroke-width="8" />
                </svg>
            `;
            setSvgContent(svg);
        }
    }, [data]);

    const pushToNextRoute = async () => {
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();
        await continueButtonExitAnimation(150);
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };

    return (
        <>
            <div className={`justify-center flex w-full animate-slideRight`}>
                <div className="flex flex-row gap-8">
                    <div className="flex flex-col gap-8">
                        <BioType>Animated Intro Component Placeholder.</BioType>

                        <div className="flex-1 flex items-center justify-center"></div>

                        {/* {svgContent && (
                            <div
                                className='animate-slideRight ml-40 fixed w-[359px]'
                                dangerouslySetInnerHTML={{
                                    __html: svgContent,
                                }}
                            />
                        )}
                        {renderImg2 && (
                            <div className='animate-slideLeft fixed mr-40 mt-20'>
                                <HappyCoupleImage />
                            </div>
                        )}

                        {renderImg3 && (
                            <div className='animate-slideRight fixed ml-20 mt-40'>
                                <DoctorImage />
                            </div>
                        )} */}

                        <div
                            className={`w-full md:flex md:justify-center md:mt-2 mt-[137px] md:mb-8`}
                        >
                            <ContinueButton
                                onClick={pushToNextRoute}
                                buttonLoading={buttonLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
