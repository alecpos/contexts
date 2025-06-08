'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { INTAKE_PAGE_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';

interface UnavailableDueToAgeProps {}

export default function UnavailableDueToAge({}: UnavailableDueToAgeProps) {
    return (
        <div className='mx-auto max-w-7xl p-2'>
            <div className='flex flex-row gap-10 items-center justify-center'>
                <div className='flex flex-col gap-8 md:min-w-[456px] max-w-[456px]'>
                    <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                        Unfortunately, BIOVERSE can&apos;t provider you with
                        care at this time.
                    </BioType>
                </div>
            </div>
        </div>
    );
}
