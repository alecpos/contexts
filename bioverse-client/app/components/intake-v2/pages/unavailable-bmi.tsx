'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import { useParams } from 'next/navigation';

interface UnavailableInAreaProps {}

export default function UnavailableBMI({}: UnavailableInAreaProps) {
    const params = useParams();
    const product_href = params.product;

    return (
        <div className='mx-auto max-w-7xl p-2'>
            <div className='flex flex-row gap-10 items-center justify-center'>
                <div className='flex flex-col gap-8 md:min-w-[456px] max-w-[456px]'>
                    <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                        We&apos;re sorry!
                    </BioType>
                    <div className='gap-4 flex-col flex'>
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            Your BMI does not meet the requirements to be
                            eligible for {product_href}.
                        </BioType>
                        <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                            If you entered your weight or height incorrectly,
                            you may select back to enter them accurately.
                        </BioType>
                    </div>
                </div>
            </div>
        </div>
    );
}
