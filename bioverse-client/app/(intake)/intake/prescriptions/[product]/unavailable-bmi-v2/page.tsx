'use server';

import UnavailableBMIV2 from '@/app/components/intake-v2/pages/unavailable-bmi-v2';

export default async function IntakePreScreenPage() {
    return (
        <>
            <UnavailableBMIV2 />
        </>
    );
}
