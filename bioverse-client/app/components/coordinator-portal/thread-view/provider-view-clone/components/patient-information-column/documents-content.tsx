'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import useSWR from 'swr';
import Image from 'next/image';
import { getLicenseSelfieSignedURL } from '../../utils/license-selfies/signed-url-retriever';
import { Button } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import ImageExpandDialogModal from './document-image-expand-modal';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import FlagPatientIDIssueModal from '@/app/components/provider-portal/intake-view/v2/components/patient-information-column/id-issue-modal';

interface DemographicsProps {
    patient_id: string;
    setMessageContent?: Dispatch<SetStateAction<string>>;
}

export default function DocumentAccordionContent({
    patient_id,
    setMessageContent,
}: DemographicsProps) {
    const { data, error, isLoading } = useSWR(
        `${patient_id}-license-selfie-data`,
        () => getLicenseSelfieSignedURL(patient_id)
    );

    const [imageDialog1Open, setImageDialog1Open] = useState(false);

    const [imageDialog2Open, setImageDialog2Open] = useState(false);

    const [flagPatientIDIssueModalOpen, setFlagPatientIDIssueModalOpen] =
        useState(false);

    const handleClickOpen1 = () => {
        setImageDialog1Open(true);
    };
    const handleClose1 = () => {
        setImageDialog1Open(false);
    };

    const handleClickOpen2 = () => {
        setImageDialog2Open(true);
    };
    const handleClose2 = () => {
        setImageDialog2Open(false);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error || !data) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    return (
        <div className='flex flex-col px-2 w-full gap-4'>
            <div className='flex flex-col'>
                <div className='flex flex-row py-2 w-full justify-between overflow-x-auto gap-4'>
                    <div className='flex flex-col w-full'>
                        <BioType className='itd-input'>Patient ID</BioType>
                        <div className='relative w-[1/2] aspect-[1.5] cursor-pointer'>
                            {data && (
                                <>
                                    <Image
                                        src={data.license!}
                                        alt={''}
                                        onClick={handleClickOpen1}
                                        // width={313.5}
                                        // height={196}
                                        fill
                                        unoptimized
                                    />
                                    <ImageExpandDialogModal
                                        open={imageDialog1Open}
                                        handleClose={handleClose1}
                                        image_ref={data!.license!}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col w-full h-full'>
                        <BioType className='itd-input'>Selfie</BioType>
                        <div className='relative w-[1/2] aspect-[3/2] cursor-pointer'>
                            <Image
                                src={data!.selfie!}
                                alt={''}
                                onClick={handleClickOpen2}
                                // width={313.5}
                                // height={196}
                                fill
                                unoptimized
                            />
                            <ImageExpandDialogModal
                                open={imageDialog2Open}
                                handleClose={handleClose2}
                                image_ref={data!.selfie!}
                            />
                        </div>
                    </div>
                </div>
                <BioType className='itd-body text-[#666666]'>
                    click to expand
                </BioType>
            </div>

            {setMessageContent && (
                <>
                    <div className='w-full flex justify-center mt-[14px]'>
                        <Button
                            sx={{
                                borderRadius: '12px',
                                backgroundColor: 'white',
                                paddingX: '32px',
                                paddingY: '14px',
                                ':hover': {
                                    backgroundColor: 'lightgray',
                                },
                            }}
                            onClick={() => setFlagPatientIDIssueModalOpen(true)}
                            style={{
                                border: '1px solid #CC9596',
                                maxWidth: '293px',
                            }}
                            className=''
                        >
                            <span className='normal-case provider-bottom-button-text  text-[#CC9596]'>
                                Flag issue with patient ID
                            </span>
                        </Button>
                    </div>
                    <FlagPatientIDIssueModal
                        open={flagPatientIDIssueModalOpen}
                        handleClose={() =>
                            setFlagPatientIDIssueModalOpen(false)
                        }
                        setMessageContent={setMessageContent}
                    />
                </>
            )}

            <div className='flex flex-col gap-2'>
                <div>
                    <BioType className='itd-input'>Lab Results</BioType>
                </div>
                <div className='justify-between flex flex-row'>
                    <BioType className='itd-body'>
                        [Lab submission date]
                    </BioType>
                    <Button>VIEW</Button>
                </div>
            </div>
        </div>
    );
}
