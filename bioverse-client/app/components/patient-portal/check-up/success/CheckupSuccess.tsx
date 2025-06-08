'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ContinueButton from '@/app/components/intake-v2/buttons/ContinueButton';
import { Button, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CheckupProgressBar from '../question/CheckupProgressBar';
import ContinueButtonV3 from '@/app/components/intake-v3/buttons/ContinueButtonV3';

interface CheckupSuccessProps {
    questionnaireName: string;
}

export default function CheckupSuccess({
    questionnaireName,
}: CheckupSuccessProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const onClick = () => {
        setLoading(true);
        router.push('/portal/account-information');
        setLoading(false);
    };

    return (
        <div className='flex flex-col sm:max-w-[490px] mt-2 animate-slideRight items-center gap-4'>
            <CheckupProgressBar
                quesionnaire_junction={[]}
                current_question_id={0}
            />
            <div className='flex flex-col gap-2 my-6'>
                <BioType className='inter_h5_regular text-[#000000E5]'>
                    Your request is on the way to your Care Team for review.
                </BioType>
                <BioType className='inter_body_regular text-[#333333BF]'>
                    A provider will reach out if they need more information from
                    you.
                </BioType>
            </div>

            <ContinueButtonV3
                buttonLoading={loading}
                onClick={onClick}
                isCheckup={true}
            />
        </div>
    );
}
