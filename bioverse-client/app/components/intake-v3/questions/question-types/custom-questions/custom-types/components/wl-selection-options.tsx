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
import { use } from 'react';

interface WLSelectionOptions {
    setSelectedProduct: (product: PRODUCT_HREF, color: string) => void;
    getPrice: (product_href: string) => string;
    isVwoRoTest: boolean;
    colorMap: string[];
}

interface ProductCardProps {
    title: string;
    description: string;
    mobileDescription: string[];
    strongText: string;
    imageUrl: string;
    buttonText: string;
    backgroundColor?: string;
    onButtonClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    title,
    description,
    mobileDescription,
    strongText,
    imageUrl,
    buttonText,
    backgroundColor,
    onButtonClick,
}) => {
    return (
        <div
            className='flex flex-col md:flex-row justify-between md:w-[750px] lg:w-[920px] h-full md:h-[221px] mx-auto rounded-xl '
            style={{ backgroundColor: backgroundColor }}
        >
            <div className='flex flex-col justify-between md:w-1/3  md:py-[20px] px-[32px] border-r-4'>
                <div className='w-full md:w-[70%]  aspect-square relative mx-auto'>
                    <Image
                        src={imageUrl}
                        fill
                        alt={title}
                        objectFit='cover'
                        
                    />
                </div>
                <Button
                    variant='outlined'
                    className='normal-case text-black intake-v3-disclaimer-text-bold  w-full md:w-[200px] md:mx-auto hidden md:block h-[36px]'
                    sx={{
                        borderRadius: '12px',
                        border: '1px solid #000000',
                    }}
                    onClick={onButtonClick}
                >
                    <p className='intake-v3-disclaimer-text-bold '>
                        {buttonText}
                    </p>
                </Button>
            </div>

            <div className=' flex flex-col justify-center h-fit my-auto '>
                <div
                    className='flex-grow my-[1.25rem] md:my-[20px] px-[1.5rem] md:px-[32px] hidden md:block h-fit'
                    style={{ borderLeft: '2px solid #000000' }}
                >
                    <BioType className='intake-v3-18px-20px-bold'>
                        {title}
                    </BioType>
                    <p
                        className={`intake-v3-question-text text-weak text-[1rem] md:text-[16px] mt-[1rem] md:mt-[12px]`}
                    >
                        {description}
                        <br />
                        <br />
                        <span className='intake-v3-question-text text-strong'>
                            {strongText}
                        </span>
                    </p>
                </div>
                <div className='flex-grow my-[1.25rem] px-[1.3rem] md:hidden'>
                    <p className='intake-v3-18px-20px-bold mb-2'>{title}</p>
                    <p
                        className={`intake-v3-question-text text-[1rem] text-weak font-normal leading-[20px] font-inter md:hidden`}
                    >
                        <div className='flex flex-col gap-3'>
                            {mobileDescription.map((description, index) => (
                                <p key={index}>{description}</p>
                            ))}
                        </div>
                        <br />
                        <br />
                        <span className='intake-v3-question-text text-strong'>
                            {strongText}
                        </span>
                    </p>
                </div>
            </div>

            <Button
                variant='contained'
                className='normal-case intake-v3-disclaimer-text w-11/12  md:hidden my-[1.25rem] mx-auto bg-black hover:bg-slate-800 h-[2.25rem]'
                sx={{
                    borderRadius: '12px',
                    border: '1px solid #000000',
                }}
                onClick={onButtonClick}
            >
                <p className='intake-v3-disclaimer-text-bold'>{buttonText}</p>
            </Button>
        </div>
    );
};

export default function WLSelectionOptions({
    setSelectedProduct,
    getPrice,
    isVwoRoTest,
    colorMap,
}: WLSelectionOptions) {
    const searchParams = useSearchParams();
    const urlParams = new URLSearchParams(searchParams);

    let metforminPriceSentence: string;
    switch (searchParams.get('met-price-var')) {
        case '1':
            metforminPriceSentence =
                'Limited Time Offer: Get metformin for as little as $18.33/month!';
            break;
        case '2':
            metforminPriceSentence =
                'Limited Time Offer: Get metformin for as little as $55 for your first order!';
            break;
        default:
            metforminPriceSentence =
                'Limited Time Offer: Get metformin for as little as $5 for your first month!';
            break;
    }

    const displaySemaglutideCard = (colorOrder: number) => {
        return (
            <ProductCard
                title='Semaglutide'
                description='Semaglutide has been proven effective when used off-label for weight loss. Most patients who use Semaglutide will lose 15% of their body weight over a year.'
                mobileDescription={[
                    'Semaglutide has been proven effective when used off-label for weight loss.',
                    'Most patients who use Semaglutide will lose 15% of their body weight over a year.',
                ]}
                strongText={`Limited Time Offer: Get semaglutide for as little a $${getPrice(
                    PRODUCT_HREF.SEMAGLUTIDE
                )}/month. This may vary based on dosage.`}
                imageUrl='/img/intake/wl/semaglutide/clear-semaglutide-syringe.png'
                buttonText='Review treatment'
                backgroundColor={colorMap[colorOrder]}
                onButtonClick={() =>
                    setSelectedProduct(
                        'semaglutide' as PRODUCT_HREF,
                        colorMap[colorOrder]
                    )
                }
            />
        );
    };

    const displayTirzepatideCard = (colorOrder: number) => {
        return (
            <ProductCard
                title='Tirzepatide'
                description='Tirzapatide is a GLP-1 medication that was FDA-approved for type 2 diabetes in 2022. It has also been proven effective when used off-label for weight loss. Most patients who use Tirzepatide will lose about 20% of their body weight over a year.'
                mobileDescription={[
                    'Tirzapatide is a GLP-1 medication that was FDA-approved for type 2 diabetes in 2022. It has also been proven effective when used off-label for weight loss.',
                    'Most patients who use Tirzepatide will lose about 20% of their body weight over a year.',
                ]}
                strongText={`Limited Time Offer: Get tirzepatide for as little as $${getPrice(
                    PRODUCT_HREF.TIRZEPATIDE
                )}/month. This may vary based on dosage.`}
                imageUrl='/img/intake/wl/tirzepatide/clear-tirzepatide-syringe.png'
                buttonText='Review treatment'
                backgroundColor={colorMap[colorOrder]}
                onButtonClick={() =>
                    setSelectedProduct(
                        'tirzepatide' as PRODUCT_HREF,
                        colorMap[colorOrder]
                    )
                }
            />
        );
    };

    const displayMetforminCard = (colorOrder: number) => {
        return (
            <ProductCard
                title='Metformin'
                description='Metformin is a non-GLP-1 medication that has also been proven effective when used off-label for weight loss. Most patients who use Metformin will lose 2 to 5% of their body weight over a year.'
                mobileDescription={[
                    'Metformin is a non-GLP-1 medication that has also been proven effective when used off-label for weight loss.',
                    'Most patients who use Metformin will lose 2 to 5% of their body weight over a year.',
                ]}
                strongText={metforminPriceSentence}
                imageUrl='/img/intake/wl/metformin.png'
                buttonText='Review treatment'
                backgroundColor={colorMap[colorOrder]}
                onButtonClick={() =>
                    setSelectedProduct(
                        'metformin' as PRODUCT_HREF,
                        colorMap[colorOrder]
                    )
                }
            />
        );
    };

    const displayOzempicCard = (colorOrder: number) => {
        return (
            <ProductCard
                title='Ozempic'
                description='A GLP-1 medication effective for weight loss when used off-label; FDA-approved for type 2 diabetes in 2017. Most patients who use Ozempic will lose 15% of their body weight over a year.'
                mobileDescription={[
                    'A GLP-1 medication effective for weight loss when used off-label; FDA-approved for type 2 diabetes in 2017.',
                    'Most patients who use Ozempic will lose 15% of their body weight over a year.',
                ]}
                strongText='Your first month of Ozempic is generally around $1799/month.'
                imageUrl='/img/intake/wl/ozempic.png'
                buttonText='Review treatment'
                backgroundColor={colorMap[colorOrder]}
                onButtonClick={() =>
                    setSelectedProduct(
                        'ozempic' as PRODUCT_HREF,
                        colorMap[colorOrder]
                    )
                }
            />
        );
    };

    const displayWegovyCard = (colorOrder: number) => {
        return (
            <ProductCard
                title='Wegovy'
                description='Wegovy (semaglutide) is a GLP-1 medication that was FDA-approved for weight loss in 2021. Most patients who use Wegovy will lose 15% of their body weight over a year.'
                mobileDescription={[
                    'Wegovy (semaglutide) is a GLP-1 medication that was FDA-approved for weight loss in 2021.',
                    'Most patients who use Wegovy will lose 15% of their body weight over a year.',
                ]}
                strongText='Your first month of Wegovy is generally around $1999/month.'
                imageUrl='/img/intake/wl/wegovy.png'
                buttonText='Review treatment'
                backgroundColor={colorMap[colorOrder]}
                onButtonClick={() =>
                    setSelectedProduct(
                        'wegovy' as PRODUCT_HREF,
                        colorMap[colorOrder]
                    )
                }
            />
        );
    };

    const displayWLCapsuleCard = (colorOrder: number) => {
        return (
            <ProductCard
                title='Bioverse Weight Loss Capsules'
                description='Bioverse Weight Loss Capsules combine three prescription strength medications (Buproprion HCl, Naltrexone HCl, and Topiramate) to curb cravings and suppress appetite. These medications are effective when prescribed off-label for weight loss. Most patients who use Bioverse Weight Loss Capsules will lose 2 to 5% of their body weight over a year.'
                mobileDescription={[
                    'Bioverse Weight Loss Capsules combine three prescription strength medications (Buproprion HCl, Naltrexone HCl, and Topiramate) to curb cravings and suppress appetite. These medications are effective when prescribed off-label for weight loss.',
                    'Most patients who use Bioverse Weight Loss Capsules will lose 2 to 5% of their body weight over a year.',
                ]}
                strongText='Your first month of Bioverse Weight Loss Capsules is as low as $66.33.'
                imageUrl='/img/intake/wl/wl-capsule.png'
                buttonText='Review treatment'
                backgroundColor={colorMap[colorOrder]}
                onButtonClick={() =>
                    setSelectedProduct(
                        'wl-capsule' as PRODUCT_HREF,
                        colorMap[colorOrder]
                    )
                }
            />
        );
    };

    const displayCards = () => {
        return (
            <div className='flex flex-col gap-[0.75rem] md:gap-[15px] mt-[1.25rem] md:mt-[30px]'>
                {displaySemaglutideCard(1)}
                {displayTirzepatideCard(2)}
                {isVwoRoTest && displayWLCapsuleCard(3)}
                {displayMetforminCard(isVwoRoTest ? 4 : 3)}
            </div>
        );
    };

    return (
        <div
            className={`justify-center flex flex-col mt-[1.25rem] md:mt-[48px] pb-16 md:pb-0`}
        >
            <div className='flex flex-col '>
                <div className='flex flex-col md:gap-[28px] gap-4 animate-slideRight md:max-w-[490px] mx-auto'>
                    <BioType className={`inter-h5-question-header`}>
                        Select a preferred treatment option.
                    </BioType>

                    <BioType className={`intake-subtitle`}>
                        While you should share your preferred treatment option,
                        your provider will ultimately only move forward with a
                        treatment option that is medically appropriate for you.
                    </BioType>
                </div>
            </div>
            {displayCards()}
        </div>
    );
}
