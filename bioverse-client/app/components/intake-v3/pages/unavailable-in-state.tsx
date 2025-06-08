'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';

interface UnavailableInStateProps {}

export default function UnavailableInState({}: UnavailableInStateProps) {
    return (
        <div className="mx-auto max-w-7xl p-2 mt-[1.25rem] md:mt-[48px]">
            <div className="flex flex-row gap-10 items-center justify-center">
                <div className="flex flex-col gap-8 md:min-w-[456px] max-w-[456px]">
                    <div className="gap-4 flex-col flex">
                        <BioType className={`inter-h5-question-header`}>
                            We currently do not offer this treatment in your
                            state. Please select one of our other products.
                        </BioType>
                    </div>
                </div>
            </div>
        </div>
    );
}
