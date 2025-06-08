'use server';

import UnavailableBMIV3 from '@/app/components/intake-v3/pages/unavailable-bmi-v3';

export default async function IntakePreScreenPage() {
    return (
        <>
            <UnavailableBMIV3 />
        </>
    );
}
