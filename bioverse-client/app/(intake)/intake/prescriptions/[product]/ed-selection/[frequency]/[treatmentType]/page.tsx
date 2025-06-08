'use server';

import AsNeededFastActingComponent from '@/app/components/intake-v2/ed/treatment-type/as-needed-fast-acting-component';
import AsNeededStandardComponent from '@/app/components/intake-v2/ed/treatment-type/as-needed-standard-component';
import DailyFastActingComponent from '@/app/components/intake-v2/ed/treatment-type/daily-fast-acting-component';
import DailyStandardComponent from '@/app/components/intake-v2/ed/treatment-type/daily-standard-component';

interface PageProps {
    params: {
        frequency: string;
        treatmentType: string;
    };
}

export default async function TreatmentTypeSelectionPage({
    params,
}: PageProps) {
    switch (params.frequency) {
        case 'daily':
            if (params.treatmentType === 'fast-acting') {
                return <DailyFastActingComponent />;
            } else {
                return <DailyStandardComponent />;
            }

        case 'as-needed':
            if (params.treatmentType === 'fast-acting') {
                return <AsNeededFastActingComponent />;
            } else {
                return <AsNeededStandardComponent />;
            }

        default:
            return <></>;
    }
}
