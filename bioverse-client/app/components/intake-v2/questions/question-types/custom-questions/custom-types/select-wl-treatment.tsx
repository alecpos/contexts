'use client';

import { useEffect, useState } from 'react';
import WLSelectionOptions from './components/wl-selection-options';
import SemaglutideOverviewComponent from './components/semaglutide-overview';
import MetforminOverviewComponent from './components/metformin-overview';
import TirzepatideOverviewComponent from './components/tirzepatide-overview';
import {
    getCombinedOrderV2,
    updateOrderMetadata,
} from '@/app/utils/database/controller/orders/orders-api';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { useRouter, useSearchParams } from 'next/navigation';
import { USStates } from '@/app/types/enums/master-enums';

interface SelectWLTreatmentProps {
    handleContinueButton: any;
}

export default function SelectWLTreatmentComponent({
    handleContinueButton,
}: SelectWLTreatmentProps) {
    const [selectedProduct, setSelectedProduct] = useState<string>();
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    const searchParams = useSearchParams();
    const router = useRouter();

    const pushToNextRoute = async () => {
        setIsButtonLoading(true);

        const user_id = (await readUserSession()).data.session?.user.id!;

        /**
         * @author Ben Hebert
         * getCombinedOrderV2 first checks if the have a 'weight-loss' product_href order, and if not, if they have any order with product_href === 'semaglutide' | 'tirzepatide' | 'metformin'
         * if they have multiple orders with semaglutide, for example (maybe because they have 1 incomplete sem intake and 1 incomplete global wl intake where sem got swapped), it will
         * only return the sem order that has selected_product === 'semaglutide' (that was created by the global wl funnel) and it will ignore the other sem order
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

    const selectProduct = (product: PRODUCT_HREF) => {
        setSelectedProduct(product);
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

    const renderSelectionConfirmation = () => {
        switch (selectedProduct) {
            case 'semaglutide':
                return (
                    <SemaglutideOverviewComponent
                        handleContinueButton={pushToNextRoute}
                        isButtonLoading={isButtonLoading}
                        getPrice={getPrice}
                    />
                );
            case 'tirzepatide':
                return (
                    <TirzepatideOverviewComponent
                        handleContinueButton={pushToNextRoute}
                        isButtonLoading={isButtonLoading}
                        getPrice={getPrice}
                    />
                );
            case 'metformin':
                return (
                    <MetforminOverviewComponent
                        handleContinueButton={pushToNextRoute}
                        isButtonLoading={isButtonLoading}
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
                />
            )}
            {selectedProduct && renderSelectionConfirmation()}
        </>
    );
}
