'use client';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getPreQuestionsForProduct_with_Version } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { AB_TESTS_IDS } from '../types/intake-enumerators';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';
import { VWO_TEST_QUESTIONNAIRES_VERSION_MAPPINGS } from '../../intake-v2/constants/route-constants';
import { getActiveVWOTestIDForQuestionnaire } from '@/app/utils/functions/client-utils';

interface PreQuestionComponentProps {
    product_href: string;
}
export default function PreQuestionComponent({
    product_href,
}: PreQuestionComponentProps) {
    const searchParams = useSearchParams();

    const router = useRouter();

    useEffect(() => {
        const performAction = async () => {
            if (typeof window === 'undefined') return;

            const vwo_test_ids: string[] = JSON.parse(
                localStorage.getItem('vwo_ids') || '[]'
            );

            const activeVWOTestId = getActiveVWOTestIDForQuestionnaire(
                vwo_test_ids,
                product_href as PRODUCT_HREF
            );

            if (activeVWOTestId) {
                const questionArr =
                    await getPreQuestionsForProduct_with_Version(
                        product_href as PRODUCT_HREF,
                        activeVWOTestId
                    );

                router.push(
                    `/intake/prescriptions/${product_href}/pre-questions/${
                        questionArr[0].question_id
                    }?${searchParams.toString()}`
                );
            } else {
                router.push('/error');
            }
        };
        performAction();
    }, [product_href, router]);

    return <LoadingScreen />;
}
