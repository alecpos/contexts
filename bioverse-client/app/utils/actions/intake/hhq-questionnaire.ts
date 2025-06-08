'use server';
import { createSupabaseServerComponentClient } from '../../clients/supabaseServerClient';

// returns [questionnaire_id, question_id, and question]
export async function getHHQQuestionsForProduct(product_href: string) {
    const supabase = await createSupabaseServerComponentClient();

    const { data, error } = await supabase.rpc(
        'get_hhq_questions_for_product',
        {
            name: product_href,
        }
    );

    if (error) {
        console.error(error, error.message);
        return null;
    }

    return data;
}

// returns [question_id, answer]
export async function getHHQAnswersForProduct(
    user_id: string,
    product_href: string
) {
    const supabase = await createSupabaseServerComponentClient();

    const { data, error } = await supabase.rpc('get_hhq_answers', {
        name: product_href,
        user_id_: user_id,
    });

    if (error) {
        console.error(error, error.message);
        return null;
    }

    return data;
}

export async function writeHHQAnswer(
    user_id: string,
    question_id: number,
    answer: any
) {
    const supabase = await createSupabaseServerComponentClient();
    const { data, error } = await supabase.from('hhq_answers').upsert(
        {
            user_id,
            question_id,
            answer,
        },
        { onConflict: 'user_id, question_id' }
    );

    if (error) {
        console.error(error, error.message);
        return null;
    }

    return data;
}
