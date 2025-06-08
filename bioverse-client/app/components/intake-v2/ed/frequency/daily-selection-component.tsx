'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ImageCollection from '../components/image-collection';
import GenericOnboardingStage from '../components/template';

export default function DailySelectionComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const [showLoadingComponent, SetShowLoadingComponent] =
        useState<boolean>(false);

    const pushToNextRoute = (newURL: string) => {
        const searchParams = new URLSearchParams(search);
        const newSearch = searchParams.toString();
        router.push(`${fullPath}/${newURL}?${newSearch}`);
    };

    const handleOptionClick = (newURL: string) => {
        SetShowLoadingComponent(true);
        setTimeout(() => pushToNextRoute(newURL), 3000);
    };

    const options = [
        {
            specialTag: 'Most Popular',
            label: 'Fast-acting Treatment',
            desc: 'Rapid-dissolving Rx options that get you hard faster.',
            chipLabel: 'From $1.99/use',
            onClick: () => handleOptionClick('fast-acting'),
            image: '/img/product-images/prescriptions/roundYellow.png',
        },
        {
            label: 'Standard Pill',
            desc: 'Rx ingredients in a pill option',
            chipLabel: 'From $1.05/use',
            onClick: () => handleOptionClick('standard'),
            image: '/img/product-images/prescriptions/roundOrange.png',
        },
    ];

    return (
        <>
            {showLoadingComponent ? (
                <ImageCollection />
            ) : (
                <GenericOnboardingStage options={options} />
            )}
        </>
    );
}
