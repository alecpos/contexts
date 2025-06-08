'use client';
import React, { useEffect, useState } from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { useRouter } from 'next/navigation';
import MultiSelectItem from '@/app/components/intake-v2/questions/question-types/multi-select/multi-select-item';
import Typography from '@mui/material/Typography';
import { SubscriptionStatusCategories } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import { FormGroup, Paper } from '@mui/material';
import SubscriptionButton from '../SubscriptionButton';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import MultiSelectItemSM from '@/app/components/intake-v2/questions/question-types/multi-select/multi-select-item-sm';
import { SubscriptionDetails } from '../../types/subscription-types';

// Inside OrderItemProps definition

interface Props {
    subscription_id: number;
    subscription: SubscriptionDetails;
}

export default function CancelSubscription({
    subscription_id,
    subscription,
}: Props) {
    const router = useRouter();
    const [openFailureSnackbar, setOpenFailureSnackbar] =
        useState<boolean>(false);
    const [failureMessage, setFailureMessage] = useState<string>('');

    return (
        <div className='container mx-auto w-full mt-[var(--nav-height)] max-w-[456px] min-h-[90vh]'>
            <div className='w-full mt-9 md:mt-[160px]'>
                <div className='flex flex-col space-y-[14px] mb-2'>
                    <BioType className='h6 text-[24px] md:text-[28px] text-black'>
                        Are you sure you want to cancel your subscription?
                    </BioType>
                    <BioType className='body1 text-black'>
                        If you continue with canceling your order you will no
                        longer receive new shipments of your prescription. You
                        can reactivate your subscription at any time through
                        your Subscriptions tab.
                    </BioType>
                </div>
                <FormGroup className='gap-3 mt-3'>
                    <MultiSelectItemSM
                        variant='vs'
                        option='No, I still want my subscription'
                        showCheck={false}
                        selected={false}
                        handleCheckboxChange={() =>
                            router.push(
                                `/portal/subscriptions/${subscription_id}`
                            )
                        }
                        intake={false}
                    />
                    <MultiSelectItemSM
                        variant='vs'
                        option='Yes, I would like to cancel'
                        showCheck={false}
                        selected={false}
                        handleCheckboxChange={() =>
                            router.push(
                                `/portal/subscriptions/cancel-flow/${subscription_id}/confirm`
                            )
                        }
                        intake={false}
                    />
                </FormGroup>
            </div>
            <BioverseSnackbarMessage
                color='error'
                open={openFailureSnackbar}
                setOpen={setOpenFailureSnackbar}
                message={failureMessage}
            />
        </div>
    );
}
