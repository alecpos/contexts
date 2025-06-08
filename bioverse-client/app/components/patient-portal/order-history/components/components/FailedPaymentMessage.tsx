'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Link from 'next/link';

interface Props {
    prescription: string;
}
export default function FailedPaymentMessage({ prescription }: Props) {
    return (
        <div className='w-full border rounded-[4px] border-solid border-[#D32F2F] bg-[#f9f9f9] flex space-x-4 px-[16px] py-[14px] justify-between'>
            <div className='flex items-start space-x-4'>
                <ErrorOutlineIcon sx={{ color: '#D32F2F', fontSize: 22 }} />
                <div className='flex flex-col space-y-2 max-w-[360px]'>
                    <BioType className='body1bold text-[16px] text-[#5F2120]'>
                        Please update your payment information.
                    </BioType>
                    <BioType className='body1 text-[16px] text-[#5F2120]'>
                        We’re unable to process your order for {prescription}{' '}
                        due to invalid card information. Please confirm your
                        payment method.
                    </BioType>
                </div>
            </div>
            <div className='justify-self-end'>
                <Link
                    href={'/portal/account-information'}
                    className='no-underline'
                >
                    <BioType className='body1 text-[16px] text-[#5F2120] hover:text-[#8B3A3A]'>
                        UPDATE PAYMENT
                    </BioType>
                </Link>
            </div>
        </div>
    );
}
