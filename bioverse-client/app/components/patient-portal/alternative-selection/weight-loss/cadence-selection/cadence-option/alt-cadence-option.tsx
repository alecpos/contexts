'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface CadenceOptionProps {
    cadence: string;
    priceDisplay: string;
    selectedCadence: string;
    handleCadenceOptionSelection: (cadence: string) => void;
}

export default function CadenceOptionComponent({
    cadence,
    priceDisplay,
    selectedCadence,
    handleCadenceOptionSelection,
}: CadenceOptionProps) {
    const getTopLineText = () => {
        switch (cadence) {
            case 'monthly':
                return `Monthly (${priceDisplay}/month)`;
            case 'quarterly':
                return `Quarterly (${priceDisplay}/month)`;
        }
    };

    const getBottomLineText = () => {
        switch (cadence) {
            case 'monthly':
                return 'Billed every month';
            case 'quarterly':
                return 'Billed every 3 months';
        }
    };

    return (
        <>
            <div
                className={`flex flex-col gap-1 px-6 py-4 bg-white border-solid border-2 ${
                    selectedCadence === cadence
                        ? 'border-primary'
                        : 'border-[#BDBDBD]'
                } rounded-md hover:cursor-pointer`}
                onClick={() => {
                    handleCadenceOptionSelection(cadence);
                }}
            >
                <BioType className='it-body md:itd-body'>
                    {getTopLineText()}
                </BioType>
                <BioType className='it-body md:itd-body text-[#00000099]'>
                    {getBottomLineText()}
                </BioType>
            </div>
        </>
    );
}
