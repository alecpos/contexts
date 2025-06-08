'use server';

import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';

export async function uploadPatientDocumentDB(
    patient_id: string,
    document_type: string,
    file_url: string
) {
    const supabase = createSupabaseServerComponentClient();

    try {
        const { data, error } = await supabase
            .from('patient_document_uploads')
            .upsert(
                { patient_id, document_type, file_url },
                { onConflict: 'patient_id, document_type' }
            );

        if (error) {
            console.error('Error updating patient document on DB:', error);
            throw error;
        }
    } catch (error: any) {
        console.error('Error in uploading document:', error);
    }
}

export async function getDocumentUploads(
    patient_id: string
): Promise<DocumentUpload[] | null> {
    const supabase = createSupabaseServerComponentClient();

    // Perform the update
    const { data, error } = await supabase
        .from('patient_document_uploads')
        .select('*')
        .eq('patient_id', patient_id);

    if (error) {
        console.error('Error getting patient documents on DB:', error);

        return null;
    }

    return data;
}

export async function getDocumentURL(filePath: string) {
    const supabase = await createSupabaseServerComponentClient();

    const { data: urlData, error } = await supabase.storage
        .from('document_uploads')
        .createSignedUrl(filePath, 60 * 60);

    if (error) {
        console.log('getDocumentUrl', error);
        return { data: null, error: error };
    } else return { data: urlData, error: error };
}
