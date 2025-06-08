import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button, Chip } from '@mui/material';
import InfoEditDialog from './info-edit-dialog';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { determineAccessByRoleName } from '@/app/utils/functions/auth/authorization/authorizaiton-helper';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import {  Tooltip } from '@mui/material';


interface InfoTabContent {
    access_type: BV_AUTH_TYPE | null;
    profile_data: APProfileData;
    handleChange?: (event: React.SyntheticEvent, newValue: number) => void;
}
export default function InfoTabContent({
    profile_data,
    access_type,
    handleChange,
}: InfoTabContent) {
    const router = useRouter();

    const [infoEditBoxOpen, setInfoEditBoxOpenState] = useState<boolean>(false);

    const openInfoEditBox = () => {
        setInfoEditBoxOpenState(true);
    };
    const closeInfoEditBox = () => {
        setInfoEditBoxOpenState(false);
    };

    // const [addressEditBoxOpen, setAddressEditBoxOpenState] =
    //     useState<boolean>(false);

    // const openAddressEditBox = () => {
    //     setAddressEditBoxOpenState(true);
    // };
    // const closeAddressEditBox = () => {
    //     setAddressEditBoxOpenState(false);
    // };

    const submitPatientInformationEdits = () => {
        router.refresh();
    };

    const reformatDate = (dateToFormat: string) => {
        const [year, month, day] = dateToFormat.split('-');
        const formattedDate = `${month}/${day}/${year}`;
        return formattedDate;
    };


    const searchParams = useSearchParams();

    const goToCallsTab = () => {
        if (handleChange){
            handleChange({} as React.SyntheticEvent, 12);
        }
    }




    return (
        <>
            <div className="flex flex-col w-full justify-center items-center gap-4 mt-4">
                <div className="flex flex-col items-start self-start w-full gap-2">
                    <div className="flex flex-row gap-8">
                        <BioType className="h6 underline">Profile</BioType>
                        <Chip
                            label={`Edit`}
                            sx={{
                                paddingX: 3,
                                paddingY: 2,
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                openInfoEditBox();
                            }}
                        />
                    </div>
                    <BioType className="body1">
                        Email: {profile_data.email}
                    </BioType>
                    <BioType className="body1 flex">
                        Phone Number: {profile_data.phone_number}
                        <Tooltip
                            title={
                                <>
                                   Call patient
                                </>
                            }
                            placement='right'
                        >
                            <a onClick={goToCallsTab} className='cursor-pointer'>
                                <LocalPhoneIcon
                                    className="ml-2 text-green-500"
                                    sx={{ fontSize: 20 }}
                                />
                            </a>
                        </Tooltip>
                    </BioType>

                    <BioType className="body1">
                        DOB: {reformatDate(profile_data.date_of_birth)}
                    </BioType>

                    <BioType className="body1">
                        Has uploaded ID:{' '}
                        {profile_data.license_photo_url &&
                        profile_data.selfie_photo_url ? (
                            <span className="body1bold text-primary">TRUE</span>
                        ) : (
                            <span className="body1bold text-red-400">
                                FALSE
                            </span>
                        )}
                    </BioType>
                    <BioType className="body1">
                        Region: {profile_data.state}
                    </BioType>
                    <BioType className="body1">
                        Text-Opt-In:{' '}
                        {profile_data.text_opt_in ? (
                            <span className="body1bold text-primary">TRUE</span>
                        ) : (
                            <span className="body1bold text-red-400">
                                FALSE
                            </span>
                        )}
                    </BioType>
                    <BioType className="body1">
                        Has completed intake:{' '}
                        {profile_data.intake_completed ? (
                            <span className="body1bold text-primary">TRUE</span>
                        ) : (
                            <span className="body1bold text-red-400">
                                FALSE
                            </span>
                        )}
                    </BioType>
                </div>
                <div className="flex self-start space-x-2">
                    {determineAccessByRoleName(
                        access_type,
                        BV_AUTH_TYPE.ADMIN,
                    ) && (
                        <div className="flex self-start">
                            <Button
                                variant="outlined"
                                color="success"
                                onClick={() => {
                                    window.open(
                                        `https://supabase.com/dashboard/project/pplhazgfonbrptwkzfbe/editor/29593?filter=id%3Aeq%3A${profile_data.id}`,
                                        '_blank',
                                    );
                                }}
                            >
                                Open User Supabase Profile
                            </Button>
                        </div>
                    )}

                    <div className="flex self-start">
                        <Button
                            variant="outlined"
                            color="info"
                            onClick={() => {
                                window.open(
                                    `https://app.gobioverse.com/dev/mock/order-history/${profile_data.id}`,
                                );
                            }}
                        >
                            Open User&apos;s Orders Page
                        </Button>
                    </div>

                    <div className="flex self-start">
                        <Button
                            variant="outlined"
                            color="info"
                            onClick={() => {
                                window.open(
                                    `https://app.gobioverse.com/dev/mock/subscriptions/${profile_data.id}`,
                                );
                            }}
                        >
                            Open User&apos;s Subscriptions Page
                        </Button>
                    </div>
                </div>

                {/* TODO: Add a user default shipping address and let them edit here */}
                {/* {false && (
                    <div className='flex flex-col items-start self-start w-full gap-2'>
                        <div className='flex flex-row gap-8'>
                            <BioType className='h6 underline'>
                                Address Information
                            </BioType>
                            <Chip
                                label={`Edit`}
                                sx={{
                                    paddingX: 3, // Equivalent to 'px-4'
                                    paddingY: 2, // Equivalent to 'py-2'
                                    cursor: 'pointer', // Equivalent to 'cursor-pointer'
                                }}
                                onClick={() => {
                                    openAddressEditBox();
                                }}
                            />
                        </div>
                        <div>
                            <BioType className='body1'>
                                {profile_data.address_line1},{' '}
                                {profile_data.address_line2}
                            </BioType>
                            <BioType className='body1'>
                                {profile_data.city}, {profile_data.state}
                                {'  '}
                                {profile_data.zip}
                            </BioType>
                            <BioType className='body1'>United States</BioType>
                        </div>
                    </div>
                )} */}
            </div>

            <InfoEditDialog
                onClose={closeInfoEditBox}
                onConfirm={submitPatientInformationEdits}
                profile_data={profile_data}
                dialog_open={infoEditBoxOpen}
            />
        </>
    );
}
