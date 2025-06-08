'use server';

import React from 'react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import {
    createActionItem,
    getLastestActionItemForProduct,
} from '@/app/utils/database/controller/action-items/action-items-actions';
import CheckupQuestionnaireIntroPage from '@/app/components/patient-portal/check-up/CheckupQuestionnaireIntroPage';
import { getSubscriptionByProduct } from '@/app/utils/database/controller/prescription_subscriptions/prescription_subscriptions';
import { getCheckupQuestionnaireIdForProduct } from '@/app/utils/database/controller/products/products';
import { getQuestionnaireJunctionByQuestionnaireId } from '@/app/utils/database/controller/questionnaires/questionnaire';
import ActionItemFactory from '@/app/components/patient-portal/action-items/utils/ActionItemFactory';
import { createQuestionnaireSessionForCheckup } from '@/app/utils/database/controller/questionnaires/questionnaire_sessions';

interface CheckUpQuestionnairePageProps {
    params: {
        product_href: string;
    };
}

const CheckUpQuestionnairePage = async ({
    params,
}: CheckUpQuestionnairePageProps) => {
    /**
     * Searching for session to make sure user is logged in. Otherwise redirect to login.
     */
    const { data: activeSession } = await readUserSession();
    if (!activeSession.session) {
        return redirect(
            `/login?originalRef=%2Fcheck-up%2F${params.product_href}`
        );
    }
    const user_id = activeSession.session.user.id;

    /**
     * Verify valid path param.
     */
    let product_href;
    if (params.product_href.includes('checkup')) {
        product_href = extractProductHref(params.product_href);
    } else {
        product_href = params.product_href;
    }
    if (!product_href) {
        console.warn('No product href found in params, redirecting...'); // Debug no product href
        return redirect('/portal/account-information');
    }

    /**
     * Verify patient has a subscription for product.
     */
    const subscription = await getSubscriptionByProduct(product_href, user_id);
    if (!subscription) {
        console.warn(
            `No subscription found for product_href: ${product_href} and user_id: ${user_id}, redirecting...`
        ); // Debug no subscription
        return redirect(`/portal/account-information`);
    }

    /**
     * Find the last action item, such that if it does not exist it creates one so that the session exists.
     */
    const lastActionItem = await getLastestActionItemForProduct(
        user_id,
        product_href
    );
    if (!lastActionItem) {
        // console.warn('Last action item not found, creating new one...'); // Debug new action item creation
        const base_action_type = `${product_href}-checkup-1`;
        await createActionItem(user_id, base_action_type, subscription.id);
    }
    if (lastActionItem?.active === false) { //if there is a last action item but it's not active, we'll create a new one
        let base_action_type = lastActionItem?.type;

        const ActionItemInstance = new ActionItemFactory(base_action_type);
        let nextIteration = ActionItemInstance.getIteration() + 1;
        base_action_type = `${product_href}-checkup-${nextIteration}`;
        await createActionItem(user_id, base_action_type, subscription.id);
    }

    if (lastActionItem && !lastActionItem.questionnaire_session_id) {
        await createQuestionnaireSessionForCheckup(user_id, lastActionItem.id);
    }

    /**
     * Get the questionnaire id for the product.
     */
    const questionnaire_id = await getCheckupQuestionnaireIdForProduct(
        product_href
    );
    if (!questionnaire_id) {
        console.warn(
            `No questionnaire id found for product_href: ${product_href}, redirecting...`
        ); // Debug no questionnaire id
        return redirect('/portal/account-information');
    }

    /**
     * Get the junction data for the questionnaire. And find the first question's ID.
     */
    const junction_data = await getQuestionnaireJunctionByQuestionnaireId(
        questionnaire_id
    );
    if (!junction_data) {
        console.warn(
            `No junction data found for questionnaire_id: ${questionnaire_id}, redirecting...`
        ); // Debug no junction data
        return redirect('/portal/account-information');
    }
    const first_question_id = junction_data[0].question_id;
    if (!first_question_id) {
        console.warn(
            `No first question id found in junction data for questionnaire_id: ${questionnaire_id}, redirecting...`
        ); // Debug no first question id
        return redirect('/portal/account-information');
    }
    const next_question_id = junction_data[1].question_id;
    if (!next_question_id) {
        console.warn(
            `No next question id found in junction data for questionnaire_id: ${questionnaire_id}, redirecting...`
        ); // Debug no next question id
        return redirect('/portal/account-information');
    }

    return (
        <div className='w-full flex justify-center flex-grow'>
            <CheckupQuestionnaireIntroPage
                nextQuestionId={first_question_id}
                productHref={product_href}
            />
        </div>
    );

    // // Determine if questionnaire_name is a product_href (v2) or questionnaire_name (v1)
    // const questionnaire_name_not_in_product_hrefs = !ALL_PRODUCT_HREFS.includes(
    //     formattedQuestionnaireName
    // );

    // if (questionnaire_name_not_in_product_hrefs) {
    //     if (!formattedQuestionnaireName.includes('checkup')) {
    //         // console.warn("Redirecting due to missing 'checkup' in name..."); // Debug redirect reason
    //         return redirect('/portal/account-information');
    //     }

    //     const currentActionItem = new ActionItemFactory(
    //         formattedQuestionnaireName
    //     );
    //     const product_href = currentActionItem.getProductHref();

    //     var firstQuestion = await getFirstQuestion(
    //         formattedQuestionnaireName,
    //         product_href
    //     );

    //     if (
    //         !firstQuestion ||
    //         !firstQuestion.question_id ||
    //         firstQuestion.question_id === -1
    //     ) {
    //         console.warn('Creating new checkup questionnaire...'); // Debug new questionnaire creation
    //         await shouldCreateCheckupQuestionnaire(
    //             currentActionItem.getProductHref(),
    //             currentActionItem.getIteration()
    //         );
    //         firstQuestion = await getFirstQuestion(
    //             formattedQuestionnaireName,
    //             product_href
    //         );
    //         if (
    //             !firstQuestion ||
    //             !firstQuestion.question_id ||
    //             firstQuestion.question_id === -1
    //         ) {
    //             console.warn(
    //                 'Failed to create or fetch first question, redirecting...'
    //             ); // Debug failed fetch
    //             return redirect('/portal/account-information');
    //         }
    //     }
    //     const questions = await getQuestionsForProduct(
    //         formattedQuestionnaireName
    //     );

    //     const userHasActionItem = await isUserEligible(
    //         user_id,
    //         formattedQuestionnaireName
    //     );

    //     if (!userHasActionItem) {
    //         // console.warn('User not eligible, creating action item...'); // Debug action item creation
    //         const subscription = await getSubscriptionByProduct(
    //             product_href,
    //             user_id
    //         );
    //         if (!subscription) {
    //             console.error(
    //                 'Unable to fetch subscription for product',
    //                 user_id
    //             );
    //             return redirect('/portal/account-information');
    //         }
    //         const actionItem = await createActionItem(
    //             user_id,
    //             formattedQuestionnaireName,
    //             subscription.id
    //         );
    //         // console.warn('Created action item:', actionItem); // Debug action item creation
    //     }
    //     return (
    //         <div className='w-full flex justify-center flex-grow'>
    //             <CheckupQuestionnaireIntroPage
    //                 nextQuestionId={firstQuestion.question_id}
    //                 questionnaireName={formattedQuestionnaireName}
    //             />
    //         </div>
    //     );
    // } else {
    //     //Transpose questionnaire name to product href for use.
    //     const product_href = formattedQuestionnaireName;

    //     //check that the product href is a valid product href
    //     if (!ALL_PRODUCT_HREFS.includes(product_href)) {
    //         console.warn('Invalid product href, redirecting...'); // Debug invalid href
    //         return redirect('/portal/account-information');
    //     }

    //     //find the subscription by product href for the user.
    //     //does not check active & picks the most recent only
    //     const subscription = await getSubscriptionByProduct(
    //         product_href,
    //         user_id
    //     );

    //     //get the last action itme for the product from action_items table
    //     const lastActionItem = await getLastestActionItemForProduct(
    //         user_id,
    //         product_href
    //     );

    //     //if no subscription found, redirect to account information
    //     if (!subscription) {
    //         console.warn('No subscription found, redirecting...'); // Debug no subscription
    //         return redirect(`/portal/account-information`);
    //     }

    //     //if no action item found, create a new one
    //     //it will create one with the name product_href + "-checkup-1"
    //     //then if the renewal count = 1 it sends them to the checkup
    //     //otherwise it redirects to account information
    //     if (!lastActionItem) {
    //         // console.warn('Last action item not found, creating new one...'); // Debug new action item creation
    //         const base_action_type = `${product_href}-checkup-1`;
    //         await createActionItem(user_id, base_action_type, subscription.id);

    //         if (subscription.renewal_count === 1) {
    //             console.warn('Redirecting to first checkup...'); // Debug first checkup redirection
    //             return redirect(`/check-up/${base_action_type}`);
    //         }
    //         return redirect(`/portal/account-information`);
    //     }

    //     //if the action item is found, we need to get the next iteration

    //     //create factory to interface the action item's type as an iteration
    //     const ActionItemInstance = new ActionItemFactory(lastActionItem?.type);
    //     let nextIteration;
    //     //if the action item has no submission time, it is a new one so we use that
    //     //otherwise we increment the iteration by 1 since the last one has been made.
    //     if (!lastActionItem.submission_time) {
    //         nextIteration = ActionItemInstance.getIteration();
    //     } else {
    //         nextIteration = ActionItemInstance.getIteration() + 1;
    //     }

    //     const nextActionItemType = `${product_href}-checkup-${nextIteration}`;

    //     return redirect(`/check-up/${nextActionItemType}`);
    // }
};

function extractProductHref(input: string): string | null {
    const regex = /^(.+?)-checkup-\d+$/;
    const match = input.match(regex);
    return match ? match[1] : null;
}

export default CheckUpQuestionnairePage;
