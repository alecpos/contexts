'use client';

import { Typography } from '@mui/material';
import MatchCard from '../components/match-card';
import TopMatchCard from '../components/top-match-card';

const additionalTreatments: any[] = [
    // {
    //     id: 1,
    //     productName: 'Sildenafil (Generic Viagra®)',
    //     subtitle: '',
    //     price: 20,
    //     tags: ['As needed', 'Standard pill', 'Fast-acting'],
    //     imageSrc: '/img/product-images/prescriptions/sildenafil.png',
    //     productHref: 'sildenafil',
    // },
    // {
    //     id: 2,
    //     productName: 'Cialis®',
    //     subtitle: 'Brand-name tadalafil',
    //     price: 30,
    //     tags: ['As needed', 'Standard pill', 'Long-lasting'],
    //     imageSrc: '/img/product-images/prescriptions/cialis.png',
    //     productHref: 'cialis',
    // },
    // {
    //     id: 3,
    //     productName: 'Brand-name sildenafil',
    //     subtitle: 'Viagra®',
    //     price: 10,
    //     tags: ['As needed', 'Standard pill', 'Fast-acting'],
    //     imageSrc: '/img/product-images/prescriptions/viagra.png',
    //     productHref: 'viagra',
    // },
    {
        id: 1,
        productName: 'Peak Chews',
        subtitle: 'Tadalafil',
        price: 25,
        tags: ['Daily', 'Chewable', 'Long-lasting'],
        imageSrc: '/img/product-images/prescriptions/peak-chews.png',
        productHref: 'peak-chews',
    },
];

const currentMatch = {
    id: 4,
    productName: 'Tadalafil (Generic Cialis®)',
    subtitle: '',
    imageSrc: '/img/product-images/prescriptions/tadalafil.png',
    productHref: 'tadalafil',
};

export default function DailyStandardComponent() {
    const mockAdditionalTreatment = additionalTreatments;
    const mockCurrentTreatment = currentMatch;

    return (
        <>
            <div className='flex flex-col animate-slideRight w-full'>
                <h1 className='it-subtitle font-normal text-center mb-4'>
                    Your current match
                </h1>
                <TopMatchCard
                    productName={mockCurrentTreatment.productName}
                    subtitle={mockCurrentTreatment.subtitle}
                    productHref={mockCurrentTreatment.productHref}
                    imageSrc={mockCurrentTreatment.imageSrc}
                />
                <div className='my-6'>
                    <Typography className='text-2xl it-subtitle text-center'>
                        Your other matches
                    </Typography>
                    <p className='it-subtitle opacity-65'>
                        Explore treatments that will work based on your
                        preferences
                    </p>
                </div>
                <ul className='space-y-5'>
                    {mockAdditionalTreatment.map((treatment) => (
                        <li key={treatment.id} className='list-none'>
                            <MatchCard
                                productName={treatment.productName}
                                subtitle={treatment.subtitle}
                                price={treatment.price}
                                tags={treatment.tags}
                                imageSrc={treatment.imageSrc}
                                productHref={treatment.productHref}
                            />
                        </li>
                    ))}
                </ul>
                <div className='mt-4' />
            </div>
        </>
    );
}
