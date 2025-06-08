'use client';

import { FC } from 'react';
import { Typography } from '@mui/material';
import MatchCard from '../components/match-card';
import TopMatchCard from '../components/top-match-card';

const additionalTreatments = [
    {
        id: 1,
        productName: 'Sildenafil (Generic Viagra®)',
        subtitle: '',
        price: 29.3,
        tags: ['As needed', 'Standard pill', 'Fast-acting'],
        imageSrc: '/img/product-images/prescriptions/sildenafil.png',
        productHref: 'cialis',
    },
    {
        id: 2,
        productName: 'Cialis',
        subtitle: 'Brand-name tadalafil',
        price: 339.35,
        tags: ['As needed', 'Standard pill', 'Long-lasting'],
        imageSrc: '/img/product-images/prescriptions/cialis.png',
        productHref: 'cialis',
    },
    {
        id: 3,
        productName: 'Viagra®',
        subtitle: 'Brand-name sildenafil',
        price: 654.2,
        tags: ['As needed', 'Standard pill', 'Fast-acting'],
        imageSrc: '/img/product-images/prescriptions/viagra.png',
        productHref: 'cialis',
    },
];

const currentMatch = {
    id: 4,
    productName: 'Tadalafil (Generic Cialis®)',
    subtitle: '',
    imageSrc: '/img/product-images/prescriptions/tadalafil.png',
    productHref: 'tadalafil',
};

export default function AsNeededStandardComponent() {
    const mockAdditionalTreatment = additionalTreatments;
    const mockCurrentTreatment = currentMatch;

    return (
        <>
            <div className='flex flex-col animate-slideRight'>
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
                                productHref={treatment.productHref}
                                imageSrc={treatment.imageSrc}
                            />
                        </li>
                    ))}
                </ul>
                <div className='mt-4' />
            </div>
        </>
    );
}
