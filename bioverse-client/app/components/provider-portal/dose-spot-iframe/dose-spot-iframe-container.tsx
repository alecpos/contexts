import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getProviderDoseSpotIdWithId } from '@/app/utils/database/controller/providers/providers-api';
import { getDoseSpotIframeUrlForPatient } from '@/app/services/dosespot/v1/iframe-url/iframe-url-generator';
import { Paper } from '@mui/material';
import { useState, useEffect } from 'react';

interface Props {
    patientDoseSpotId: string;
    providerId: string;
}

export default function DoseSpotIframeContainer({
    providerId,
    patientDoseSpotId,
}: Props) {
    const [url, setUrl] = useState<string>('');

    useEffect(() => {
        const getDoseSpotUrl = async () => {
            const doseSpotClincianId = await getProviderDoseSpotIdWithId(
                providerId
            );
            const { url: iFrameUrl } = await getDoseSpotIframeUrlForPatient(
                doseSpotClincianId,
                patientDoseSpotId
            );
            setUrl(iFrameUrl);
        };

        getDoseSpotUrl();
    }, [patientDoseSpotId, providerId]);
    return (
        <>
            <Paper className='w-full flex flex-col'>
                <div className='flex flex-col items-center gap-2 p-8'>
                    <BioType className='h6 text-primary'>
                        Dose Spot Interface
                    </BioType>
                    <BioType className='label1 text-red-800'>
                        Please remember to update the status for this
                        prescription manually after completing the DoseSpot
                        script.
                    </BioType>
                    <iframe src={url} className='w-full aspect-[16/9]'></iframe>
                </div>
            </Paper>
        </>
    );
}
