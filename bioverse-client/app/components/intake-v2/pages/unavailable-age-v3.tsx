'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { INTAKE_PAGE_HEADER_TAILWIND } from '../styles/intake-tailwind-declarations';

interface UnavailableDueToAgeProps {}

export default function UnavailableDueToAgeV3({}: UnavailableDueToAgeProps) {
    return (
        <div className="mx-auto max-w-7xl p-2 mt-8">
            <div className="flex flex-row gap-10 items-center justify-center">
                <div className="flex flex-col gap-8 md:min-w-[456px] max-w-[456px]">
                    <BioType className={`inter-h5-question-header`}>
                    Unfortunately, you&apos;re not a candidate for treatment through our platform at this time.
                    </BioType>
                </div>
            </div>
        </div>
    );
}
