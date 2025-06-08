'use client';

import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { getIntakeURLParams } from '../intake-functions';
import React, { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '../buttons/ContinueButton';
import { TRANSITION_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';
import DosageCard from '../semaglutide/dosage-card';
import { continueButtonExitAnimation } from '../intake-animations';
interface WeightlossDosageProps {}

export default function WeightlossDosageComponent({}: WeightlossDosageProps) {
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

    const [selectedDosage, setSelectedDosage] = useState<number>(0.25);

    return (
        <>
            <div className={`justify-center flex animate-slideRight`}>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-6">
                        <BioType
                            className={`${TRANSITION_HEADER_TAILWIND} !text-primary`}
                        >
                            Please confirm the weekly dosing protocol you&apos;d
                            like to request.
                        </BioType>

                        <div className="flex flex-col gap-[22px] mb-[100px] md:mb-0">
                            <DosageCard
                                dose={0.25}
                                price={219}
                                selectedDosage={selectedDosage}
                                setSelectedDosage={setSelectedDosage}
                            />
                            <DosageCard
                                dose={0.5}
                                price={219}
                                selectedDosage={selectedDosage}
                                setSelectedDosage={setSelectedDosage}
                            />
                            <DosageCard
                                dose={1}
                                price={219}
                                selectedDosage={selectedDosage}
                                setSelectedDosage={setSelectedDosage}
                            />
                            <DosageCard
                                dose={1.25}
                                price={219}
                                selectedDosage={selectedDosage}
                                setSelectedDosage={setSelectedDosage}
                            />
                            <DosageCard
                                dose={1.5}
                                price={219}
                                selectedDosage={selectedDosage}
                                setSelectedDosage={setSelectedDosage}
                            />
                            <DosageCard
                                dose={1.75}
                                price={399}
                                selectedDosage={selectedDosage}
                                setSelectedDosage={setSelectedDosage}
                            />
                            <DosageCard
                                dose={2.5}
                                price={219}
                                selectedDosage={selectedDosage}
                                setSelectedDosage={setSelectedDosage}
                            />
                        </div>
                        <ContinueButton
                            onClick={pushToNextRoute}
                            buttonLoading={buttonLoading}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
