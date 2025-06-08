'use client';

import React, { useState, useEffect } from 'react';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '../buttons/ContinueButton';
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
    TRANSITION_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import MultiSelectItem from '../questions/question-types/multi-select/multi-select-item';
import Image from 'next/image';

const GlutathioneProcessComponent = () => {
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

        const newSearch = searchParams.toString();
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
    };

    return (
        <>
            <div className={`w-full animate-slideRight`}>
                <div className=" flex justify-center">
                    <div className="flex flex-col gap-6 md:min-w-[941px] mb-[100px] md:mb-0">
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            How Glutathione Works
                        </BioType>

                        <div className="flex md:flex-row flex-col gap-6 md:min-w-[941px]">
                            <div className="flex flex-col md:gap-[28px] gap-4  md:w-1/3 w-full ">
                                <div className="w-full aspect-[3.28] md:aspect-square  relative  md:rounded-none rounded-[4px] overflow-hidden">
                                    <Image
                                        src={
                                            '/img/intake/glutathione/process1.jpeg'
                                        }
                                        alt="Process 1 Image"
                                        fill
                                        objectFit="cover"
                                        unoptimized
                                    />
                                </div>
                                <div>
                                    <BioType
                                        className={`${INTAKE_INPUT_TAILWIND}`}
                                    >
                                        Direct Free Radical Scavenging
                                    </BioType>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary mt-4`}
                                    >
                                        GSH directly interacts with reactive
                                        oxygen species (ROS) like hydrogen
                                        peroxide (H2O2), superoxide radicals,
                                        and hydroxyl radicals, neutralizing them
                                        into less harmful substances.
                                    </BioType>
                                </div>
                            </div>
                            <div className="flex flex-col md:gap-[28px] gap-4  md:w-1/3 w-full">
                                <div className="w-full aspect-[3.28] md:aspect-square relative   md:rounded-none rounded-[4px] overflow-hidden">
                                    <div className="md:hidden absolute inset-0 w-full aspect-square">
                                        <Image
                                            src="/img/intake/glutathione/process2.jpeg"
                                            alt="Process 2 Image"
                                            fill
                                            className="transform -rotate-90 scale-y-100 "
                                            objectFit="contain"
                                            style={{
                                                marginTop: '-75px',
                                                // transform: 'scale(.9)',
                                            }}
                                            unoptimized
                                        />
                                    </div>
                                    <div className="hidden md:flex  items-center">
                                        <Image
                                            src="/img/intake/glutathione/process2.jpeg"
                                            alt="Process 2 Image"
                                            fill
                                            objectFit="cover"
                                            objectPosition="-50px -50px"
                                            style={{
                                                transform: 'scale(1.5)',
                                            }}
                                            unoptimized
                                        />
                                    </div>
                                </div>

                                <div>
                                    <BioType
                                        className={`${INTAKE_INPUT_TAILWIND}`}
                                    >
                                        Detoxification
                                    </BioType>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary mt-4`}
                                    >
                                        GSH conjugates with toxins, making them
                                        easier for the body to excrete. The
                                        detoxification process occurs mainly in
                                        the liver, where GSH binds to a variety
                                        of foreign compounds.
                                    </BioType>
                                </div>
                            </div>
                            <div className="flex flex-col md:gap-[28px] gap-4  md:w-1/3 w-full">
                                <div className="w-full aspect-[3.28] md:aspect-square relative   md:rounded-none rounded-[4px] overflow-hidden">
                                    <Image
                                        src="/img/intake/glutathione/process3.jpeg"
                                        alt="Process 3 Image"
                                        fill
                                        objectFit="cover"
                                        unoptimized
                                    />
                                </div>
                                <div>
                                    <BioType
                                        className={`${INTAKE_INPUT_TAILWIND}`}
                                    >
                                        Supporting Immune Function
                                    </BioType>
                                    <BioType
                                        className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary mt-4`}
                                    >
                                        GSH plays a role in the proliferation of
                                        lymphocytes, the cells that mediate the
                                        body&rsquo;s immune response. Adequate
                                        levels of GSH are necessary for the
                                        activation and functioning of these
                                        immune cells.
                                    </BioType>
                                </div>
                            </div>
                        </div>
                        <div
                            className={`w-full mx-auto md:w-1/3 md:justify-center animate-slideRight`}
                        >
                            <ContinueButton
                                onClick={pushToNextRoute}
                                buttonLoading={buttonLoading}
                            />
                        </div>
                        {/* )} */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default GlutathioneProcessComponent;
