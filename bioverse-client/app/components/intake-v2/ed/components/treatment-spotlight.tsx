import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import Image from 'next/image';
import { FC } from 'react';
import { Chip } from '@mui/material';

interface TreatmentSpotlightProps {
    imageSrc: string;
    tags: string[];
    treatmentName: string;
    frequency: string;
}
export default function TreatmentSpotlight({
    imageSrc,
    tags,
    treatmentName,
    frequency,
}: TreatmentSpotlightProps) {
    return (
        <>
            <div>
                <BioType className='it-title md:itd-subtitle text-primary'>
                    {treatmentName}
                    <sup
                        className='text-xs align-top ml-1'
                        style={{ lineHeight: '1' }}
                    >
                        ℞
                    </sup>
                </BioType>
                <div className='flex justify-center'>
                    <Image
                        src={imageSrc}
                        height={150}
                        width={200}
                        alt={`${treatmentName} alt`}
                        unoptimized
                    />
                </div>
            </div>
            <div className='py-3 flex justify-center flex-col bg-[#e7f8f3]'>
                <h1 className='it-body font-normal text-center'>
                    Selected for you based on:
                </h1>
                <ul className='flex gap-x-2 pt-2 justify-center'>
                    <Chip
                        label={
                            frequency === 'daily' ? 'Daily use' : 'As needed'
                        }
                        color='primary'
                        variant='outlined'
                        sx={{
                            borderWidth: 1,
                            backgroundColor: '#fff',
                        }}
                    />
                    {tags.map((tag) => (
                        <li key={tag} className='list-none'>
                            <Chip
                                label={tag}
                                color='primary'
                                variant='outlined'
                                sx={{
                                    borderWidth: 1,
                                    backgroundColor: '#fff',
                                }}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
