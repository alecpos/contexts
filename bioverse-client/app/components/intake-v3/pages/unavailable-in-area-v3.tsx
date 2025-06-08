'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';

interface UnavailableInAreaProps {}

export default function UnavailableInAreaV2({}: UnavailableInAreaProps) {
    return (
        <div className='mx-auto max-w-7xl p-2 mt-[1.25rem] md:mt-[48px]'>
            <div className='flex flex-row gap-10 items-center justify-center'>
                <div className='flex flex-col gap-8 md:min-w-[456px] max-w-[456px]'>
                  
                    <div className='gap-4 flex-col flex'>
                        <BioType className={`inter-h5-question-header`}>
                            We currently do not offer weight loss treatment in your state. Please check back soon.
                        </BioType>
                    </div>
                </div>
            </div>
        </div>
    );
}
