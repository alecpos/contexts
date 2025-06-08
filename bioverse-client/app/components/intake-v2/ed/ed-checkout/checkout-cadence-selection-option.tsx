'use client';

import { Radio } from '@mui/material';
import { EDCadenceData } from '../utils/ed-selection-index';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface CadenceSelectionOptionProps {
    variantRecord: EDCadenceData;
    changeSelectedCadence: (newCadenceData: EDCadenceData) => void;
    currentSelectedCadence: string;
}

export default function EDCadenceSelectionOption({
    variantRecord,
    currentSelectedCadence,
    changeSelectedCadence,
}: CadenceSelectionOptionProps) {
    const renderCadenceAsText = (cadence: string) => {
        switch (cadence) {
            case 'monthly':
                return 'Monthly';
            case 'quarterly':
                return 'Every 3 Months';
            case 'biannually':
                return 'Every 6 Months';
        }
    };

    const renderPriceAsMonthly = (cadence: string) => {
        switch (cadence) {
            case 'monthly':
                return variantRecord.price_data.product_price;
            case 'quarterly':
                return (variantRecord.price_data.product_price / 3).toFixed(2);
            case 'biannually':
                return (variantRecord.price_data.product_price / 6).toFixed(2);
        }
    };

    return (
        <div
            onClick={() => {
                changeSelectedCadence(variantRecord);
            }}
            className='rounded-md border-solid border-[2px] border-[#BDBDBD] flex flex-row justify-between py-2 px-3 text-center'
        >
            <div className='flex flex-row gap-1 items-center'>
                <Radio
                    checked={currentSelectedCadence === variantRecord.cadence}
                />
                <BioType className='it-input md:itd-input'>
                    {renderCadenceAsText(variantRecord.cadence)}
                </BioType>
            </div>

            <div className='flex flex-col items-center justify-center'>
                <BioType className='it-input md:itd-input text-primary'>
                    ${renderPriceAsMonthly(variantRecord.cadence)}/mo
                </BioType>
            </div>
        </div>
    );
}
