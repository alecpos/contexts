'use server';

import { Status } from '@/app/types/global/global-enumerators';
import { LabWorkDocument, LabWorkFile } from '@/app/types/patient-portal/labs';
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

export async function getLabWorkDocumentNames(patientId: string) {
    const supabase = createSupabaseServiceClient();

    try {
        const { error, data: documents } = await supabase
            .from('lab_work_document')
            .select('*')
            .eq('patient_id', patientId)
            .order('id', { ascending: false });

        if (error) {
            throw error;
        }

        return documents;
    } catch (error) {
        console.error('An error occured:', error);
    }
}

export async function getLabWorkSignedURL(
    documentId: number,
    patientId: string
) {
    const supabase = createSupabaseServiceClient();
    try {
        const { error: queryError, data } = await supabase
            .from('lab_work_file')
            .select('filename')
            .eq('lab_work_document_id', documentId)
            .single();

        if (queryError) {
            throw queryError;
        }

        const fileName = `${patientId}/${data.filename}`;
        const { error, data: fileUrl } = await supabase.storage
            .from('lab_work_file_uploads')
            .createSignedUrl(fileName, 60);

        if (error) {
            console.error('getLabWorkSignedURL error', error);
        }

        return fileUrl;
    } catch (error) {
        alert(
            'An error occurred while downloading the file. Please try again.'
        );
        console.error('An error occurred:', error);

        return null;
    }
}

/**
 * Insert a lab work document and corresponding file into the database.
 *
 * @async
 * @param {string} documentName - The name of the lab document.
 * @param {string} fileName - The file name of the uploaded lab work.
 * @param {SupabaseClient} supabase - The Supabase client instance.
 */
export const uploadLabDocument = async (
    documentName: string,
    patientId: string,
    lab_work_type: string,
    file: File
) => {
    const supabase = createSupabaseServiceClient();

    // Generate a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExt = file.name.split('.').pop();
    const fileName = `${uniqueSuffix}.${fileExt}`;

    // Put the file inside a unique folder for the user
    const filePath = `${patientId}/${fileName}`;

    try {
        let { error, data: upload_data } = await supabase.storage
            .from('lab_work_file_uploads')
            .upload(filePath, file);

        if (error) {
            throw error;
        }

        // Create a new lab work document entry
        const document: LabWorkDocument = {
            lab_work_type: lab_work_type,
            document_name: documentName,
            patient_id: patientId,
        };

        // Get the id of the new entry for the new lab work file entry
        const { error: documentError, data } = await supabase
            .from('lab_work_document')
            .insert(document)
            .select('id')
            .single();

        if (documentError) {
            // TODO: delete the uploaded file and rollback database insert
            throw documentError;
        }

        // Create a new lab work file entry
        const workFile: LabWorkFile = {
            filename: fileName,
            lab_work_document_id: data.id, // Put the inserted document id here,
        };

        const { error: fileError } = await supabase
            .from('lab_work_file')
            .insert(workFile);

        if (fileError) {
            // TODO: delete the uploaded file and rollback database insert
            throw fileError;
        }
    } catch (error) {
        console.error('error uploading labs', error);
        return { status: Status.Failure };
    }

    return { status: Status.Success };
};
