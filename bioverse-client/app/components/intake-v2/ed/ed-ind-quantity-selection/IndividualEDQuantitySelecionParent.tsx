'use client';

import { useState } from 'react';
import QuantityConfirmationList from '../confirmation/ed-quantity-selection';
import { Button, CircularProgress } from '@mui/material';
import { setOrderProductHrefForED } from '../utils/ed-order-update';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

interface ParentComponentProps {
    productHref: string;
}

export default function IndividualEDQuantitySelectionParent({
    productHref,
}: ParentComponentProps) {
    const [selectedQuantity, setSelectedQuantity] = useState<
        number | undefined
    >(undefined);
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.toString();

    const setQuantitySelection = (quantity: number) => {
        setSelectedQuantity(quantity);
    };

    const handleContinueButton = async () => {
        const searchParams = new URLSearchParams(search);
        const newSearch = searchParams.toString();
        setIsButtonLoading(true);
        await setOrderProductHrefForED(
            productHref,
            'as-needed',
            selectedQuantity,
        );
        router.push(
            `/intake/prescriptions/${productHref}/ed-pre-id?${newSearch}`,
        );
        return;
    };

    const renderData = getRenderDataForProduct(productHref as PRODUCT_HREF);

    return (
        <div className="flex flex-col w-full gap-4">
            <QuantityConfirmationList
                productHref={productHref}
                dosage={renderData?.dosage} //This will be static for now but needs to change if adding more individuals.
                setQuantitySelection={setQuantitySelection}
                selectedQuantity={selectedQuantity}
            />
            <Button
                variant="contained"
                sx={{
                    width: {
                        xs: 'calc(100vw - 44px)',
                        md: '520px',
                    },
                    height: '52px',
                    zIndex: 30,
                    backgroundColor: '#000000',
                    '&:hover': {
                        backgroundColor: '#666666',
                    },
                }}
                disabled={!selectedQuantity}
                onClick={handleContinueButton}
            >
                {isButtonLoading ? <CircularProgress /> : 'CONTINUE'}
            </Button>
        </div>
    );
}

const getRenderDataForProduct = (product: PRODUCT_HREF) => {
    switch (product) {
        case PRODUCT_HREF.PEAK_CHEWS:
            return {
                dosage: '8.5 mg',
            };
        case PRODUCT_HREF.X_CHEWS:
        case PRODUCT_HREF.X_MELTS:
            return {
                dosage: '100iu/5mg',
            };
        case PRODUCT_HREF.RUSH_MELTS:
            return {
                dosage: '81mg/12mg',
            };
        default:
            return {
                dosage: 'error',
            };
    }
};
