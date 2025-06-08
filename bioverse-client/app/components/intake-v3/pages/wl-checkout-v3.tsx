'use client';

import { createSetupIntentServer } from '@/app/services/stripe/setupIntent';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import IntakeLoadingComponent from '../loading/intake-loading';
import { updateStripeMetadataForOrder } from '@/app/utils/database/controller/orders/orders-api';
import WLCheckoutV2 from '../checkout/wl-checkout-component';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';

interface WLCheckoutContainerProps {
    order_data: any;
    user_id: string;
    user_email: string;
    product_data: {
        product_href: string;
        variant: number;
        subscriptionType: string;
        discountable: boolean;
    };
    user_profile_data: any;
    priceData: ProductVariantRecord[];
    productInformationData: any;
    weightlossGoal: string;
    selectedDose: string;
    variantPriceData: Partial<ProductVariantRecord>;
}

export default function WLCheckoutContainer({
    order_data,
    user_id,
    user_email,
    product_data,
    user_profile_data,
    priceData,
    productInformationData,
    weightlossGoal,
    selectedDose,
    variantPriceData,
}: WLCheckoutContainerProps) {
    const [order, setOrder] = useState<any>(order_data);
    const [stripeMetadata, setStripeMetadata] = useState<any>(
        order?.stripe_metadata ?? null
    );

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

    return (
        <div className='flex w-full max-w-[100vw] shrink-0'>
            {stripeMetadata?.clientSecret ? (
                <Elements
                    stripe={loadStripe(
                        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
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
                    <WLCheckoutV2
                        session_id={user_id}
                        userEmail={user_email}
                        userProfileData={user_profile_data}
                        product_data={product_data}
                        priceData={priceData}
                        setupIntentId={stripeMetadata.setupIntentId}
                        currentOrderId={order_data.id}
                        clientSecret={stripeMetadata.clientSecret}
                        productInformationData={productInformationData}
                        shouldDiscount={product_data.discountable}
                        orderData={order_data}
                        weightlossGoal={weightlossGoal}
                        selectedDose={selectedDose}
                        variantPriceData={variantPriceData}
                    />
                </Elements>
            ) : (
                <IntakeLoadingComponent />
            )}
        </div>
    );
}
