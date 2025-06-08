import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import React from 'react';
import { addDeltaToDate } from '@/app/utils/functions/dates';

interface Props {
    option: {
        label: string;
        delta: number;
        mode: string;
    };
    selected: boolean;
    handleCheckboxChange: (option: number) => void;
    date: string;
}

const ChangeRefillOfferItem = ({
    option,
    selected,
    handleCheckboxChange,
    date,
}: Props) => {
    return (
        <>
            <Button
                variant='outlined'
                sx={{
                    display: 'flex',
                    position: { md: 'relative' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '58px',
                    border: '1px solid',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    backgroundColor: selected
                        ? 'rgba(40, 106, 162, 0.1)'
                        : 'white',
                    borderColor: selected ? 'rgba(40, 106, 162, 1)' : '#BDBDBD',
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
                onClick={() => handleCheckboxChange(option.delta)}
            >
                <div className='flex justify-between items-center w-full'>
                    <BioType
                        className={`bodyanswer ${'text-[16px] font-twcmedium'} ml-2 ${
                            selected ? 'text-[#286BA2]' : 'text-[#1B1B1B]'
                        } flex flex-col items-start`}
                    >
                        {option.label}
                        <br />
                        <div className='text-textSecondary'>
                            Next order to ship {date}
                        </div>
                    </BioType>

                    <div className='mr-5 mt-1'>
                        {selected && (
                            <CheckIcon
                                fontSize='small'
                                sx={{ color: 'rgba(40, 106, 162, 1)' }}
                            />
                        )}
                    </div>
                </div>
            </Button>
        </>
    );
};

export default ChangeRefillOfferItem;
