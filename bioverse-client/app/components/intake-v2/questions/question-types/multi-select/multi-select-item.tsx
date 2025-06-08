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
    intake: boolean;
    alternate_other_text?: string;
}

export default function MultiSelectItem({
    option,
    selected,
    handleCheckboxChange,
    showCheck,
    intake,
    alternate_other_text,
}: Props) {
    const shouldApplyAcknowledge =
        option ===
        'By checking this box, you acknowledge and understand that BIOVERSE is a telehealth clinic and does not replace the care or medical advice provided by a primary care provider.';

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
                padding: shouldApplyAcknowledge ? '1rem' : '0',
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
                <BioType
                    className={`${INTAKE_INPUT_TAILWIND} ml-2 ${
                        selected ? 'text-[#286BA2]' : 'text-[#1B1B1B]'
                    }`}
                >
                    {alternate_other_text ? alternate_other_text : option}
                </BioType>
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
