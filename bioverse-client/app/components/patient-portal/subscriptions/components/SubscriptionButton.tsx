'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { Paper } from '@mui/material';
import Link from 'next/link';

interface SubscriptionButtonProps {
    text: string;
    onClick?: any;
}

export default function SubscriptionButton({
    text,
    onClick,
}: SubscriptionButtonProps) {
    return (
        <div
            onClick={onClick}
            className='hover:cursor-pointer w-full h-[52px] px-4 py-[22px] rounded-[4px] border border-solid border-[#BDBDBD] bg-white flex items-center'
        >
            <BioType className='body1 font-twcmedium text-[16px] text-black'>
                {text}
            </BioType>
        </div>
    );
}
