'use client';

import { createSetupIntentServer } from '@/app/services/stripe/setupIntent';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { updateStripeMetadataForOrder } from '@/app/utils/database/controller/orders/orders-api';
import IntakeLoadingComponent from '../../loading/intake-loading';
import EDCheckoutComponent from './ed-checkout-component';
import useSWR from 'swr';
import { getPriceVariantsForED } from '../utils/getVariantsForED';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { EDSelectionMetadata } from '../utils/ed-selection-index';

interface CheckoutContainerProps {
    order_data: any;
    user_id: string;
    user_email: string;
    user_profile_data: any;
}

export default function EDCheckoutContainer({
    order_data,
    user_id,
    user_email,
    user_profile_data,
}: CheckoutContainerProps) {
    const [order, setOrder] = useState<any>(order_data);
    const [stripeMetadata, setStripeMetadata] = useState<any>(
        order?.stripe_metadata ?? null,
    );
    const [priceData, setPriceData] = useState<
        | {
              variant: any;
              price_data: any;
              variant_index: any;
              cadence: any;
              stripe_price_ids: any;
              product_href: any;
          }[]
        | undefined
    >(undefined);

    const edSelectionData: EDSelectionMetadata =
        order_data.metadata.edSelectionData;

    console.log(edSelectionData);

    const { data, isLoading } = useSWR(
        `${edSelectionData.productHref}-checkout-data`,
        () =>
            getPriceVariantsForED(
                edSelectionData.dosage,
                edSelectionData.quantity,
                edSelectionData.frequency,
                edSelectionData.productHref,
            ),
    );

    useEffect(() => {
        if (data) {
            setPriceData(data);
        }
    }, [data]);

    useEffect(() => {
        if (!stripeMetadata || !stripeMetadata.setupIntentId) {
            (async () => {
                const setupIntent = JSON.parse(await createSetupIntentServer());

                if (!setupIntent) {
                    console.log('error in creating setup intent');
                    return {
                        order: null,
                        error: 'error in creating setup intent.',
                    };
                }
                setStripeMetadata({
                    clientSecret: setupIntent.client_secret,
                    paymentMethodId: '',
                    setupIntentId: setupIntent.id,
                });

                updateStripeMetadataForOrder(order_data.id, {
                    clientSecret: setupIntent.client_secret,
                    paymentMethodId: '',
                    setupIntentId: setupIntent.id,
                });
            })();
        }
    });

    if (isLoading || !priceData) {
        return <LoadingScreen />;
    }

    return (
        <>
            {stripeMetadata?.clientSecret ? (
                <Elements
                    stripe={loadStripe(
                        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
                    )}
                    options={{
                        clientSecret: stripeMetadata.clientSecret,
                        fonts: [
                            {
                                family: 'Tw Cen MT Pro SemiMedium',
                                src: 'url(/fonts/tw_cent/twc-pro-semimedium.woff2)',
                                weight: '400',
                            },
                        ],
                    }}
                >
                    <EDCheckoutComponent
                        session_id={user_id}
                        userEmail={user_email}
                        userProfileData={user_profile_data}
                        setupIntentId={stripeMetadata.setupIntentId}
                        currentOrderId={order_data.id}
                        clientSecret={stripeMetadata.clientSecret}
                        orderData={order_data}
                        priceData={priceData}
                        edSelectionData={edSelectionData}
                    />
                </Elements>
            ) : (
                <IntakeLoadingComponent />
            )}
        </>
    );
}
