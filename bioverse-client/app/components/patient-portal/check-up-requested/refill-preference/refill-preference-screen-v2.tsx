'use client';

//ENTIRE FILE TO BE DELETED

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import DosageOptionV2 from './components/dosage-option-v2';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import { Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import auditCheckupForm from '@/app/utils/actions/check-up/check-up-actions';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import { getOrderStatusDetails } from '@/app/utils/functions/renewal-orders/renewal-orders';

interface RefillPreferenceScreenProps {
    patient_id: string;
    renewalOrder: RenewalOrder;
    price_data: (Partial<ProductVariantRecord> | null)[];
}

export default function RefillPreferenceScreenV2({
    patient_id,
    renewalOrder,
    price_data,
}: RefillPreferenceScreenProps) {
    const router = useRouter();
    const pathName = usePathname();

    // const {
    //     data: price_data,
    //     error: price_error,
    //     isLoading: price_loading,
    // } = useSWR(`${renewalOrder.renewal_order_id}-preference-screen`, () =>
    //     refillPreferenceScreenDataFetch(renewalOrder)
    // );

    const [selectedDosagePlan, setSelectedDosagePlan] = useState<number>(-1);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [lowerMonthlyPrice, setLowerMonthlyPrice] =
        useState<Partial<ProductVariantRecord> | null>(null);
    const [lowerBundlePrice, setLowerBundlePrice] =
        useState<Partial<ProductVariantRecord> | null>(null);
    const [higherMonthlyPrice, setHigherMonthlyPrice] =
        useState<Partial<ProductVariantRecord> | null>(null);
    const [higherBundlePrice, setHigherBundlePrice] =
        useState<Partial<ProductVariantRecord> | null>(null);
    const [maintenanceBundlePrice, setMaintenanceBundlePrice] =
        useState<Partial<ProductVariantRecord> | null>(null);
    const [lowerBiannuualPrice, setLowerBiannualPrice] =
        useState<Partial<ProductVariantRecord> | null>(null);
    const [higherBiannualPrice, setHigherBiannualPrice] =
        useState<Partial<ProductVariantRecord> | null>(null);

    //NEED TO FIGURE OUT WHAT MAINTENANCE BUNDLE IS AND HANDLE
    useEffect(() => {
        //we'll grab the first two monthly, quarterly, and biannual offers (for now)
        //assuming that each set of 2 is sorted from lowest to highest dosage
        let numMonthlyOffers: (Partial<ProductVariantRecord> | null)[] = [];
        let numQuarterlyOffers: (Partial<ProductVariantRecord> | null)[] = [];
        let numBiannualOffers: (Partial<ProductVariantRecord> | null)[] = [];

        for (let i = 0; i < price_data.length; i++) {
            switch (price_data[i]?.cadence) {
                case 'monthly':
                    if (numMonthlyOffers.length < 2) {
                        numMonthlyOffers.push(price_data[i]!);
                    }
                    break;
                case 'quarterly':
                    if (numQuarterlyOffers.length < 2) {
                        numQuarterlyOffers.push(price_data[i]!);
                    }
                    break;
                case 'biannually':
                    if (numBiannualOffers.length < 2) {
                        numBiannualOffers.push(price_data[i]!);
                    }
                    break;
                default:
                    break;
            }
        }

        setLowerMonthlyPrice(numMonthlyOffers[0]);
        setHigherMonthlyPrice(numMonthlyOffers[1]);

        setLowerBundlePrice(numQuarterlyOffers[0]);
        setHigherBundlePrice(numQuarterlyOffers[1]);

        setLowerBiannualPrice(numBiannualOffers[0]);
        setHigherBiannualPrice(numBiannualOffers[1]);

        // if (price_data) {
        //     setLowerMonthlyPrice(price_data[0]);
        //     setLowerBundlePrice(price_data[1]);
        //     setHigherMonthlyPrice(price_data[2]);
        //     setHigherBundlePrice(price_data[3]);
        //     if (price_data.length > 4) {
        //         setMaintenanceBundlePrice(price_data[4]);
        //     }
        // }
    }, [price_data]);

    const css_variables = {
        //Mobile
        container_width_mobile: '90vw',
        header_text_class_mobile: 'it-h1',
        button_container_class_mobile:
            'fixed md:static bottom-[25px] flex w-[90vw] md:w-full',

        //Desktop
        container_width_desktop: '500px',
        container_gap: '28px',
        logo_width: 170,
        logo_height: 41,
        header_text_class: 'itd-h1',
        body_text_class: 'itd-subtitle text-[#00000099] font-[20px]',
        button_sx: {
            height: '52px',
            backgroundColor: '#000000',
            '&:hover': {
                backgroundColor: '#666666',
            },
        },

        //Shared
        header_text_color: 'text-primary',
    };

    const css_class_names = {
        main_container: 'flex flex-col gap-[28px] w-[600px]',
    };

    const handleContinue = async () => {
        setButtonLoading(true);

        if (selectedDosagePlan > 0) {
            await auditCheckupForm(
                patient_id,
                undefined,
                undefined,
                'dosage_suggestion',
                {
                    product: renewalOrder.product_href,
                    options: {
                        lower_monthly: lowerMonthlyPrice?.variant,
                        lower_quarterly: lowerBundlePrice?.variant,
                        higher_monthly: higherMonthlyPrice?.variant,
                        higher_quarterly: higherBundlePrice?.variant,
                    },
                    selected_option: selectedDosagePlan,
                }
            );
            router.push(`${pathName}/${selectedDosagePlan}`);
        } else {
            setButtonLoading(false);
        }
    };

    const details = getOrderStatusDetails(renewalOrder.order_status);

    if (renewalOrder.dosage_selection_completed || details.isPaid) {
        return (
            <>
                <div
                    className={`flex flex-col mt-12 w-[${css_variables.container_width_mobile}] md:w-[${css_variables.container_width_desktop}] gap-[${css_variables.container_gap}]`}
                >
                    <div id='header-text'>
                        <BioType
                            className={`${css_variables.header_text_class_mobile} md:${css_variables.header_text_class} ${css_variables.header_text_color}`}
                        >
                            Your refill request is confirmed.
                        </BioType>
                    </div>

                    <div id='body-text'>
                        <BioType className={css_variables.body_text_class}>
                            A partner pharmacy will start processing your order
                            soon.
                        </BioType>
                    </div>

                    <div
                        id='continue-button'
                        className={css_variables.button_container_class_mobile}
                    >
                        <Button
                            fullWidth
                            variant='contained'
                            sx={css_variables.button_sx}
                            onClick={() => {
                                setButtonLoading(true);
                                router.push('/portal/order-history');
                            }}
                        >
                            {buttonLoading ? (
                                <CircularProgress
                                    sx={{ color: 'white' }}
                                    size={22}
                                />
                            ) : (
                                'Back to home'
                            )}
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className='flex w-[90vw] md:w-full justify-center  sm:px-0'>
            <div
                id='main-container'
                className='flex flex-col gap-[28px] w-full sm:w-[600px]'
            >
                <div className='flex flex-col'>
                    <div
                        id='header-text'
                        className='flex flex-col gap-2 w-full items-start mt-6 md:w-[520px] mx-auto'
                    >
                        <BioType className='inter-h5-regular'>
                            Please confirm your refill preference.
                        </BioType>
                    </div>
                </div>

                {price_data ? (
                    <div className='flex flex-col gap-[22px] md:w-[500px] mb-10 mt-4 mx-auto'>
                        <BioType className='inter-h5-regular text-[#181036] self-start text-[20px]'>
                            Option 1: Higher Dosage
                        </BioType>

                        {higherMonthlyPrice && (
                            <>
                                <DosageOptionV2
                                    priceData={higherMonthlyPrice}
                                    dosage={higherMonthlyPrice?.variant}
                                    renewalOrder={renewalOrder}
                                    selectedDosagePlan={selectedDosagePlan}
                                    setSelectedDosagePlan={
                                        setSelectedDosagePlan
                                    }
                                />
                            </>
                        )}

                        {higherBundlePrice && (
                            <>
                                <DosageOptionV2
                                    priceData={higherBundlePrice}
                                    dosage={higherMonthlyPrice?.variant} //we use Monthly here because 'variant' field for non-monthly variants is total mgs, not weekly mgs
                                    renewalOrder={renewalOrder}
                                    selectedDosagePlan={selectedDosagePlan}
                                    setSelectedDosagePlan={
                                        setSelectedDosagePlan
                                    }
                                />
                            </>
                        )}

                        {higherBiannualPrice && (
                            <>
                                <DosageOptionV2
                                    priceData={higherBiannualPrice}
                                    dosage={higherMonthlyPrice?.variant} //we use Monthly here because 'variant' field for non-monthly variants is total mgs, not weekly mgs
                                    renewalOrder={renewalOrder}
                                    selectedDosagePlan={selectedDosagePlan}
                                    setSelectedDosagePlan={
                                        setSelectedDosagePlan
                                    }
                                />
                            </>
                        )}

                        <hr className='border-t-1 border-slate-100 my-6' />

                        <BioType className='inter-h5-regular text-[#181036] self-start text-[20px]'>
                            Option 2: Lower Dosage
                        </BioType>

                        {lowerMonthlyPrice && (
                            <DosageOptionV2
                                priceData={lowerMonthlyPrice}
                                dosage={lowerMonthlyPrice?.variant} //we use Monthly here because 'variant' field for non-monthly variants is total mgs, not weekly mgs
                                renewalOrder={renewalOrder}
                                selectedDosagePlan={selectedDosagePlan}
                                setSelectedDosagePlan={setSelectedDosagePlan}
                            />
                        )}

                        {lowerBundlePrice && (
                            <DosageOptionV2
                                priceData={lowerBundlePrice}
                                dosage={lowerMonthlyPrice?.variant} //we use Monthly here because 'variant' field for non-monthly variants is total mgs, not weekly mgs
                                renewalOrder={renewalOrder}
                                selectedDosagePlan={selectedDosagePlan}
                                setSelectedDosagePlan={setSelectedDosagePlan}
                            />
                        )}

                        {lowerBiannuualPrice && (
                            <DosageOptionV2
                                priceData={lowerBiannuualPrice}
                                dosage={lowerMonthlyPrice?.variant} //we use Monthly here because 'variant' field for non-monthly variants is total mgs, not weekly mgs
                                renewalOrder={renewalOrder}
                                selectedDosagePlan={selectedDosagePlan}
                                setSelectedDosagePlan={setSelectedDosagePlan}
                            />
                        )}

                        {/* {maintenanceBundlePrice && (
                            <DosageOptionV2
                                priceData={maintenanceBundlePrice}
                                dosage={lowerMonthlyPrice?.variant}
                                renewalOrder={renewalOrder}
                                selectedDosagePlan={selectedDosagePlan}
                                setSelectedDosagePlan={setSelectedDosagePlan}
                            />
                        )} */}
                        <Button
                            variant='contained'
                            fullWidth
                            sx={{
                                height: '52px',
                                // '@media (min-width:768px)': {
                                //     width: '118px',
                                // },
                                // position: { xs: 'fixed', sm: 'static' },
                                // bottom: { xs: bottomXs, sm: 0 },
                                borderRadius: '12px',
                                zIndex: 30,
                                backgroundColor: '#000000',
                                '&:hover': {
                                    backgroundColor: '#666666',
                                },
                            }}
                            onClick={handleContinue}
                            className='inter-h5-bold normal-case text-sm'
                        >
                            {buttonLoading ? (
                                <CircularProgress
                                    sx={{ color: 'white' }}
                                    size={22}
                                />
                            ) : (
                                <BioType className='inter-h5-bold size-body-medium'>
                                    Continue
                                </BioType>
                            )}
                        </Button>
                    </div>
                ) : (
                    <>
                        <LoadingScreen />
                    </>
                )}
            </div>
        </div>
    );
}
