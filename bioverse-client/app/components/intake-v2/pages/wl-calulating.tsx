'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import React, { Fragment, useEffect, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { INTAKE_PAGE_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';
import Image from 'next/image';
import useSWR from 'swr';
import { getImageRefUsingProductHref } from '@/app/utils/database/controller/products/products';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';
import { Transition } from '@headlessui/react';

interface WLCalcProps {
    selected_product: string | undefined;
    bmi_data: {
        height_feet: number;
        height_inches: number;
        weight_lbs: number;
        bmi: number;
    };
}

export default function WLCalculatingComponent({
    selected_product,
    bmi_data,
}: WLCalcProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    // TODO change this to the product href in the link
    const { data, error, isLoading } = useSWR(`${product_href}-image`, () =>
        getImageRefUsingProductHref('semaglutide'),
    );

    const [title, setTitle] = useState<string>(
        'Calculating how much weight you can lose...',
    );
    const [showImage1, setShowImage1] = useState(false);

    const [showImage2, setShowImage2] = useState(false);

    const [showImage3, setShowImage3] = useState(false);

    // useEffect to change the state after a certain delay, e.g., 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowImage1(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const pushToNextRoute = () => {
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(
            fullPath,
            product_href,
            search,
            false,
            'none',
            selected_product,
        );
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowImage2(true);
            setTitle(`${bmi_data.height_feet}' ${bmi_data.height_inches}"...`);
        }, 6000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowImage3(true);
            setTitle(`${bmi_data.weight_lbs} pounds...`);
        }, 9000);

        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            pushToNextRoute();
        }, 11000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    const mainImageRef = data?.data[0];
    return (
        <>
            <div
                className={`justify-center sm:max-w-full  min-w-full md:mx-auto `}
            >
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-8 animate-slideRight ">
                        {title && (
                            <BioType
                                className={`${INTAKE_PAGE_HEADER_TAILWIND} md:max-w-[333px] mx-auto animate-appear`}
                            >
                                {title}
                            </BioType>
                        )}
                        {/* <BioType
                                className={`${INTAKE_PAGE_HEADER_TAILWIND} md:max-w-[333px] mx-auto animate-appear`}
                            >
                                 skdj fksd fksjd fkjs dfk sdkf skdf
                            </BioType> */}

                        <div className="flex flex-col gap-8 animate-slideRight  min-w-[297px] md:max-w-[481px]">
                            <div className="relative md:h-[640px] h-[500px] mb-[100px]">
                                {showImage1 && (
                                    <Transition
                                        appear
                                        show={showImage1}
                                        as={Fragment}
                                    >
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <div className=" border-8 border-white border-solid rounded-[28px] absolute md:w-[47.1%] w-[47%] aspect-square top-0 left-[40.7%] bg-[#F4F4F4F4] overflow-hidden">
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${mainImageRef}`}
                                                    fill
                                                    alt={`Vial Image`}
                                                    className=""
                                                    unoptimized
                                                />
                                            </div>
                                        </Transition.Child>
                                    </Transition>
                                )}

                                {showImage2 && (
                                    <Transition
                                        appear
                                        show={showImage2}
                                        as={Fragment}
                                    >
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <div className=" border-8 border-white border-solid rounded-[28px] absolute md:w-[55%] w-[57.6%] aspect-square md:top-[19.8%] top-[26%] bg-[#F4F4F4F4] overflow-hidden">
                                                <Image
                                                    src="/img/intake/doctor.jpeg"
                                                    fill
                                                    alt={`Doctor Image`}
                                                    style={{
                                                        objectFit: 'cover',
                                                        objectPosition:
                                                            '-25px 0',
                                                        transform: 'scale(1.2)',
                                                    }}
                                                    className=""
                                                    unoptimized
                                                />
                                            </div>
                                        </Transition.Child>
                                    </Transition>
                                )}

                                {showImage3 && (
                                    <>
                                        <Transition
                                            appear
                                            show={showImage3}
                                            as={Fragment}
                                        >
                                            <div className=" flex  border-8 border-white border-solid rounded-[28px] absolute md:w-[69.3%] w-[61%] aspect-square bottom-0 right-0 bg-[#F4F4F4F4] overflow-hidden">
                                                <Image
                                                    src="/img/patient-portal/wl-checkout3.jpeg"
                                                    fill
                                                    alt={`Couple Image`}
                                                    style={{
                                                        objectFit: 'cover',
                                                        objectPosition: '0 0',
                                                        transform: 'scale(1.1)',
                                                    }}
                                                    className=""
                                                    unoptimized
                                                />
                                            </div>
                                        </Transition>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
