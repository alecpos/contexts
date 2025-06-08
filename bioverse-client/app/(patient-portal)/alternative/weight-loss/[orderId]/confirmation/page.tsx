'use server';

import AltConfirmationScreenComponents from '@/app/components/patient-portal/alternative-selection/weight-loss/confirmation-screen/alt-confirmation-screen';

interface PageProps {}

export default async function alternativeWeightLossSelectionPage({}: PageProps) {
    return (
        <div className='w-full bg-[#F7F8F8] flex justify-center min-h-screen'>
            <>
                <AltConfirmationScreenComponents />
            </>
        </div>
    );
}
