'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import MultiSelectItemSM from '@/app/components/intake-v2/questions/question-types/multi-select/multi-select-item-sm';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import { getDateMonthDifference } from '@/app/utils/functions/dates';
import { FormGroup } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SubscriptionDetails } from '../../types/subscription-types';

interface Props {
    name: any;
    subscription_id: number;
    subscription: SubscriptionDetails;
    isWeightlossProduct: boolean;
}

const CancelSubscriptionConfirm = ({
    name,
    subscription_id,
    subscription,
    isWeightlossProduct,
}: Props) => {
    const router = useRouter();
    const [openFailureSnackbar, setOpenFailureSnackbar] =
        React.useState<boolean>(false);
    const [failureMessage, setFailureMessage] = React.useState<string>('');

    const cancelSubscription = async () => {
        router.push(
            `/portal/subscriptions/cancel-flow/${subscription_id}/change-refill`
        );
    };

    const displayTreatmentTime = () => {
        if (subscription.subscription_type == 'monthly') {
            if (subscription.renewal_count <= 1) {
                return '1 month';
            } else {
                return `${subscription.renewal_count} months`;
            }
        } else {
            if (subscription.renewal_count == 0) {
                const currentDate = new Date();
                const differenceInMonths = getDateMonthDifference(
                    currentDate,
                    subscription.created_at
                );
                if (differenceInMonths <= 1) {
                    return '1 month';
                } else {
                    return `${differenceInMonths} months`;
                }
            } else if (subscription.renewal_count == 1) {
                return `3 months`;
            } else {
                return `${subscription.renewal_count * 3} months`;
            }
        }
    };
    return (
        <div className='container mx-auto w-full mt-[var(--nav-height)] max-w-[456px] min-h-[90vh]'>
            <div className='w-full mt-9 md:mt-[160px]'>
                <div className='flex flex-col space-y-[14px]'>
                    <BioType className='h6 text-[24px] md:text-[28px] text-black'>
                        Hey{name ? ' ' + name : ''}, you&apos;ve only had{' '}
                        {subscription.name} treatment for{' '}
                        {displayTreatmentTime()}.
                    </BioType>
                    {isWeightlossProduct && (
                        <BioType className='body1 text-black'>
                            You should expect to see results from your treatment
                            after approximately 3 months of use, as prescribed.
                            Most BIOVERSE patients typically see results in 3
                            months.
                        </BioType>
                    )}

                    <BioType className='body1 text-black'>
                        Want to stick with it for a bit longer?
                    </BioType>
                </div>
                <FormGroup className='gap-3 mt-3'>
                    <MultiSelectItemSM
                        variant='vs'
                        option="Okay, I'll keep my treatment"
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
                        option="I'd still like to cancel"
                        showCheck={false}
                        selected={false}
                        handleCheckboxChange={cancelSubscription}
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
};

export default CancelSubscriptionConfirm;
