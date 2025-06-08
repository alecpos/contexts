'use client';
import { memo, useCallback, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import FirstTimeDosingOption from './components/FirstTimeDosingOption';
import { DosingChangeEquivalenceOptionMetadata } from '@/app/utils/classes/DosingChangeController/DosageChangeConstantIndex';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { BaseOrderInterface } from '@/app/types/orders/order-types';
import { useRouter } from 'next/navigation';

interface DosageSelectionFirstTimeProps {
    dosingOption: DosingChangeEquivalenceOptionMetadata;
    priceData: (Partial<ProductVariantRecord> | null)[];
    product_href: PRODUCT_HREF;
    order: BaseOrderInterface;
}

export default function DosageSelectionFirstTime({
    dosingOption,
    priceData,
    product_href,
    order,
}: DosageSelectionFirstTimeProps) {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [selectedDosagePlan, setSelectedDosagePlan] = useState<number>(-1);
    const [step, setStep] = useState<number>(0);
    const router = useRouter();

    const handleContinue = async () => {
        setButtonLoading(true);
        if (selectedDosagePlan === -1) {
            setButtonLoading(false);
            return;
        }

        router.push(
            `/dosage/first-time/${order.id}/${priceData[selectedDosagePlan]?.variant_index}`
        );
    };

    const renderDosageOptions = () => {
        if (!priceData) return null;

        const dosage = priceData.at(-1)?.variant;
        return priceData.map((item, index) => (
            <FirstTimeDosingOption
                priceData={item}
                product_href={product_href}
                dosage={dosage}
                selectedDosagePlan={selectedDosagePlan}
                setSelectedDosagePlan={setSelectedDosagePlan}
                index={index}
                key={index}
            />
        ));
    };

    return (
        <div className='flex w-full  justify-center mt-16'>
            <div className='flex flex-col items-center w-full md:max-w-[447px]'>
                <div id='header-text' className='flex w-full self-start mb-8'>
                    <BioType className='inter-h5-question-header ml-2 md:ml-0'>
                        Please confirm your dosing preference.
                    </BioType>
                </div>

                <div className='flex flex-col gap-[22px] items-center mb-10 w-full'>
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
                            width: '90%',
                            '@media (min-width:768px)': {
                                width: '467px',
                            },
                        }}
                        className='normal-case intake-v3-form-label-bold'
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
            </div>
        </div>
    );
}
