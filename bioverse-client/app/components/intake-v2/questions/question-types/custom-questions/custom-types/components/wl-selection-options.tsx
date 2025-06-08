'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_PAGE_HEADER_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_INPUT_TAILWIND,
} from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { Paper, Chip, Button } from '@mui/material';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

interface WLSelectionOptions {
    setSelectedProduct: (product: PRODUCT_HREF) => void;
    getPrice: (product_href: string) => string;
}

export default function WLSelectionOptions({
    setSelectedProduct,
    getPrice,
}: WLSelectionOptions) {
    const searchParams = useSearchParams();

    const urlParams = new URLSearchParams(searchParams);

    const displaySemaglutideCard = () => {
        return (
            <Paper className='px-6 md:py-[36px] py-6 md:min-w-[403px] min-w-[250px] h-[647px] flex flex-col'>
                <div className='flex justify-between mb-4'>
                    <BioType
                        className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} !text-primary`}
                    >
                        Semaglutide
                    </BioType>
                    <Chip
                        variant='filled'
                        size='medium'
                        label={`Most Popular`}
                        sx={{
                            padding: '8px 8px 10px 8px',
                            background:
                                'linear-gradient(90deg, #3B8DC5, #59B7C1)',
                            color: 'white', // Optional: Set text color to white for better visibility
                        }}
                    />
                </div>
                <div className='w-[50%] aspect-square relative mx-auto my-4'>
                    <Image
                        src={'/img/intake/wl/semaglutide-clear.png'}
                        fill
                        alt='Semaglutide'
                        objectFit='cover'
                        unoptimized
                    />
                </div>
                <div className='flex-grow'>
                    <BioType className={`${INTAKE_INPUT_TAILWIND}`}>
                        Semaglutide has been proven effective when used
                        off-label for weight loss.
                        <br />
                        <br />
                        Most patients who use Semaglutide will lose 15% of their
                        body weight over a year.
                        <br />
                        <br />
                        <span className='text-primary'>
                            Limited Time Offer: Get semaglutide for as little a
                            ${getPrice(PRODUCT_HREF.SEMAGLUTIDE)}/month. This
                            may vary based on dosage.
                        </span>
                    </BioType>
                </div>

                <Button
                    variant='contained'
                    fullWidth
                    sx={{
                        width: {
                            sm: '100%',
                        },
                        height: '52px',
                        // '@media (min-width:768px)': {
                        //     width: '118px',
                        // },
                        // position: { xs: 'fixed', sm: 'static' },
                        // bottom: { xs: bottomXs, sm: 0 },
                        padding: '16px',
                        zIndex: 30,
                        backgroundColor: '#000000',
                        '&:hover': {
                            backgroundColor: '#666666',
                        },
                    }}
                    onClick={() =>
                        setSelectedProduct('semaglutide' as PRODUCT_HREF)
                    }
                >
                    <BioType className=''>Review treatment</BioType>
                </Button>
            </Paper>
        );
    };

    const displayTirzepatideCard = () => {
        return (
            <Paper className='px-6 md:py-[36px] py-6 h-[647px] md:min-w-[403px]  min-w-[250px] flex flex-col'>
                <div className='flex justify-between mb-4'>
                    <BioType
                        className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} !text-primary`}
                    >
                        Tirzepatide
                    </BioType>
                    {urlParams.get('src') === 'vwo' && (
                        <Chip
                            variant='filled'
                            size='medium'
                            label={`Popular`}
                            sx={{
                                padding: '8px 8px 10px 8px',
                                background:
                                    'linear-gradient(90deg, #3B8DC5, #59B7C1)',
                                color: 'white', // Optional: Set text color to white for better visibility
                            }}
                        />
                    )}
                </div>
                <div className='w-[50%] aspect-square relative mx-auto my-4'>
                    <Image
                        src={'/img/intake/wl/tirzepatide-clear.png'}
                        fill
                        alt='Tirzepatide'
                        objectFit='cover'
                        unoptimized
                    />
                </div>
                <div className='flex-grow'>
                    <BioType className={`${INTAKE_INPUT_TAILWIND}`}>
                        Tirzepatide is a GLP-1 medication that was FDA-approved
                        for type 2 diabetes in 2022. It has also been proven
                        effective when used off-label for weight loss.
                        <br />
                        <br />
                        Most patients who use Tirzepatide will lose about 20% of
                        their body weight over a year.
                        <br />
                        <br />
                        <span className='text-primary'>
                            Limited Time Offer: Get tirzepatide for as little as
                            ${getPrice(PRODUCT_HREF.TIRZEPATIDE)}/month. This
                            may vary based on dosage.
                        </span>
                    </BioType>
                </div>

                <Button
                    variant='contained'
                    fullWidth
                    sx={{
                        width: {
                            sm: '100%',
                        },
                        height: '52px',

                        padding: '16px',
                        zIndex: 30,
                        backgroundColor: '#000000',
                        '&:hover': {
                            backgroundColor: '#666666',
                        },
                    }}
                    onClick={() =>
                        setSelectedProduct('tirzepatide' as PRODUCT_HREF)
                    }
                >
                    <BioType className=''>Review treatment</BioType>
                </Button>
            </Paper>
        );
    };

    const displayMetforminCard = () => {
        return (
            <Paper className='px-6 md:py-[36px] py-6 h-[647px] md:min-w-[403px]  min-w-[250px] flex flex-col'>
                <div className='flex justify-between mb-4'>
                    <BioType
                        className={`${INTAKE_PAGE_SUBTITLE_TAILWIND} !text-primary`}
                    >
                        Metformin
                    </BioType>
                </div>
                <div className='w-[50%] aspect-square relative mx-auto my-4'>
                    <Image
                        src={'/img/intake/wl/metformin.png'}
                        fill
                        alt='Metformin'
                        objectFit='cover'
                        unoptimized
                    />
                </div>
                <div className='flex-grow'>
                    <BioType className={`${INTAKE_INPUT_TAILWIND}`}>
                        Metformin is a non-GLP-1 medication that has also been
                        proven effective when used off-label for weight loss.
                        <br />
                        <br />
                        Most patients who use Metformin will lose 2 to 5% of
                        their body weight over a year.
                        <br />
                        <br />
                        <span className='text-primary'>
                            Limited Time Offer: Get metformin for as little as
                            $5 for your first month!
                        </span>
                    </BioType>
                </div>

                <Button
                    variant='contained'
                    fullWidth
                    sx={{
                        width: {
                            sm: '100%',
                        },
                        height: '52px',
                        // '@media (min-width:768px)': {
                        //     width: '118px',
                        // },
                        // position: { xs: 'fixed', sm: 'static' },
                        // bottom: { xs: bottomXs, sm: 0 },
                        padding: '16px',
                        zIndex: 30,
                        backgroundColor: '#000000',
                        '&:hover': {
                            backgroundColor: '#666666',
                        },
                    }}
                    onClick={() =>
                        setSelectedProduct('metformin' as PRODUCT_HREF)
                    }
                >
                    <BioType className=''>Review treatment</BioType>
                </Button>
            </Paper>
        );
    };

    const displayCards = () => {
        if (urlParams.get('src') === 'vwo') {
            return (
                <div className='flex flex-row gap-6 md:max-w-[520px] max-w-[350px] p-2 overflow-x-auto pb-10 md:pb-0'>
                    {displayTirzepatideCard()}
                    {displaySemaglutideCard()}
                    {displayMetforminCard()}
                </div>
            );
        }
        return (
            <div className='flex flex-row gap-6 md:max-w-[520px] max-w-[350px] p-2 overflow-x-auto pb-10 md:pb-0'>
                {displaySemaglutideCard()}
                {displayTirzepatideCard()}
                {displayMetforminCard()}
            </div>
        );
    };

    return (
        <div className={`justify-center flex`}>
            <div className='flex flex-col gap-[28px]'>
                <div className='flex flex-col md:gap-[28px] gap-4 animate-slideRight md:max-w-[520px] w-auto'>
                    <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                        Select a preferred treatment option.
                    </BioType>

                    <BioType className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}`}>
                        While you should share your preferred treatment option,
                        your provider will ultimately only move forward with a
                        treatment option that is medically appropriate for you.
                    </BioType>
                </div>

                {displayCards()}
            </div>
        </div>
    );
}
