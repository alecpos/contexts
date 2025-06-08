'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import GenericOnboardingStage from '../components/template';
import { triggerEvent } from '@/app/services/customerio/customerioApiFactory';
import { BUNDLE_SCREEN_VIEWED } from '@/app/services/mixpanel/mixpanel-constants';
import { RudderstackEvent } from '@/app/types/services/rudderstack/rudderstack-types';

interface EDSelectionProps {
    user_id: string;
}

export default function EDSelection({ user_id }: EDSelectionProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();

    const pushToNextRoute = async (newURL: string) => {
        const searchParams = new URLSearchParams(search);
        const newSearch = searchParams.toString();

        await triggerEvent(user_id, RudderstackEvent.ED_SELECTION_VIEWED);
        //skip to the fast-acting route if we're in the ed-x flow because x-melts and x-chews aren't a 'standard pill'
        if (fullPath.includes('x-melts') || fullPath.includes('x-chews')) {
            router.push(`${fullPath}/${newURL}/fast-acting?${newSearch}`);
            return;
        }

        router.push(`${fullPath}/${newURL}?${newSearch}`);
    };

    const options = [
        {
            specialTag: 'Better for spontaneous sex',
            label: 'Before sex',
            desc: 'Get hard and stay hard when you need - no planning required.',
            chipLabel: 'From $4/use',
            onClick: () => pushToNextRoute('as-needed'),
        },
        {
            label: 'Daily',
            desc: "For when you've got a plan and need to stick to it.",
            chipLabel: 'From $1/day',
            onClick: () => pushToNextRoute('daily'),
        },
    ];

    return <GenericOnboardingStage options={options} />;
}
