import { Chip } from '@mui/material';
import BioType from '../../../global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '../../../global-components/dividers/horizontalDivider/horizontalDivider';
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import {
    EDCadenceData,
    EDSelectionMetadata,
} from '../utils/ed-selection-index';
import EDCadenceSelectionOption from './checkout-cadence-selection-option';

interface Props {
    product_name: string;
    cadenceData: EDCadenceData;
    userProfileData: ProfileDataIntakeFlowCheckout;
    priceData: EDCadenceData[];
    changeSelectedCadence: (newCadenceData: EDCadenceData) => void;
    edSelectionData: EDSelectionMetadata;
}

export default function EDProductItemDisplay({
    product_name,
    cadenceData,
    userProfileData,
    priceData,
    changeSelectedCadence,
    edSelectionData,
}: Props) {
    const renderCadenceToChip = () => {
        switch (cadenceData.cadence) {
            case 'monthly':
                return 'month';
            case 'quarterly':
                return '3 months';
            case 'biannually':
                return '6 months';
        }
    };

    return (
        <>
            <div className='flex flex-row p-0 gap-4 w-full -mt-2 md:-mt-4'>
                <div className='flex flex-col w-full gap-y-2 md:gap-y-4'>
                    <div className='flex justify-between gap-4'>
                        <div className='flex flex-col'>
                            <BioType className='it-subtitle md:itd-subtitle'>
                                {userProfileData.first_name}&apos;s Treatment
                            </BioType>

                            <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                                {product_name}
                            </BioType>

                            <BioType
                                className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#666666]`}
                            >
                                {edSelectionData.dosage} (
                                {edSelectionData.quantity} tablets)
                            </BioType>
                        </div>
                    </div>

                    <div className='w-full h-[1px] mb-1'>
                        <HorizontalDivider
                            backgroundColor={'#1B1B1B1F'}
                            height={1}
                        />
                    </div>

                    {/**
                     * Make it here - cadence selector
                     */}
                    <div className='flex flex-col w-full gap-4'>
                        <BioType className='it-input md:itd-input'>
                            Shipping Frequency
                        </BioType>

                        <div className='flex flex-col gap-2'>
                            {priceData.map((priceDataRecord, index) => {
                                return (
                                    <EDCadenceSelectionOption
                                        changeSelectedCadence={
                                            changeSelectedCadence
                                        }
                                        variantRecord={priceDataRecord}
                                        key={index}
                                        currentSelectedCadence={
                                            cadenceData.cadence
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className='w-full h-[1px] mb-1'>
                        <HorizontalDivider
                            backgroundColor={'#1B1B1B1F'}
                            height={1}
                        />
                    </div>

                    <div className='flex justify-between items-center'>
                        <div className='w-[50%] md:w-full text-wrap'>
                            <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                                Provider evaluation
                            </BioType>
                        </div>

                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#3BB927]`}
                        >
                            FREE
                        </BioType>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className='w-[50%] md:w-full text-wrap'>
                            <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                                Free check ins
                            </BioType>
                        </div>

                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#3BB927]`}
                        >
                            FREE
                        </BioType>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className='w-[50%] md:w-full text-wrap'>
                            <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                                Free shipping
                            </BioType>
                        </div>

                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#3BB927]`}
                        >
                            FREE
                        </BioType>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className='w-[50%] md:w-full text-wrap'>
                            <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                                Ongoing medical support & shipping
                            </BioType>
                        </div>

                        <BioType
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-[#3BB927]`}
                        >
                            FREE
                        </BioType>
                    </div>

                    <div className='w-full h-[1px] my-1'>
                        <HorizontalDivider
                            backgroundColor={'#1B1B1B1F'}
                            height={1}
                        />
                    </div>
                    <div className='flex flex-col items-center gap-2'>
                        <div className='flex flex-row justify-between w-full'>
                            <BioType className='it-body md:itd-body'>
                                Total
                            </BioType>
                            <BioType className='it-body md:itd-body'>
                                ${cadenceData.price_data.product_price}
                            </BioType>
                        </div>
                        <Chip
                            variant='filled'
                            size='medium'
                            label={`Refills every ${renderCadenceToChip()}, cancel anytime`}
                            sx={{
                                marginX: 'auto',
                                background:
                                    'linear-gradient(90deg, #3B8DC5, #59B7C1)',
                                color: 'white', // Optional: Set text color to white for better visibility
                            }}
                        />
                    </div>

                    <div className='w-full h-[1px] my-1'>
                        <HorizontalDivider
                            backgroundColor={'#1B1B1B1F'}
                            height={1}
                        />
                    </div>
                    <div className='flex justify-between'>
                        <BioType className={`it-input md:itd-input`}>
                            DUE TODAY
                        </BioType>
                        <BioType className={`it-input md:itd-input`}>
                            $00.00
                        </BioType>
                    </div>
                </div>
            </div>
        </>
    );
}
