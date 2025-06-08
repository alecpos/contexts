'use client';

import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { getLabWorkDocumentNames } from '@/app/utils/database/storage/lab-work-documents/lab-work-documents';
import { getSkinCareFaceUploads } from '@/app/utils/database/storage/skin-care-face-pictures/skin-care-face-uploads';
import useSWR from 'swr';
import LabWorkProviderReview from './components/lab-work-provider-review';
import SkinCarePicturesProviderReview from './components/skin-care-upload-provider-review';
import { getAllLicenseAndSelfiePhotos } from '@/app/utils/database/storage/license-selfie/license-selfie';
import LicenseSelfiePhotosAccordian from './components/license-selfie-photos-accordion';

interface DocumentsAccordionProps {
    patientId: string;
}

async function getAllDocuments(patientId: string): Promise<{
    labWorkDocuments: any[];
    skinCareFaceURLs: {
        left_side_url: string | undefined;
        right_side_url: string | undefined;
    };
    allLicenseAndSelfiePhotos: {
        url: string;
        created_at: string;
        name: string;
    }[];
}> {
    const documents = await getLabWorkDocumentNames(patientId);
    const skinCareFacePictureURLs = await getSkinCareFaceUploads(patientId);
    const allLicenseAndSelfiePhotos = await getAllLicenseAndSelfiePhotos(
        patientId,
    );

    return {
        labWorkDocuments: documents ?? [],
        skinCareFaceURLs: skinCareFacePictureURLs,
        allLicenseAndSelfiePhotos,
    };
}

export default function DocumentsAccordionContent({
    patientId,
}: DocumentsAccordionProps) {
    const { data, isLoading } = useSWR(
        `${patientId ? `${patientId}-documents` : null}`,
        () => getAllDocuments(patientId),
    );

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <div className="flex flex-col overflow-auto h-full gap-4">
                {data?.skinCareFaceURLs && (
                    <div>
                        <SkinCarePicturesProviderReview
                            skinCareUrls={data?.skinCareFaceURLs}
                        />
                    </div>
                )}

                <div>
                    <LabWorkProviderReview
                        documents={data?.labWorkDocuments}
                        patientId={patientId}
                    />
                </div>
                <div>
                    <LicenseSelfiePhotosAccordian
                        files={data?.allLicenseAndSelfiePhotos}
                    />
                </div>
            </div>
        </>
    );
}
