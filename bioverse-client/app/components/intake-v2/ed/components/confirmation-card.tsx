'use client';

import { FC } from 'react';
import { Chip, Typography, Radio } from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface ConfirmationCardProps {
    quantity: number;
    price: string;
    isSelected: boolean;
    onSelect: () => void;
}

const ConfirmationCard: FC<ConfirmationCardProps> = ({
    quantity,
    price,
    isSelected,
    onSelect,
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onSelect();
    };

    return (
        <div className='flex flex-col w-full'>
            <div
                className={`flex flex-col hover:cursor-pointer items-center self-stretch px-5 py-6 border-solid border-1 rounded-md ${
                    isSelected ? 'border-[#286BA2]' : 'border-[#BDBDBD]'
                }`}
                onClick={() => onSelect()}
            >
                <div className='flex justify-between items-center w-full'>
                    <div className='flex items-center'>
                        <Radio
                            id={`${quantity}-${price}-confirmation`}
                            name='confirmationOption'
                            value={`${quantity}-${price}-confirmation`}
                            checked={isSelected}
                            onChange={handleInputChange}
                            sx={{
                                color: 'textSecondary',
                                '&.Mui-checked': { color: 'textPrimary' },
                                height: '2px',
                                width: '2px',
                                marginRight: '20px',
                            }}
                        />
                        <label htmlFor={`${quantity}-${price}-confirmation`}>
                            <BioType className='flex'>
                                Use {quantity} times/month
                            </BioType>
                        </label>
                    </div>
                    <Chip label={`From $${price}/use`} className='mt-auto' />
                </div>
            </div>
        </div>
    );
};

export default ConfirmationCard;
