'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getProviderDoseSpotIdWithId } from '@/app/utils/database/controller/providers/providers-api';
import { getDoseSpotIframeUrlForGeneral } from '@/app/services/dosespot/v1/iframe-url/iframe-url-generator';
import { Paper } from '@mui/material';
import { useState, useEffect } from 'react';

interface Props {
    providerId: string;
}

export default function DoseSpotIframeGeneralContainer({ providerId }: Props) {
    const [url, setUrl] = useState<string>('');

    const getDoseSpotUrl = async () => {
        const doseSpotClincianId = await getProviderDoseSpotIdWithId(
            providerId
        );
        const { url: iFrameUrl } = await getDoseSpotIframeUrlForGeneral(
            doseSpotClincianId
        );

        setUrl(iFrameUrl);
    };

    useEffect(() => {
        getDoseSpotUrl();
    }, []);
    return (
        <>
            <Paper className='w-full flex flex-col'>
                <div className='flex flex-col items-center gap-2 p-8'>
                    <BioType className='h6 text-primary'>
                        Dose Spot Prescribing Interface
                    </BioType>
                    <iframe src={url} className='w-full aspect-[16/9]'></iframe>
                </div>
            </Paper>
        </>
    );
}
