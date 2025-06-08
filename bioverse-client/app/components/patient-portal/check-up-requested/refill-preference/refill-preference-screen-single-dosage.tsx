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

interface RefillPreferenceScreenProps {
    patient_id: string;
    renewalOrder: RenewalOrder;
    price_data: (Partial<ProductVariantRecord> | null)[];
}

export default function RefillPreferenceScreenSingleDosage({
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
    const [priceData, setPriceData] = useState<
        (Partial<ProductVariantRecord> | null)[]
    >([]);

    useEffect(() => {
        if (price_data) {
            setPriceData(price_data);
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
                        variant_indexes:
                            renewalOrder.dosage_suggestion_variant_indexes,
                    },
                    selected_option: selectedDosagePlan,
                }
            );
            router.push(`${pathName}/${selectedDosagePlan}`);
        } else {
            setButtonLoading(false);
        }
    };

    if (renewalOrder.dosage_selection_completed) {
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

    const renderDosageOptions = () => {
        if (!priceData) {
            return;
        }

        const dosage = priceData[0]?.variant;

        return priceData.map((item, index) => {
            return (
                <DosageOptionV2
                    priceData={item}
                    dosage={dosage}
                    renewalOrder={renewalOrder}
                    selectedDosagePlan={selectedDosagePlan}
                    setSelectedDosagePlan={setSelectedDosagePlan}
                    key={index}
                />
            );
        });
    };

    return (
        <div className='flex w-full md:w-[447px]  justify-center  mt-[3rem] md:mt-[48px] sm:px-0 '>
            <div
                id='main-container'
                className='flex flex-col gap-[28px] w-full sm:w-[600px]'
            >
                <div className='flex flex-col'>
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
                        className='flex flex-col gap-2 w-full items-start mt-6'
                    >
                        <BioType className='inter-h5-question-header'>
                            Please confirm your refill preference.
                        </BioType>
                    </div>
                </div>

                {price_data ? (
                    <div className='flex flex-col gap-[22px] w-full mb-10'>
                        {renderDosageOptions()}

                        <Button
                            variant='contained'
                            fullWidth
                            sx={{
                                height: '52px',
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
                ) : (
                    <>
                        <LoadingScreen />
                    </>
                )}
            </div>
        </div>
    );
}
