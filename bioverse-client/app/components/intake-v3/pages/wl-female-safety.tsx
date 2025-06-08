'use client';
import { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButtonV3 from '../buttons/ContinueButtonV3';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { Button, CircularProgress } from '@mui/material';
import { BaseOrder } from '@/app/types/orders/order-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

export default function WLFemaleSafetyComponent({
    orderData,
}: {
    orderData: BaseOrder;
}) {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const router = useRouter();

    const pushToNextRoute = () => {
        setButtonLoading(true);
        var nextRoute = getNextIntakeRoute(
            fullPath,
            'semaglutide',
            search,
            false,
            'none',
            '',
        );

        if (
            orderData.metadata.flowSelectedProduct === PRODUCT_HREF.SEMAGLUTIDE
        ) {
            router.push(
                `/intake/prescriptions/semaglutide/${nextRoute}?${search}`,
            );
        } else {
            router.push(
                `/intake/prescriptions/semaglutide/whats-next?${search}`,
            );
        }
    };

    const pushToOrderSummary = () => {
        router.push(
            `/intake/prescriptions/semaglutide/order-summary-v4?${search}`,
        );
    };
    return (
        <div className="flex flex-col gap-12 flex-1 mt-12">
            <div className="flex flex-col gap-6 self-stretch">
                <BioType className="inter-h5-question-header">
                    You&apos;re in good hands
                </BioType>
                <div className="flex flex-col gap-4">
                    <BioType className="intake-subtitle">
                        You should not take GLP-1s if you&apos;re planning on
                        becoming pregnant. It can take up to 6 weeks for GLP-1s
                        to be completely out of your body.
                    </BioType>
                    <BioType className="intake-subtitle">
                        If you&apos;re planning to conceive, stop GLP-1s at
                        least 2 months prior to conception or actively trying to
                        conceive a baby.
                    </BioType>
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        zIndex: 30,
                        backgroundColor: '#000000',
                        '&:hover': {
                            backgroundColor: '#666666',
                        },
                        borderRadius: '12px',
                        textTransform: 'none',
                    }}
                    onClick={pushToNextRoute}
                    className={`h-[3rem] md:h-[48px]
                `}
                >
                    {buttonLoading ? (
                        <CircularProgress sx={{ color: 'white' }} size={22} />
                    ) : (
                        <BioType className="intake-v3-form-label-bold">
                            I understand, continue
                        </BioType>
                    )}
                </Button>
                <BioType
                    className="intake-v3-form-label-bold flex justify-center hover:cursor-pointer"
                    onClick={pushToOrderSummary}
                >
                    View other treatment options
                </BioType>
            </div>
        </div>
    );
}
