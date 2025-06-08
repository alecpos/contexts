'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QuestionIDComponentPreSignupV3 from '../../intake-v3/pages/question-id-pre-signup';
import { AB_TESTS_IDS } from '../types/intake-enumerators';

export default function WLAccomplishGoalsComponent() {
    const router = useRouter();
    const [vwoTestIds, setVwoTestIds] = useState<string[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const ids = localStorage.getItem('vwo_ids');
            setVwoTestIds(ids ? JSON.parse(ids) : []);
        }
    }, []);

    const isRoTest = vwoTestIds?.includes(AB_TESTS_IDS.WL_RO_TEST);

    const options = [
        'Lose weight',
        'Improve general physical health',
        'Improve another health condition',
        'Increase my confidence in my appearance',
        'Increase energy for activities I enjoy',
        'I have another goal not listed above',
    ];

    const question = {
        type: 'checkbox',
        other: false,
        options,
        question: 'What can BIOVERSE accomplish for you?',
        customSubtitle: "I'm ready to....",
    };

    // console.log('isRoTest', isRoTest);
    // console.log('vwoTestIds', vwoTestIds);

    return (
        <QuestionIDComponentPreSignupV3
            current_question={question}
            session_storage_key='wl-accomplish-goals'
            user_id=''
        />
    );
}
