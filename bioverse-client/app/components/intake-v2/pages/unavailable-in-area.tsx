'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';

interface UnavailableInAreaProps {}

export default function UnavailableInAreaV2({}: UnavailableInAreaProps) {
    return (
        <div className='mx-auto max-w-7xl p-2'>
            <div className='flex flex-row gap-10 items-center justify-center'>
                <div className='flex flex-col gap-8 md:min-w-[456px] max-w-[456px]'>
                    <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                        Unfortunately, BIOVERSE isn&apos;t available in your
                        state.
                    </BioType>
                    <div className='gap-4 flex-col flex'>
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            We can&apos;t provide you with medical care at this
                            time. We&apos;ll email you once we become available
                            in your area.
                        </BioType>
                    </div>
                </div>
            </div>
        </div>
    );
}
