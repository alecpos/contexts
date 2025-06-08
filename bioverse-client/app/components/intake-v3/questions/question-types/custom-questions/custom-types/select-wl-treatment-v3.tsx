'use client';

import { useEffect, useState } from 'react';
import WLSelectionOptions from './components/wl-selection-options';
import SemaglutideOverviewComponent from './components/semaglutide-overview';
import MetforminOverviewComponent from './components/metformin-overview';
import TirzepatideOverviewComponent from './components/tirzepatide-overview';
import {
    getCombinedOrder,
    getCombinedOrderV2,
    getOrderForProduct,
    updateOrderMetadata,
} from '@/app/utils/database/controller/orders/orders-api';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { USStates } from '@/app/types/enums/master-enums';
import WLCapsuleOverviewComponent from './components/wl-capsule-overview';

interface SelectWLTreatmentProps {
    handleContinueButton: any;
}

export default function SelectWLTreatmentComponent({
    handleContinueButton,
}: SelectWLTreatmentProps) {
    const [selectedProduct, setSelectedProduct] = useState<string>();
    const [selectedColor, setSelectedColor] = useState<string>('#D5C4EA');
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const isVwoRoTest = localStorage.getItem('vwo_ids')?.includes('wl-ro-test');

    const colorMap: string[] = [
        '#D5C4EA',
        '#E3BBD6',
        '#E2BABA',
        '#E8EAC2',
        '#E5C8A1',
        '#AAC9A9',
        '#98D2EA',
    ];

    const pushToNextRoute = async () => {
        setIsButtonLoading(true);

        const user_id = (await readUserSession()).data.session?.user.id!;

        /**
         * @author Ben Hebert
         * getCombinedOrderV2 first checks if the have a 'weight-loss' product_href order, and if not, if they have any order with product_href === 'semaglutide' | 'tirzepatide' | 'metformin'
         * that has the selected_product metadata - which indicates that it is the order from a global wl flow that had its product_href swapped
         */
        const order_data = await getCombinedOrderV2(user_id);

        if (selectedProduct === PRODUCT_HREF.METFORMIN) {
            const patientState = searchParams.get('ptst') || 'n/a';

            if (
                patientState === USStates.NorthCarolina ||
                order_data?.state === USStates.NorthCarolina
            ) {
                router.push(
                    `/intake/prescriptions/weight-loss/unavailable-in-state?${searchParams.toString()}`
                );
                return;
            }
        }

        await updateOrderMetadata(
            { selected_product: selectedProduct },
            order_data!.id
        );

        handleContinueButton();
    };

    const selectProduct = (product: PRODUCT_HREF, color: string) => {
        setSelectedProduct(product);
        setSelectedColor(color);
    };

    const getPrice = (product_href: string) => {
        const state = searchParams.get('ptst') || 'n/a';

        if (product_href === PRODUCT_HREF.SEMAGLUTIDE) {
            if (state === USStates.California) {
                return '159';
            }

            return '129';
        } else if (product_href === PRODUCT_HREF.TIRZEPATIDE) {
            if (state === USStates.California) {
                return '234';
            }

            return '229';
        }
        return '';
    };

    const renderSelectionConfirmation = (color: string) => {
        switch (selectedProduct) {
            case 'semaglutide':
                return (
                    <SemaglutideOverviewComponent
                        handleContinueButton={pushToNextRoute}
                        isButtonLoading={isButtonLoading}
                        setSelectedProduct={setSelectedProduct}
                        getPrice={getPrice}
                        color={color}
                    />
                );
            case 'tirzepatide':
                return (
                    <TirzepatideOverviewComponent
                        handleContinueButton={pushToNextRoute}
                        isButtonLoading={isButtonLoading}
                        setSelectedProduct={setSelectedProduct}
                        getPrice={getPrice}
                        color={color}
                    />
                );
            case 'metformin':
                return (
                    <MetforminOverviewComponent
                        handleContinueButton={pushToNextRoute}
                        isButtonLoading={isButtonLoading}
                        setSelectedProduct={setSelectedProduct}
                        color={color}
                    />
                );
            case 'wl-capsule':
                return (
                    <WLCapsuleOverviewComponent
                        handleContinueButton={pushToNextRoute}
                        isButtonLoading={isButtonLoading}
                        setSelectedProduct={setSelectedProduct}
                        color={color}
                    />
                );
        }
    };

    return (
        <>
            {!selectedProduct && (
                <WLSelectionOptions
                    setSelectedProduct={selectProduct}
                    getPrice={getPrice}
                    isVwoRoTest={isVwoRoTest ?? false}
                    colorMap={colorMap}
                />
            )}
            {selectedProduct && renderSelectionConfirmation(selectedColor)}
        </>
    );
}
