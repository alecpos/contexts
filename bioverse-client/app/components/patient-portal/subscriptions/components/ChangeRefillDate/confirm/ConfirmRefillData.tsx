'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import { Button, Link, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {
    addDeltaToDate,
    convertDateToEpoch,
} from '@/app/utils/functions/dates';
import { changeSubscriptionRenewalDate } from '@/app/services/stripe/subscriptions';
import {
    getQuestionAnswerVersionWithQuestionID,
    getQuestionsForProduct_with_type,
} from '@/app/utils/database/controller/questionnaires/questionnaire';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import { SubscriptionDetails } from '../../../types/subscription-types';
import { logPatientAction } from '@/app/utils/database/controller/patient_action_history/patient-action-history';
import { PatientActionTask } from '@/app/utils/database/controller/patient_action_history/patient-action-history-types';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';

interface Props {
    stripe_subscription_id: string;
    subscription_id: number;
    imageUrl: string;
    oldRefillDate: Date;
    subscriptionData: SubscriptionDetails;
    productVariant: any;
    userId: string;
}
const ConfirmRefillData = ({
    stripe_subscription_id,
    subscription_id,
    imageUrl,
    oldRefillDate,
    subscriptionData,
    productVariant,
    userId,
}: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const delta = searchParams.get('delta') ?? '0';
    const mode = searchParams.get('mode') ?? 'w';
    const redirect = searchParams.get('redirect') ?? false;

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

    // const user_id = (await readUserSession()).data.session?.user.id!;

    const handleConfirmRefillChange = async () => {
        const newDate = addDeltaToDate(oldRefillDate, Number(delta), mode);
        const newDateEpoch = convertDateToEpoch(newDate);

        const result = await changeSubscriptionRenewalDate(
            subscription_id,
            stripe_subscription_id,
            newDateEpoch,
            Number(delta)
        );

        const questions_array = await getQuestionsForProduct_with_type(
            subscriptionData.href,
            'refill'
        );

        const answerSetVersion = await getQuestionAnswerVersionWithQuestionID(
            questions_array[0].question_id
        );

        if (answerSetVersion === null) {
            console.log('Error fetching most recent answer version set');
        }
        if (answerSetVersion == 0 || answerSetVersion) {
            const incrementedVersion = answerSetVersion + 1;
            localStorage.setItem(
                'answerSetVersion',
                incrementedVersion.toString()
            );
        } else {
            localStorage.setItem('answerSetVersion', `0`);
        }

        await logPatientAction(userId, PatientActionTask.REFILL_DATE_CHANGED, {
            new_end_date: convertTimestamp(newDate.toISOString()),
        });

        await triggerEvent(userId, RudderstackEvent.REFILL_DATE_CHANGED, {
            refill_date: newDate.toLocaleDateString(),
        });

        // Checks for redirect to feedback or to subscription page
        if (redirect) {
            router.push(`/portal/subscriptions/${subscription_id}`);
        } else {
            router.push(
                `/portal/subscriptions/refill/${subscription_id}/feedback/${questions_array[0].question_id}?delta=${delta}&new=${newDateEpoch}&mode=${mode}`
            );
        }
    };
    return (
        <div className='container mx-auto w-full  max-w-[456px]'>
            <div className='w-full '>
                <div className='flex flex-col items-center  md:pt-[80px] pt-[18px]'>
                    <BioType className='h5  text-black'>
                        Here&apos;s your new refill date.
                    </BioType>

                    <Card
                        className='mt-[28px] bg-F9F9F9 '
                        sx={{
                            maxWidth: 500,
                            padding: '16px',
                            backgroundColor: '#F6F9FB',
                        }}
                    >
                        <CardMedia
                            component='img'
                            image={imageUrl}
                            alt='product-image'
                            className='h-[211px] md:h-[318px] bg-[#F4F4F4]'
                            style={{
                                objectFit: 'contain',
                                height: '318px',
                            }}
                        />
                        <CardContent
                            style={{
                                padding: '0px',
                            }}
                        >
                            <BioType className='md:h5 subtitle1 mt-5'>
                                {subscriptionData.name}
                            </BioType>
                            <BioType className='body1  mt-4'>
                                A{' '}
                                {subscriptionData.subscription_type ===
                                'monthly'
                                    ? '1-'
                                    : '3-'}
                                month supply{' '}
                                {productVariant !== 'undefined' &&
                                productVariant !== null
                                    ? `of ${productVariant}`
                                    : ``}
                            </BioType>
                            <BioType className='body1  text-textSecondary  decoration-textSecondary mt-6 mb-4'>
                                Change your mind?{' '}
                                <Link
                                    className=' text-textSecondary decoration-textSecondary hover:cursor-pointer'
                                    onClick={() => {
                                        router.push('/portal/subscriptions');
                                    }}
                                >
                                    Back to subscription
                                </Link>
                            </BioType>
                            <HorizontalDivider
                                backgroundColor='#1B1B1B1F'
                                height={1}
                            />
                            <div className=' border-[#1B1B1B1F] py-4 flex flex-col gap-3'>
                                <div className='flex  justify-between '>
                                    <BioType className='body1 text-textSecondary'>
                                        Old refill date
                                    </BioType>
                                    <BioType className='body1 '>
                                        {oldRefillDate.toLocaleDateString()}
                                    </BioType>
                                </div>

                                <div className='flex justify-between gap-3'>
                                    <BioType className='body1 text-textSecondary'>
                                        New refill date
                                    </BioType>
                                    <BioType className='body1 '>
                                        {addDeltaToDate(
                                            oldRefillDate,
                                            Number(delta),
                                            mode
                                        ).toLocaleDateString()}
                                    </BioType>
                                </div>
                            </div>
                            <HorizontalDivider
                                backgroundColor='#1B1B1B1F'
                                height={1}
                            />
                            <div className='flex gap-2 rounded border border-solid border-[#D8D8D8] px-4 py-3 mt-5'>
                                <div className=''>
                                    <ErrorOutlineIcon className='text-[#ACAEB0]' />
                                </div>

                                <BioType className='body1'>
                                    Any orders that have already been processed
                                    by the pharmacy will continue to ship. To
                                    change your refill date, request it from
                                    your Subscriptions page.
                                </BioType>
                            </div>
                        </CardContent>
                    </Card>

                    <div className='flex justify-center mt-6 w-full md:w-auto'>
                        <Button
                            variant='contained'
                            className='w-full md:w-auto'
                            sx={{
                                height: '52px',
                            }}
                            onClick={handleConfirmRefillChange}
                        >
                            <BioType className='body1 text-white'>
                                CONFIRM CHANGES
                            </BioType>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmRefillData;
