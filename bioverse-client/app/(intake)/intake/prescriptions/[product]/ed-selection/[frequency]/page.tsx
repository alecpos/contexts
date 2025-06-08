'use server';

import AsNeededSelectionComponent from '@/app/components/intake-v2/ed/frequency/as-needed-selection-component';
import DailySelectionComponent from '@/app/components/intake-v2/ed/frequency/daily-selection-component';

interface PageProps {
    params: {
        frequency: string;
    };
}

export default async function DailySelectionPage({ params }: PageProps) {
    switch (params.frequency) {
        case 'daily':
            return <DailySelectionComponent />;
        case 'as-needed':
            return <AsNeededSelectionComponent />;

        default:
            return <></>;
    }
}
