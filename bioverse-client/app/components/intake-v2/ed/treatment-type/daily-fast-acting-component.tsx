'use client';

import { Typography } from '@mui/material';
import MatchCard from '../components/match-card';
import TopMatchCard from '../components/top-match-card';
import { usePathname } from 'next/navigation';


const additionalTreatments = [
    {
        id: 1,
        productName: 'X Chews',
        subtitle: 'Tadalafil + Oxytocin',
        price: 99.83,
        tags: ['As needed', 'Chewable', 'Fast-acting'],
        imageSrc: '/img/product-images/prescriptions/x-chews.png',
        productHref: 'x-chews',
    },
    {
        id: 2,
        productName: 'X Melts',
        subtitle: 'Sildenafil + Oxytocin',
        price: 99.83,
        tags: ['As needed', 'Dissolving', 'Fast-acting'],
        imageSrc: '/img/product-images/prescriptions/x-melts.png',
        productHref: 'x-melts',
    },
    {
        id: 3,
        productName: 'Rush Chews',
        subtitle: 'Sildenafil',
        price: 61.5,
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
        price: 99.83,
        tags: ['Daily', 'Chewable', 'Fast-acting'],
        imageSrc: '/img/product-images/prescriptions/x-chews.png',
        productHref: 'x-chews',
    },
    {
        id: 2,
        productName: 'X Melts',
        subtitle: 'Sildenafil + Oxytocin',
        price: 99.83,
        tags: ['Daily', 'Dissolving', 'Fast-acting'],
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
        price: 99.83,
        tags: ['Daily', 'Dissolving', 'Fast-acting'],
        imageSrc: '/img/product-images/prescriptions/x-melts.png',
        productHref: 'x-melts',
    },
    {
        id: 2,
        productName: 'X Chews',
        subtitle: 'Tadalafil + Oxytocin',
        price: 99.83,
        tags: ['Daily', 'Chewable', 'Fast-acting'],
        imageSrc: '/img/product-images/prescriptions/x-chews.png',
        productHref: 'x-chews',
    },
];


const currentMatch = {
    id: 4,
    productName: 'Peak Chews',
    subtitle: 'Tadalafil',
    imageSrc: '/img/product-images/prescriptions/peak-chews.png',
    productHref: 'peak-chews',
};

export default function DailyFastActingComponent() {

    const fullPath = usePathname();
    const isXEDFlow = fullPath.includes('x-melts') || fullPath.includes('x-chews');
    const isEDGlobal = fullPath.includes('ed-global');

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
                        subtitle={mockCurrentTreatment.subtitle}
                        imageSrc={mockCurrentTreatment.imageSrc}
                        productHref={mockCurrentTreatment.productHref}
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
