'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import MultiSelectItem from '@/app/components/intake-v2/questions/question-types/multi-select/multi-select-item';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import { useRouter } from 'next/navigation';
import React from 'react';
// import RefillQuestionItem from '../../ChangeRefillDate/ChangeRefillQuestionItem';
import { FormGroup } from '@mui/material';
import ChangeRefillOfferItem from './ChangeRefillOfferItem';
import { addDeltaToDate } from '@/app/utils/functions/dates';
import MultiSelectItemSM from '@/app/components/intake-v2/questions/question-types/multi-select/multi-select-item-sm';
import {
    getQuestionAnswerVersionWithQuestionID,
    getQuestionsForProduct_with_type,
} from '@/app/utils/database/controller/questionnaires/questionnaire';
import { SubscriptionDetails } from '../../../types/subscription-types';

interface Props {
    subscription_id: number;
    subscription: SubscriptionDetails;
    date: Date;
}
const question = {
    type: 'checkbox',
    other: false,

    options: [
        { label: 'Yes, delay refill for 180 days. ', delta: 180, mode: 'd' },
        { label: 'Yes, delay refill for 90 days. ', delta: 90, mode: 'd' },
        { label: 'Yes, delay refill for 60 days. ', delta: 60, mode: 'd' },
        { label: 'Yes, delay refill for 30 days. ', delta: 30, mode: 'd' },
    ],
    question: 'Change your next refill',
    singleChoice: true,
};

const ChangeRefillOffer = ({ subscription_id, subscription, date }: Props) => {
    const router = useRouter();

    const cancelSubscription = async () => {
        const questions_array = await getQuestionsForProduct_with_type(
            subscription.href,
            'cancel'
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
        router.push(
            `/portal/subscriptions/cancel-flow/${subscription_id}/feedback/${questions_array[0].question_id}`
        );
    };
    return (
        <div className='container mx-auto w-full mt-[var(--nav-height)] max-w-[456px] min-h-[90vh]'>
            <div className='w-full mt-9 md:mt-[160px]'>
                <div className='flex flex-col space-y-[14px]'>
                    <BioType className='h6 text-[24px] md:text-[28px] text-black'>
                        Would you like to change your refill date instead?
                    </BioType>
                    <BioType className='body1 text-black'>
                        Changing your refill date will ensure you&apos;re able
                        to receive future refills on your prescription.
                    </BioType>
                </div>
                <FormGroup className='gap-3 mt-3'>
                    {question.options.map((option, index) => (
                        <ChangeRefillOfferItem
                            key={index}
                            option={option}
                            selected={false}
                            handleCheckboxChange={() => {
                                router.push(
                                    `/portal/subscriptions/refill/${subscription_id}/confirm?delta=${option.delta}&mode=${option.mode}&redirect=true`
                                );
                            }}
                            date={addDeltaToDate(
                                date,
                                option.delta,
                                option.mode
                            ).toLocaleDateString()}
                        />
                    ))}

                    <MultiSelectItemSM
                        variant='vs'
                        option='No, thank you'
                        showCheck={false}
                        selected={false}
                        handleCheckboxChange={cancelSubscription}
                        intake={false}
                    />
                </FormGroup>
            </div>
        </div>
    );
};

export default ChangeRefillOffer;
