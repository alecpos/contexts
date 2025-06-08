'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import DosageOption from './components/dosage-option';
import DosageOptionV2 from './components/dosage-option-v2';
import Image from 'next/image';
import { RenewalOrder } from '@/app/types/renewal-orders/renewal-orders-types';
import { Button, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { VariantProductPrice } from '@/app/types/product-prices/product-prices-types';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import auditCheckupForm from '@/app/utils/actions/check-up/check-up-actions';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import { getOrderStatusDetails } from '@/app/utils/functions/renewal-orders/renewal-orders';
import { DoubleDosageSelectionType } from './utils/refill-preference-screen-data-fetch';

interface RefillPreferenceScreenProps {
    patient_id: string;
    renewalOrder: RenewalOrder;
    price_data: DoubleDosageSelectionType;
    plan?: any;
    quvi?: any;
}

export default function RefillPreferenceScreen({
    patient_id,
    renewalOrder,
    price_data,
    plan, //sometimes only only a subset of priceData.higherdosages or priceData.lowerdosages should be diplayed
    quvi,
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
    const [lowerDosagePrices, setLowerDosagePrices] = useState<
        Partial<ProductVariantRecord>[]
    >([]);
    const [higherDosagePrices, setHigherDosagePrices] = useState<
        Partial<ProductVariantRecord>[]
    >([]);

    useEffect(() => {
        if (price_data) {
            setLowerDosagePrices(price_data.lower_dosages.dosage_list);
            setHigherDosagePrices(price_data.higher_dosages.dosage_list);
        }
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
                    options: [
                        ...price_data.lower_dosages.dosage_list.map(
                            (v) => v.variant_index
                        ),
                        ...price_data.higher_dosages.dosage_list.map(
                            (v) => v.variant_index
                        ),
                    ],
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
        <div className='flex w-full md:w-[447px]  justify-center  mt-[3rem] md:mt-[48px] sm:px-0 '>
            <div
                id='main-container'
                className='flex flex-col  w-full sm:w-[600px max-w-[95vw] md:w-[447px] px-[1rem] md:px-0 '
            >
                <div className='flex flex-col mb-[2rem] md:mb-[37px] '>
                    {/* <div className="flex flex-col items-start justify-start w-full">
                        <Image
                            src={'/img/bioverse-logo-full.png'}
                            alt={'logo'}
                            width={170}
                            height={41}
                            unoptimized
                        />
                    </div> */}

                    <div
                        id='header-text'
                        className='flex flex-col w-full items-start  '
                    >
                        <BioType className='inter-h5-question-header'>
                            Please confirm your refill preference.
                        </BioType>
                        <BioType className='intake-subtitle mt-[0.75rem] md:mt-[12px]'>
                            For a limited time Bioverse is offering a discount
                            on your medication for longer term supplies.
                        </BioType>
                    </div>
                </div>

                {price_data ? (
                    <>
                        {!plan && (
                            <BioType className='intake-v3-18px-20px text-[#181036] self-start mb-[1rem] md:mb-[16px]'>
                                Option 1: Higher Dosage
                            </BioType>
                        )}
                        <div className='flex flex-col gap-[1rem] md:gap-[20px] w-full mb-10'>
                            {(!plan ||
                                plan ===
                                    price_data.higher_dosages.dosage.toString()) && (
                                <>
                                    {higherDosagePrices.map(
                                        (dosagePrice, index) => (
                                            <DosageOptionV2
                                                key={index}
                                                priceData={dosagePrice}
                                                dosage={String(
                                                    price_data.higher_dosages
                                                        .dosage
                                                )}
                                                renewalOrder={renewalOrder}
                                                selectedDosagePlan={
                                                    selectedDosagePlan
                                                }
                                                setSelectedDosagePlan={
                                                    setSelectedDosagePlan
                                                }
                                                quvi={quvi}
                                            />
                                        )
                                    )}
                                </>
                            )}

                            {!plan && (
                                <BioType className='intake-v3-18px-20px text-[#181036] self-start mt-[1rem] md:mt-[16px] '>
                                    Option 2: Lower Dosage
                                </BioType>
                            )}

                            {(!plan ||
                                plan ===
                                    price_data.lower_dosages.dosage.toString()) && (
                                <>
                                    {lowerDosagePrices.map(
                                        (dosagePrice, index) => (
                                            <DosageOptionV2
                                                key={index}
                                                priceData={dosagePrice}
                                                dosage={String(
                                                    price_data.lower_dosages
                                                        .dosage
                                                )}
                                                renewalOrder={renewalOrder}
                                                selectedDosagePlan={
                                                    selectedDosagePlan
                                                }
                                                setSelectedDosagePlan={
                                                    setSelectedDosagePlan
                                                }
                                                quvi={quvi}
                                            />
                                        )
                                    )}
                                </>
                            )}
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
                                    zIndex: 30,
                                    backgroundColor: '#000000',
                                    '&:hover': {
                                        backgroundColor: '#666666',
                                    },
                                    borderRadius: '12px',
                                }}
                                className='normal-case intake-v3-form-label-bold  '
                                onClick={handleContinue}
                            >
                                {buttonLoading ? (
                                    <CircularProgress
                                        sx={{ color: 'white' }}
                                        size={22}
                                    />
                                ) : (
                                    'Continue'
                                )}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <LoadingScreen />
                    </>
                )}
            </div>
        </div>
    );
}
