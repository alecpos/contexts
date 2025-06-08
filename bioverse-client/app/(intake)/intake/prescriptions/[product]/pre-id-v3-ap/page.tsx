import { createSupabaseServerComponentClient } from '@/app/utils/clients/supabaseServerClient';
import { redirect } from 'next/navigation';
import PreIdScreen from '@/app/components/intake-v3/pages/pre-id-v3-ap';
import { getIDVerificationData } from '@/app/utils/database/controller/profiles/profiles';

interface PreIdVerificationProps {
    params: {
        product: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function PreIdVerificationPage({
params,
    searchParams,
}: PreIdVerificationProps) {
    const supabase = createSupabaseServerComponentClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    const { license, selfie } = await getIDVerificationData(session.user.id);

    return (
        <PreIdScreen
            user_id={session.user.id}
            preExistingLicense={license}
            preExistingSelfie={selfie}
            productName={params.product}
        />
    );
} 
