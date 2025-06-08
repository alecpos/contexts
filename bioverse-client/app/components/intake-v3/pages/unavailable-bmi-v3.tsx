'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { QUESTION_HEADER_NO_COLOR_TAILWIND } from '../styles/intake-tailwind-declarations';
import { useParams } from 'next/navigation';
import { Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';

export default function UnavailableBMIV3({}) {
    const params = useParams();
    const product_href = params.product;
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    return (
        <div className='mx-auto max-w-7xl p-2 mt-[1.25rem] md:mt-[48px]'>
            <div className='flex flex-row gap-10 items-center justify-center'>
                <div className='flex flex-col gap-8 md:min-w-[456px] max-w-[456px]'>
                    <BioType
                        className={`inter-h5-question-header`}
                    >
                        Unfortunately, you&apos;re not a candidate for GLP-1
                        treatment through our platform at this time.
                    </BioType>
                    <Link
                        href='/collections'
                        onClick={() => setButtonLoading(true)}
                    >
                        <Button
                            variant='contained'
                            fullWidth
                            className='intake-subtitle-bold normal-case'
                            sx={{
                                width: {
                                    xs: '100%',
                                    sm: '100%',
                                },
                                height: '52px',
                                // '@media (min-width:768px)': {
                                //     width: '118px',
                                // },
                                // position: { xs: 'fixed', sm: 'static' },
                                // bottom: { xs: bottomXs, sm: 0 },
                                zIndex: 30,
                                backgroundColor: '#000000',
                                '&:hover': {
                                    backgroundColor: '#666666',
                                },
                                borderRadius: '12px',
                            }}
                        >
                            {buttonLoading ? (
                                <CircularProgress
                                    sx={{ color: 'white' }}
                                    size={22}
                                />
                            ) : (
                                'Back to BIOVERSE'
                            )}
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
