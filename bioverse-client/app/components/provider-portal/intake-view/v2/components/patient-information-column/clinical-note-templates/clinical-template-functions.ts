'use server';

import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import {
    PRODUCT_TEMPLATE_MAPPING,
    TEMPLATIZED_PRODUCT_LIST,
} from '@/app/utils/constants/clinical-note-template-product-map';
import {
    createTemplatizedClinicalNote,
    findClinicalNoteTemplateRecordByOrderId,
} from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
import { createClinicalNoteValuesFromTemplate } from '../../../utils/clinical-notes/clinical-note-functions';
import { Status } from '@/app/types/global/global-enumerators';
import { OrderType } from '@/app/types/orders/order-types';
import { getQuestionAnswerWithQuestionID } from '@/app/utils/database/controller/questionnaires/questionnaire';
import { PRODUCT_TEMPLATE_LATEST_VERSION_MAP } from '@/app/utils/constants/clinical-note-template-latest-versions';

export async function getOrCreateClinicalNoteTemplate(
    product_href: PRODUCT_HREF,
    order_id: string | number,
    patient_id: string,
    provider_id: string,
    renewal_order_id?: string
): Promise<Partial<ClinicalNoteRecordWithPatientProviderData> | null> {
    if (!TEMPLATIZED_PRODUCT_LIST.includes(product_href)) {
        return null;
    }

    let templatizedNote;

    //clinical_note_data will be null if there is none.
    const clinical_note_data = await findClinicalNoteTemplateRecordByOrderId(
        order_id,
        renewal_order_id ?? undefined
    );

    if (!clinical_note_data) {
        const orderType = renewal_order_id ? 'renewal' : 'intake';
        const latestVersion =
            PRODUCT_TEMPLATE_LATEST_VERSION_MAP[product_href][orderType];
        const template =
            PRODUCT_TEMPLATE_MAPPING[product_href][orderType][latestVersion];
        const values = createClinicalNoteValuesFromTemplate(template);

        const created_note = await createTemplatizedClinicalNote(
            order_id,
            product_href,
            patient_id,
            values,
            provider_id,
            renewal_order_id
        );

        templatizedNote = created_note;
    } else {
        templatizedNote = clinical_note_data;
    }

    return templatizedNote;
}

export async function createClinicalNoteTemplate(
    product_href: PRODUCT_HREF,
    order_id: string | number,
    patient_id: string,
    provider_id: string,
    renewal_order_id?: string,
    order_type_override?: OrderType
) {
    if (!TEMPLATIZED_PRODUCT_LIST.includes(product_href)) {
        return null;
    }

    let orderType;
    if (!order_type_override) {
        orderType = renewal_order_id ? 'renewal' : 'intake';
    } else {
        orderType =
            order_type_override === OrderType.Order ? 'intake' : 'renewal';
    }

    const latestVersion =
        PRODUCT_TEMPLATE_LATEST_VERSION_MAP[product_href][orderType];

    const template =
        PRODUCT_TEMPLATE_MAPPING[product_href][orderType][latestVersion];
    let question_answers;

    if (
        [PRODUCT_HREF.TIRZEPATIDE, PRODUCT_HREF.SEMAGLUTIDE].includes(
            product_href
        )
    ) {
        const [question1943Data, question1944Data, question1945Data] =
            await Promise.all([
                getQuestionAnswerWithQuestionID('1943', patient_id),
                getQuestionAnswerWithQuestionID('1944', patient_id),
                getQuestionAnswerWithQuestionID('1945', patient_id),
            ]);
        question_answers = {
            question1943Data: question1943Data,
            question1944Data: question1944Data,
            question1945Data: question1945Data,
        };
    }

    const values = createClinicalNoteValuesFromTemplate(
        template,
        question_answers
    );

    const created_note = await createTemplatizedClinicalNote(
        order_id,
        product_href,
        patient_id,
        values,
        provider_id,
        order_type_override === OrderType.Order ? undefined : renewal_order_id
    );

    if (created_note) {
        return Status.Success;
    } else {
        return Status.Failure;
    }
}
