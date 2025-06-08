import { StatusTag } from '@/app/types/status-tags/status-types';
import { getStatusTagTaskCount } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import { getTodaysTaskCompletionCount } from '@/app/utils/database/controller/tasks/task-api';

export async function getAllTaskCounts() {
    const { data: reviewCount, status: reviewStatus } =
        await getStatusTagTaskCount(StatusTag.Review);
    const { data: messageCount, status: messageStatus } =
        await getStatusTagTaskCount(StatusTag.ProviderMessage);
    const { data: dailyCompletionCount, status: dailyStatus } =
        await getTodaysTaskCompletionCount();

    return {
        reviewCount: reviewCount,
        messageCount: messageCount,
        dailyCompletionCount: dailyCompletionCount,
    };
}
