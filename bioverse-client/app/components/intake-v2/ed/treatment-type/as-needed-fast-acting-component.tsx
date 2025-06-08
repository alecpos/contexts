'use client';

import { FC } from 'react';
import { Typography } from '@mui/material';
import MatchCard from '../components/match-card';
import TopMatchCard from '../components/top-match-card';
import { usePathname } from 'next/navigation';

const additionalTreatments = [
    {
        id: 1,
        productName: 'X Chews',
        subtitle: 'Tadalafil + Oxytocin',
        price: 44.83,
        tags: ['As needed', 'Chewable', 'Fast-acting'],
        imageSrc: '/img/product-images/prescriptions/x-chews.png',
        productHref: 'x-chews',
    },
    {
        id: 2,
        productName: 'X Melts',
        subtitle: 'Sildenafil + Oxytocin',
        price: 30.17,
        tags: ['As needed', 'Dissolving', 'Fast-acting'],
        imageSrc: '/img/product-images/prescriptions/x-melts.png',
        productHref: 'x-melts',
    },
    {
        id: 3,
        productName: 'Peak Chews',
        subtitle: 'Tadalafil',
        price: 25,
        tags: ['As needed', 'Chewable', 'Long-lasting'],
        imageSrc: '/img/product-images/prescriptions/peak-chews.png',
        productHref: 'peak-chews',
    },
    {
        id: 4,
        productName: 'Rush Chews',
        subtitle: 'Sildenafil',
        price: 27.5,
        tags: ['As needed', 'Chewable', 'Fast-acting'],
        imageSrc: '/img/product-images/prescriptions/rush-chews.png',
        productHref: 'rush-chews',
    },
];

const XChewsFlowTreatmentOptions = [
    {
        id: 1,
        productName: 'X Chews',
        subtitle: 'Tadalafil + Oxytocin',
        price: 44.83,
        tags: ['As needed', 'Chewable', 'Fast-acting'],
        imageSrc: '/img/product-images/prescriptions/x-chews.png',
        productHref: 'x-chews',
    },
    {
        id: 2,
        productName: 'X Melts',
        subtitle: 'Sildenafil + Oxytocin',
        price: 30.17,
        tags: ['As needed', 'Dissolving', 'Fast-acting'],
        imageSrc: '/img/product-images/prescriptions/x-melts.png',
        productHref: 'x-melts',
    },
];

//just the same as above but in a different order
const XMeltsFlowTreatmentOptions = [
    {
        id: 1,
        productName: 'X Melts',
        subtitle: 'Sildenafil + Oxytocin',
        price: 30.17,
        tags: ['As needed', 'Dissolving', 'Fast-acting'],
        imageSrc: '/img/product-images/prescriptions/x-melts.png',
        productHref: 'x-melts',
    },
    {
        id: 2,
        productName: 'X Chews',
        subtitle: 'Tadalafil + Oxytocin',
        price: 44.83,
        tags: ['As needed', 'Chewable', 'Fast-acting'],
        imageSrc: '/img/product-images/prescriptions/x-chews.png',
        productHref: 'x-chews',
    },
];

const currentMatch = {
    id: 4,
    productName: 'Rush Melts',
    subtitle: 'Sildenafil + Tadalafil',
    imageSrc: '/img/product-images/prescriptions/rush-melts.png',
    productHref: 'rush-melts',
};

export default function AsNeededFastActingComponent() {

    const fullPath = usePathname();
    const isXEDFlow = fullPath.includes('x-melts') || fullPath.includes('x-chews');
    const isEDGlobal = fullPath.includes('ed-global');

    //make sure x-melts show up first if their in the x-melts flow and vice versa
    const edXFlowTreatmentOptions = fullPath.includes('x-melts') ? XMeltsFlowTreatmentOptions : XChewsFlowTreatmentOptions;

    const mockAdditionalTreatment = isXEDFlow ? edXFlowTreatmentOptions : additionalTreatments;
    const mockCurrentTreatment = currentMatch;

    return (
        <>
            <div className='flex flex-col animate-slideRight'>
                {isEDGlobal && (
                    <>
                        <h1 className='it-subtitle font-normal text-center mb-4'>
                            Your current match
                        </h1>
                        <TopMatchCard
                            productName={mockCurrentTreatment.productName}
                            productHref={mockCurrentTreatment.productHref}
                            subtitle={mockCurrentTreatment.subtitle}
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
                    </>
                )}

                {isXEDFlow && (
                    <div className='my-6'>
                        <h1 className='it-subtitle font-normal text-center mb-4 text-2xl '>
                            Your Matches
                        </h1>
                        <p className='it-subtitle opacity-65'>
                            Explore treatments that will work based on your
                            preferences
                        </p>
                    </div>
                )}
                
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
                <div className='mt-16' />
            </div>
        </>
    );
}
