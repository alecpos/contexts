'use client';

import { FC } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button, Chip } from '@mui/material';
import Paper from '@mui/material/Paper';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface MatchCardProps {
    productName: string;
    subtitle: string;
    tags: string[];
    imageSrc: string;
    price?: number;
    productHref: string;
}

const MatchCard: FC<MatchCardProps> = ({
    productName,
    subtitle,
    tags,
    imageSrc,
    price,
    productHref,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();

    const pushToNextRoute = (newURL: string) => {
        const searchParams = new URLSearchParams(search);
        const newSearch = searchParams.toString();

        if (fullPath.includes('standard') && productHref === 'peak-chews') {
            const fullPathSwapped = fullPath.replace('standard', 'fast-acting');
            router.push(`${fullPathSwapped}/${newURL}?${newSearch}`);
            return;
        }

        router.push(`${fullPath}/${newURL}?${newSearch}`);
    };

    const handleOptionClick = (product_href: string) => {
        setTimeout(() => pushToNextRoute(product_href), 500);
    };

    return (
        <Paper className='flex flex-col items-center self-stretch px-5 py-6 border-solid border-[#FFF] border-[1px]'>
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
                    <p className='it-body md:itd-body text-textSecondary'>
                        As low as ${price?.toFixed(2)}/mo
                    </p>
                </div>
                <Image
                    src={imageSrc}
                    alt={`${productName} alt image`}
                    width={120}
                    height={100}
                    unoptimized
                />
            </div>

            <br />

            <div className='border-solid w-full border-gray-300 rounded-sm border-[1.5px]'>
                <div className='p-2 px-4'>
                    <p className='it-subtitle text-primary'>Good for</p>
                    <ul className='flex gap-x-2 pt-2'>
                        {tags.map((tag) => (
                            <li key={tag} className='list-none'>
                                <Chip
                                    label={tag}
                                    color='primary'
                                    variant='outlined'
                                    className='mt-auto border-2'
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Button
                onClick={() => handleOptionClick(productHref)}
                variant='outlined'
                className='w-full  text-black text-sm border-gray-400'
                sx={{ 
                    marginTop: '20px', 
                    padding: '17px 0px 17px',
                    color: 'black',
                }}
            >
                VIEW TREATMENT
            </Button>
        </Paper>
    );
};

export default MatchCard;
