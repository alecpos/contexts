import React from 'react';
import Button from '@mui/material/Button';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import CheckIcon from '@mui/icons-material/Check';
import { INTAKE_INPUT_TAILWIND } from '../../../styles/intake-tailwind-declarations';

interface Props {
    option: string;
    selected: boolean;
    handleCheckboxChange: (option: string) => void;
    showCheck: boolean;
    customOptionStyle: string;
}

export default function CustomStyledMultiSelectItem({
    option,
    selected,
    handleCheckboxChange,
    showCheck,
    customOptionStyle,
}: Props) {
    /**
     *  <BioType
                    className={`${INTAKE_INPUT_TAILWIND} ml-2 ${
                        selected ? 'text-[#286BA2]' : 'text-[#1B1B1B]'
                    }`}
                >
                    
                </BioType>
     */

    const renderCustomOptionContent = () => {
        switch (customOptionStyle) {
            case 'tretinoin-react':
                const customTextArray = option.split(';');
                return (
                    <div className='flex flex-col py-3 px-2 gap-0.5'>
                        <BioType
                            className={`${INTAKE_INPUT_TAILWIND} ml-2 ${
                                selected ? 'text-[#286BA2]' : 'text-[#1B1B1B]'
                            }`}
                        >
                            {customTextArray[0]}
                        </BioType>
                        <BioType
                            className={`it-body itd-body ml-2 ${
                                selected ? 'text-[#286BA2]' : 'text-[#1B1B1B]'
                            }`}
                        >
                            {customTextArray[1]}
                        </BioType>
                        <BioType
                            className={`it-body md:itd-body ml-2 
                                text-[#286BA2]`}
                        >
                            {customTextArray[2]}
                        </BioType>
                    </div>
                );
            default:
                return (
                    <BioType
                        className={`${INTAKE_INPUT_TAILWIND} ml-2 ${
                            selected ? 'text-[#286BA2]' : 'text-[#1B1B1B]'
                        }`}
                    >
                        {option}
                    </BioType>
                );
        }
    };

    return (
        <Button
            variant='outlined'
            sx={{
                display: 'flex',
                position: { md: 'relative' },
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: { xs: '16.1vw', sm: '84px' },
                border: '1px solid',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                padding: '0',
                backgroundColor: selected ? 'rgba(40, 106, 162, 0.1)' : 'white',
                borderColor: selected ? 'rgba(40, 106, 162, 1)' : '#BDBDBD',
                //Nathan added textAlign setting - Apr 23, answer choices can now run over 2 lines.
                textAlign: 'start',
                textTransform: 'none',
                '&:hover': {
                    '@media (min-width: 2008px)': {
                        // Adjust the breakpoint as needed
                        backgroundColor: !selected ? '#CEE1F1' : undefined,
                        borderColor: !selected ? '#286BA2' : undefined,
                    },
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
                handleCheckboxChange(option);
            }}
        >
            <div className='flex justify-between items-center w-full'>
                {renderCustomOptionContent()}
                {showCheck && (
                    <div className='mr-5 mt-1'>
                        {selected && (
                            <CheckIcon
                                fontSize='small'
                                sx={{ color: 'rgba(40, 106, 162, 1)' }}
                            />
                        )}
                    </div>
                )}
            </div>
        </Button>
    );
}
