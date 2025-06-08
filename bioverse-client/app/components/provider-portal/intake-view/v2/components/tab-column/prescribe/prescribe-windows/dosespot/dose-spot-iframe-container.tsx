import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button, Paper } from '@mui/material';
import { useState, useEffect, SetStateAction } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { getDoseSpotIframeUrlForPatientV2 } from '@/app/services/dosespot/v2/iframe/iframe-url-controller-v2';
import { getProviderDoseSpotIdWithId } from '@/app/utils/database/controller/providers/providers-api';

const DynamicPatientCreationDSButton = dynamic(
    () => import('./dose-spot-buttons/patient-creation'),
    {
        loading: () => <LoadingScreen />,
    }
);

const DynamicPatientUpdateDSButton = dynamic(
    () => import('./dose-spot-buttons/patient-update'),
    {
        loading: () => <LoadingScreen />,
    }
);

interface Props {
    providerId: string;
    patient_data_recently_updated: boolean;
    patient_data: DBPatientData;
    order_data: DBOrderData;
}

export default function DoseSpotIframeContainer({
    providerId,
    patient_data_recently_updated,
    patient_data,
    order_data,
}: Props) {
    const [doseSpotId, setDoseSpotId] = useState<string | undefined>(
        patient_data.dose_spot_id
    );
    const [url, setUrl] = useState<string>();
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const getDoseSpotUrl = async () => {
        const doseSpotClincianId = await getProviderDoseSpotIdWithId(
            providerId
        );
        const { url: iFrameUrl } = await getDoseSpotIframeUrlForPatientV2(
            doseSpotId!,
            doseSpotClincianId
        );
        setUrl(iFrameUrl);
    };

    useEffect(() => {
        getDoseSpotUrl();
    }, [doseSpotId]);

    return (
        <>
            <Paper className='w-full flex flex-col'>
                <div className='flex flex-col items-center gap-2 p-8'>
                    <BioType className='h6 text-primary'>
                        Dose Spot Prescribing Interface
                    </BioType>
                    {/* <BioType className='lab1 text-red-800'>
                        Please remember to update the status for this
                        prescription manually after completing the DoseSpot
                        script.
                    </BioType> */}
                    {doseSpotId && !patient_data_recently_updated ? (
                        <>
                            {url ? (
                                <>
                                    <Button
                                        variant='contained'
                                        onClick={getDoseSpotUrl}
                                    >
                                        Refresh
                                    </Button>
                                    <iframe
                                        src={url}
                                        className='w-full aspect-[16/9]'
                                    />
                                </>
                            ) : (
                                <>
                                    <LoadingScreen />
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {doseSpotId && patient_data_recently_updated ? (
                                <>
                                    <DynamicPatientUpdateDSButton
                                        patientData={patient_data}
                                        orderData={order_data}
                                    />
                                </>
                            ) : (
                                <>
                                    <DynamicPatientCreationDSButton
                                        providerId={
                                            '24138d35-e26f-4113-bcd9-7f275c4f9a47'
                                        }
                                        patientData={patient_data}
                                        setDoseSpotId={setDoseSpotId}
                                        orderData={order_data}
                                    />
                                </>
                            )}
                        </>
                    )}
                </div>
            </Paper>
        </>
    );
}
