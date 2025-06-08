'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getNextProviderTask } from '../../utils/findNextTask';
import TaskActionInfoBar from '../../task-action-page/components/task-action-info-bar';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { IconButton } from '@mui/material';
import useSWR from 'swr';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

interface TaskAssignmentComponentProps {
    userId: string;
    employeeAuthorization: BV_AUTH_TYPE | null;
}

export default function TaskAssignmentComponent({
    userId,
    employeeAuthorization,
}: TaskAssignmentComponentProps) {
    const router = useRouter();
    const pathname = usePathname();

    const route = pathname?.split('/')[1];

    const [tasksAvailable, setTasksAvailable] = useState<boolean>(true);
    const [isRotating, setIsRotating] = useState<boolean>(false);

    const getNextTask = () => getNextProviderTask(userId);

    const {
        data: nextTaskId,
        isLoading,
        isValidating,
        mutate,
    } = useSWR(userId ? `${userId}-next-task` : undefined, getNextTask, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 0, // Disable automatic polling
        dedupingInterval: 0, // Disable deduplication
    });

    /**
     * Used for Proof of Concept Prototype:
     */
    useEffect(() => {
        if (!isLoading && !isValidating) {
            if (!nextTaskId) {
                setTasksAvailable(false);
            } else {
                // Clear SWR cache before navigation
                mutate(undefined, { revalidate: false });
                router.push(`/${route}/tasks/${nextTaskId}`);
            }
        }
    }, [userId, router, nextTaskId, isLoading, isValidating, route, mutate]);

    const handleRefreshClick = () => {
        setIsRotating(true);
        mutate();
        setTimeout(() => setIsRotating(false), 1000); // Reset rotation after 1 second
    };

    if (!userId) {
        return <LoadingScreen />;
    }

    if (!tasksAvailable) {
        return (
            <div className='flex flex-col items-center py-10 gap-5'>
                <BioType className='itd-h1'>
                    🚀 No intakes to review. You Rock! 🚀
                </BioType>
                <TaskActionInfoBar
                    source='task'
                    user_id={userId}
                    task_id={''}
                    canProceed={false}
                    employeeAuthorization={employeeAuthorization}
                />

                <IconButton
                    color='primary'
                    onClick={handleRefreshClick}
                    style={{
                        animation: isRotating ? 'rotate 1s linear' : 'none',
                    }}
                >
                    <AutorenewIcon />
                </IconButton>

                <style jsx>{`
                    @keyframes rotate {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center py-10'>
            <BioType className='itd-h1'>Fetching task, please hold...</BioType>
            <LoadingScreen />
        </div>
    );
}
