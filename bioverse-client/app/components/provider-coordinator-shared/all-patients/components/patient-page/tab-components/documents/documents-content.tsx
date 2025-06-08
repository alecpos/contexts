import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import useSWR from 'swr';

import { getDocumentUploads } from '@/app/utils/database/controller/patient_document_uploads/patient_document_uploads';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { getLabWorkDocumentNames } from '@/app/utils/database/storage/lab-work-documents/lab-work-documents';
import { useEffect } from 'react';
import LabWorkComponent from './document-type-components/lab-work-ptChart';
import LicenseSelfieDocuments from './document-type-components/license-selfie-ptChart';
import { getLicenseSelfieSignedURL } from '@/app/utils/database/storage/license-selfie/license-selfie';
import SkinCareUploadComponent from './document-type-components/skin-care-upload-ptChart';
import { getSkinCareFaceUploads } from '@/app/utils/database/storage/skin-care-face-pictures/skin-care-face-uploads';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

interface InvoiceTabProps {
    access_type: BV_AUTH_TYPE | null;
    profile_data: APProfileData;
}

async function getAllDocuments(patientId: string): Promise<{
    licenseSelfieSignedURLs: { license: string; selfie: string };
    labWorkDocuments: any[];
    skinCareFaceURLs: {
        left_side_url: string | undefined;
        right_side_url: string | undefined;
    };
}> {
    const licenseSelfieURLs = await getLicenseSelfieSignedURL(patientId);
    const documents = await getLabWorkDocumentNames(patientId);
    const skinCareFacePictureURLs = await getSkinCareFaceUploads(patientId);

    return {
        licenseSelfieSignedURLs: {
            license: licenseSelfieURLs?.license ?? '',
            selfie: licenseSelfieURLs?.selfie ?? '',
        },
        labWorkDocuments: documents ?? [],
        skinCareFaceURLs: skinCareFacePictureURLs,
    };
}

export default function DocumentTab({ profile_data }: InvoiceTabProps) {
    const patient_id = profile_data.id;
    const { data, isLoading } = useSWR(`${patient_id}-document-data`, () =>
        getAllDocuments(patient_id)
    );

    useEffect(() => {
        console.log('doucmentation data: ', data);
    }, [data]);

    const convertTimestamp = (timestamp: string) => {
        if (!timestamp) {
            return 'not tracked';
        }

        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <div className='flex flex-col w-full gap-4 mt-4'>
                <div className='flex flex-row w-full justify-center items-center'>
                    <BioType className='h5'>Documents</BioType>
                </div>

                <div>
                    <LicenseSelfieDocuments
                        licenseURLString={data?.licenseSelfieSignedURLs.license}
                        selfieURLString={data?.licenseSelfieSignedURLs.selfie}
                    />
                </div>

                <div>
                    <SkinCareUploadComponent
                        skinCareURLs={
                            data?.skinCareFaceURLs ?? {
                                left_side_url: undefined,
                                right_side_url: undefined,
                            }
                        }
                    />
                </div>

                <div>
                    <LabWorkComponent
                        documents={data?.labWorkDocuments}
                        patientId={patient_id}
                    />
                </div>
            </div>
        </>
    );
}
