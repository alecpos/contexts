import React from 'react';
import Button from '@mui/material/Button';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import CheckIcon from '@mui/icons-material/Check';
import { INTAKE_INPUT_TAILWIND } from '@/app/components/intake-v2/styles/intake-tailwind-declarations';

interface Props {
    option: string;
    selected: boolean;
    handleCheckboxChange: (option: string) => void;
    showCheck: boolean;
    intake: boolean;
    alternate_other_text?: string;
}

export default function MultiSelectItemV3({
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

    const minHeight = option.includes('I agree to stop taking my current')
        ? '120px'
        : '48px';
    return (
        <Button
            variant="outlined"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start', // Align text properly
                justifyContent: 'center',
                textAlign: 'start',
                minHeight, // Ensures a base height but allows expansion
                whiteSpace: 'normal', // Ensures text wraps properly
                wordBreak: 'break-word', // Ensures long words break if needed
                padding: '12px', // Adds padding for better spacing
                border: selected ? '2px solid' : '1px solid',
                borderRadius: '12px',
                cursor: 'pointer',
                color: 'black',
                backgroundColor: selected
                    ? 'rgba(237, 250, 255, 0.40)'
                    : 'white',
                borderColor: selected ? '#8CCEEA' : 'rgba(102, 102, 102, 0.20)',
                textTransform: 'none',
                '&:hover': {
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
                handleCheckboxChange(option);
            }}
            className="intake-v3-question-button px-[1rem] md:px-[16px]"
        >
            <div className="flex justify-between items-center w-full h-full">
                <BioType className={`intake-v3-question-text`}>
                    {alternate_other_text ? alternate_other_text : option}
                </BioType>
                {showCheck && (
                    <div className="mr-5 mt-1">
                        {selected && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="19"
                                viewBox="0 0 18 19"
                                fill="none"
                            >
                                <rect
                                    y="0.471436"
                                    width="18"
                                    height="18"
                                    rx="4.5"
                                    fill="#8CCEEA"
                                />
                                <path
                                    d="M15 4.97144L6.75 13.2214L3 9.47144"
                                    stroke="white"
                                    stroke-width="1.125"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        )}
                    </div>
                )}
            </div>
        </Button>
    );
}
