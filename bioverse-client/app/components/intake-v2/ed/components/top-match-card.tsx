'use client';

import { FC } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, Chip } from '@mui/material';
import Paper from '@mui/material/Paper';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface TopMatchCardProps {
    productName: string;
    subtitle: string;
    imageSrc: string;
    productHref: string;
}

const TopMatchCard: FC<TopMatchCardProps> = ({
    productName,
    subtitle,
    imageSrc,
    productHref,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();

    const pushToNextRoute = (newURL: string) => {
        const searchParams = new URLSearchParams(search);
        const newSearch = searchParams.toString();
        router.push(`${fullPath}/${newURL}?${newSearch}`);
    };

    const handleOptionClick = (product_href: string) => {
        setTimeout(() => pushToNextRoute(product_href), 500);
    };

    return (
        <Paper className='flex flex-col items-center self-stretch px-5 py-6 border-solid border-primary border-[2.5px] shadow-xl shadow-gray-700/30'>
            <div className='flex justify-between items-start w-full'>
                <div className='flex flex-col items-start gap-1'>
                    <BioType className='it-body md:itd-body text-textSecondary'>
                        {subtitle}
                    </BioType>
                    <BioType className='it-title md:itd-subtitle text-primary'>
                        {productName}
                        {/* <sup>&reg;</sup> */}
                        <sup
                            className='text-xs align-top ml-1'
                            style={{ lineHeight: '1' }}
                        >
                            ℞
                        </sup>
                    </BioType>
                </div>
                <Image
                    src={imageSrc}
                    alt={`${productName} alt image`}
                    width={120}
                    height={100}
                    unoptimized
                />
            </div>

            <div className='flex justify-start w-full -mt-4'>
                <Chip
                    label={'Based on your preferences'}
                    color='primary'
                    variant='outlined'
                    className='mt-auto border-2'
                />
            </div>
            <Button
                onClick={() => handleOptionClick(productHref)}
                sx={{
                    backgroundColor: '#000000',
                    '&:hover': {
                        backgroundColor: '#666666',
                    },
                }}
                variant='outlined'
                className='w-full mt-4 py-4 text-white bg-black text-sm hover:bg-black'
            >
                VIEW TREATMENT
            </Button>
        </Paper>
    );
};

export default TopMatchCard;
