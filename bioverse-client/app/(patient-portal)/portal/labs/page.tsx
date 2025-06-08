import BioType from "@/app/components/global-components/bioverse-typography/bio-type/bio-type";
import MyLabsContent from "@/app/components/patient-portal/labs/labs-content";
import { createSupabaseServerComponentClient } from "@/app/utils/clients/supabaseServerClient";
import React from "react";


const MyLabsPage: React.FC = async () => {
    // Get the current user's ID
    const supabase = createSupabaseServerComponentClient();
    const { data: userData } = await supabase.auth.getSession();
    const patientId = userData.session?.user.id;

    // Get the current user's documents
    const { error, data: documents } = await supabase
        .from('lab_work_document')
        .select('*')
        .eq('patient_id', patientId)
        .order('id', { ascending: false });

    if (error) {
        console.error("An error occured:", error);
    }

    return (
        <div className='overflow-x-hidden'>
            <div className='mx-auto max-w-[650px]'>
                <div className='my-12 px-4'>
                    <BioType className='h6 mb-6 sm:text-[36px]'>
                        Your Labs
                    </BioType>
                    <MyLabsContent documents={documents || []} patientId={patientId || null} />
                </div>
            </div>
        </div>
    );
};


export default MyLabsPage;
