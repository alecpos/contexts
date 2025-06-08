'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import GenericOnboardingStage from '../components/template';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface Props {
    product: PRODUCT_HREF;
}

export default function EDIndividualFrequencySelectionComponent({
    product,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();

    const pushToNextRoute = (newURL: string, selection: string) => {
        const searchParams = new URLSearchParams(search);
        const newSearch = searchParams.toString();
        const pathWithoutLastSegment = fullPath
            .split('/')
            .slice(0, -1)
            .join('/');
        router.push(
            `${pathWithoutLastSegment}/${newURL}?${newSearch}&freqSelec=${selection}`
        );
    };

    const options = getOptionsPerProduct(product, pushToNextRoute);

    return <GenericOnboardingStage options={options} />;
}

function getOptionsPerProduct(
    product: PRODUCT_HREF,
    pushToNextRoute: (value: string, selection: string) => void
) {
    switch (product) {
        case PRODUCT_HREF.PEAK_CHEWS:
            return [
                {
                    specialTag: 'Better for spontaneous sex',
                    label: 'Before sex',
                    desc: 'Get hard and stay hard when you need - no planning required.',
                    chipLabel: 'From $4.97/use',
                    onClick: () =>
                        pushToNextRoute('ed-product-display', 'as-needed'),
                },
                {
                    label: 'Daily',
                    desc: "For when you've got a plan and need to stick to it.",
                    chipLabel: 'From $1.99/day',
                    onClick: () =>
                        pushToNextRoute('ed-product-display', 'daily'),
                },
            ];
    }
}
