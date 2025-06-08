'use server';

import UpcomingListComponent from '@/app/components/coordinator-portal/upcoming-list/upcoming-page-component';

interface UpcomingListProps {}

export default async function UpcomingListPage({}: UpcomingListProps) {
    return (
        <>
            <UpcomingListComponent />
        </>
    );
}
