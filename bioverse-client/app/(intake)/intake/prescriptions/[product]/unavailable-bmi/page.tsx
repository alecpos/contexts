'use server';

import UnavailableBMI from '@/app/components/intake-v2/pages/unavailable-bmi';

export default async function IntakePreScreenPage() {
    return (
        <>
            <UnavailableBMI />
        </>
    );
}
