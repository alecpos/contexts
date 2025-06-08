'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import React, { useState, useEffect } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { getIntakeURLParams } from '../../intake-v2/intake-functions';
import VerticalGradientLineSVGV3 from '../../intake-v2/assets/vertical-gradient-line-v3';
import VerticalGradientLineSVGMobileV3 from '../../intake-v2/assets/vertical-gradient-line-mobile-v3';
import AnimatedContinueButtonV3 from '../../intake-v3/buttons/AnimatedContinueButtonV3';

interface UpNextProps {}

export default function WLProfileStartV3Component({}: UpNextProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const pushToNextRoute = () => {
        setButtonLoading(true);
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

    return (
        <>
            <div
                className={`justify-center flex animate-slideRight mt-[1.25rem] md:mt-[48px] mb-16 md:mb-0`}
            >
                <div className="flex flex-row">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-[12px]">
                            <BioType
                                className={`inter-h5-question-header text-strong`}
                            >
                                First, let&apos;s get started on your weight
                                loss profile
                            </BioType>
                        </div>

                        <div className="flex flex-row mb-2 md:mb-5">
                            <div className="flex flex-col justify-between gap-2 mt-2 md:mt-0">
                                <div className="mt-[0px] md:mt-[7px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25"
                                        height="25"
                                        viewBox="0 0 25 25"
                                        fill="none"
                                    >
                                        <path
                                            d="M12.5 22.4714C18.0228 22.4714 22.5 17.9943 22.5 12.4714C22.5 6.94859 18.0228 2.47144 12.5 2.47144C6.97715 2.47144 2.5 6.94859 2.5 12.4714C2.5 17.9943 6.97715 22.4714 12.5 22.4714Z"
                                            stroke="#6DB0CC"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="7"
                                            height="7"
                                            viewBox="0 0 7 7"
                                            fill="none"
                                            x="9"
                                            y="9"
                                        >
                                            <circle
                                                cx="3.49609"
                                                cy="3.47534"
                                                r="3.07422"
                                                fill="#6DB0CC"
                                            />
                                        </svg>
                                    </svg>
                                </div>

                                <div className="ml-[10px] hidden md:flex mt-[89px] md:mt-[29px] absolute">
                                    <VerticalGradientLineSVGV3
                                        height="182"
                                        key={'linedesktopvert'}
                                    />
                                </div>
                                <div className="flex md:hidden mt-[22.5px] ml-[10px] absolute">
                                    <VerticalGradientLineSVGMobileV3
                                        height="45vw"
                                        key={'linemobilevert'}
                                    />
                                </div>
                                <div className="ml-[1.5px] md:ml-0.5 mt-[180px] md:mt-[162px] absolute">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25"
                                        height="25"
                                        viewBox="0 0 25 25"
                                        fill="none"
                                    >
                                        <path
                                            d="M12.5 22.032C18.0228 22.032 22.5 17.5548 22.5 12.032C22.5 6.50913 18.0228 2.03198 12.5 2.03198C6.97715 2.03198 2.5 6.50913 2.5 12.032C2.5 17.5548 6.97715 22.032 12.5 22.032Z"
                                            stroke="#BBC5CC"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </div>
                                <div className="absolute mt-[198px] ml-[10px] md:ml-[11px] md:mt-[180px]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="6"
                                        height="45"
                                        viewBox="0 0 6 38"
                                        fill="none"
                                    >
                                        <path
                                            d="M2.5 3.03198L3.5 35.032"
                                            stroke="#D3E1EA"
                                            stroke-width="4"
                                            stroke-linecap="square"
                                        />
                                    </svg>
                                </div>

                                <div className="ml-[1.5px] md:ml-0.5 mt-[237px] md:mt-[219px] absolute">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="25"
                                        height="25"
                                        viewBox="0 0 25 25"
                                        fill="none"
                                    >
                                        <path
                                            d="M12.5 22.032C18.0228 22.032 22.5 17.5548 22.5 12.032C22.5 6.50913 18.0228 2.03198 12.5 2.03198C6.97715 2.03198 2.5 6.50913 2.5 12.032C2.5 17.5548 6.97715 22.032 12.5 22.032Z"
                                            stroke="#BBC5CC"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-col ml-2 gap-[20px] md:gap-[30px] justify-between">
                                <div className="mt-2">
                                    <BioType
                                        className={`flex flex-row justify-start items-center text-weak intake-subtitle`}
                                    >
                                        Weight Loss History
                                    </BioType>
                                    <div className="flex flex-row mt-6 w-[3/4] md:w-[435px] py-[20px] md:py-[16px] px-[1.501rem] md:px-[24px] items-center gap-[1.38rem] md:gap-[16px] rounded-md border border-opacity-20 border-[#666666] bg-white shadow-[27px_25px_10px_0px_rgba(0,0,0,0),17px_16px_9px_0px_rgba(0,0,0,0.01),10px_9px_8px_0px_rgba(0,0,0,0.05),4px_4px_6px_0px_rgba(0,0,0,0.09),1px_1px_3px_0px_rgba(0,0,0,0.1)]">
                                        <div className="flex flex-1 w-full md:w-[435px]">
                                            <BioType
                                                className={`intake-v3-disclaimer-text `}
                                            >
                                                This is important because
                                                it&apos;ll be used by your
                                                provider to write your
                                                prescription, if medically
                                                appropriate.
                                            </BioType>
                                        </div>
                                    </div>
                                </div>
                                <div className=" flex flex-col gap-1">
                                    <BioType
                                        className={`flex  flex-row justify-start items-center intake-subtitle text-weak mt-[0.72rem]  md:mt-1 `}
                                    >
                                        Health History
                                    </BioType>
                                </div>
                                <BioType
                                    className={`mt-[9.2px] md:mt-[4px] flex flex-row justify-start items-center intake-subtitle text-weak`}
                                >
                                    Treatment Preview
                                </BioType>
                            </div>
                        </div>

                        <AnimatedContinueButtonV3 onClick={pushToNextRoute} />
                    </div>
                </div>
            </div>
        </>
    );
}
