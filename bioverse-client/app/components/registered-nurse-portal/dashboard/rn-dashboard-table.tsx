'use client';

import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import useSWR from 'swr';
import { getRegisteredNurseDashboardTasks } from './utils/rn-dashboard-functions';
import RNTaskTracker from './rn-task-tracker/RNTaskTracker';
import ProviderDashboardIntakeList from '../../provider-portal/order-table/components/provider-dashboard-intake-list';
import { useRouter } from 'next/navigation';
import { Paper } from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
interface Props {
    userId: string;
    employee_authorization: BV_AUTH_TYPE | null;
    employee_name: string;
}

export default function RN_Dashboard_Table({
    userId,
    employee_authorization,
    employee_name,
}: Props) {
    const router = useRouter();

    const { data: taskList, isLoading } = useSWR(`rn-tasks`, () =>
        getRegisteredNurseDashboardTasks(userId)
    );

    const handleOrderRedirect = async (
        order_id: string,
        status_tag_id?: number,
        preassigned?: boolean
    ) => {
        router.push(`/provider/intakes/${order_id}`);
    };

    return (
        <div className='flex flex-col gap-4'>
            <RNTaskTracker
                taskCount={taskList?.length ?? 0}
                employee_name={employee_name}
            />
            <div>
                <Paper className='flex flex-col px-4 pb-8 w-full max-h-[80vh] overflow-y-auto'>
                    <div className='flex flex-row justify-between items-center'>
                        <BioType className='p-1 font-inter text-[20px] font-medium leading-[26px] text-[rgba(51,51,51,0.75)] [font-feature-settings:"liga"_off,"clig"_off] [text-edge:cap] [leading-trim:both]'>
                            RN Tasks
                        </BioType>
                    </div>
                    <ProviderDashboardIntakeList
                        filteredOrders={taskList}
                        handleOrderRedirect={handleOrderRedirect}
                        isRedirecting={false}
                        isLoading={isLoading}
                    />
                </Paper>
            </div>
        </div>
    );
}
