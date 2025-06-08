import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { ProductVariantRecord } from '@/app/utils/database/controller/product_variants/product_variants';
import { Button } from '@mui/material';

interface ShippingFrequencyOptionProps {
    data: any;
    selected: boolean;
    setSelectedPriceIndex: React.Dispatch<React.SetStateAction<number>>;
    biannualEnabled: boolean;
    setOpenHSADialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ShippingFrequencyOption({
    data,
    selected,
    setSelectedPriceIndex,
    biannualEnabled,
    setOpenHSADialog,
}: ShippingFrequencyOptionProps) {
    if (!data.valid) {
        return;
    }

    const showMaxSavings =
        (biannualEnabled && data.type === 2) ||
        (!biannualEnabled && data.type === 1);

    return (
        <div className="w-full">
            {showMaxSavings && (
                <div className="inline-block ml-4 bg-[#CCFBB6] rounded-lg px-2 py-1 text-sm rounded-t-lg rounded-b-none">
                    <BioType className="intake-subtitle text-black">
                        MAX SAVINGS
                    </BioType>
                </div>
            )}
            <Button
                variant="outlined"
                sx={{
                    display: 'flex',
                    position: { md: 'relative' },
                    width: '100%',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: selected ? '2px solid' : '1px solid',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    color: 'black',
                    backgroundColor: selected
                        ? 'rgba(237, 250, 255, 0.40)'
                        : 'white',
                    borderColor: selected
                        ? '#8CCEEA'
                        : 'rgba(102, 102, 102, 0.20)',
                    //Nathan added textAlign setting - Apr 23, answer choices can now run over 2 lines.
                    textAlign: 'start',
                    textTransform: 'none',
                    '&:hover': {
                        // Adjust the breakpoint as needed
                        backgroundColor: !selected
                            ? 'rgba(237, 250, 255, 0.40)'
                            : undefined,
                        borderColor: '#8CCEEA',
                        borderWidth: selected ? '2px' : '1px',
                    },
                    '&:active': {
                        backgroundColor: selected
                            ? 'rgba(40, 106, 162, 0.1)'
                            : 'white',
                    },
                    '&:focus': {
                        backgroundColor: selected
                            ? 'rgba(40, 106, 162, 0.1)'
                            : undefined,
                    },
                }}
                onClick={() => {
                    setSelectedPriceIndex(data.type);
                }}
                className="px-[13px] py-[10px]"
            >
                <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center w-full ">
                        <BioType className={`intake-subtitle-bold`}>
                            {data.tag}
                        </BioType>
                        <div className="flex space-x-[8px] items-center">
                            {data.crossedOutPrice && (
                                <BioType className="intake-v3-question-text text-[#D11E66] md:text-[16px]">
                                    <s>${data.crossedOutPrice}</s>
                                </BioType>
                            )}
                            <BioType className="intake-subtitle-bold md:text-[18px]">
                                ${data.totalPrice}/mo
                            </BioType>
                        </div>
                    </div>
                    {selected && (
                        <div className="flex flex-col mt-[10px]">
                            <BioType className="intake-v3-question-text mb-1">
                                Plan breakdown:
                            </BioType>
                            <ul className="ml-5 ">
                                {data.planBreakdown.map(
                                    (item: any, index: number) => (
                                        <li key={index}>
                                            <BioType
                                                className={`${
                                                    index !== 0 && 'mt-1'
                                                } ${
                                                    index === 0
                                                        ? 'intake-subtitle-bold'
                                                        : 'intake-v3-question-text '
                                                } ${
                                                    index === 1 &&
                                                    'text-[#489C21]'
                                                }`}
                                            >
                                                {item}
                                            </BioType>
                                        </li>
                                    ),
                                )}
                            </ul>
                            <div className="flex justify-center bg-[#D7E3EB] px-[8px] py-[6px]  rounded-[4px] mt-[10px] mb-1">
                                <BioType className="intake-v3-disclaimer-text text-center">
                                    Cancel or change your plan anytime
                                </BioType>
                            </div>
                            <div className="flex justify-center items-center space-x-2 mt-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="21"
                                    height="21"
                                    viewBox="0 0 21 21"
                                    fill="none"
                                >
                                    <path
                                        d="M18.8385 9.70425V10.4709C18.8375 12.2679 18.2556 14.0165 17.1797 15.4558C16.1037 16.8951 14.5913 17.948 12.868 18.4575C11.1447 18.967 9.30293 18.9058 7.61727 18.2831C5.93161 17.6603 4.49242 16.5093 3.51434 15.0018C2.53626 13.4943 2.0717 11.711 2.18994 9.91784C2.30818 8.12472 3.00288 6.41785 4.17044 5.05181C5.338 3.68577 6.91586 2.73373 8.6687 2.3377C10.4215 1.94167 12.2554 2.12286 13.8969 2.85425M18.8385 3.80426L10.5052 12.1459L8.00521 9.64593"
                                        stroke="#AFDBA1"
                                        stroke-width="1.01733"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                </svg>
                                <BioType
                                    className="intake-subtitle text-black underline underline-weak hover:cursor-pointer"
                                    onClick={() => setOpenHSADialog(true)}
                                >
                                    FSA/HSA{' '}
                                    <span className="text-weak">
                                        eligible for reimbursement
                                    </span>
                                </BioType>
                            </div>
                        </div>
                    )}
                </div>
            </Button>
        </div>
    );
}
