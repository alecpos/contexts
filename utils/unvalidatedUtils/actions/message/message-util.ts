import {
    InitialThreadData,
    MessagePayload,
} from '@/app/types/messages/messages-types';

export function formatThreadSidebarTimestamp(timestamp: Date): string {
    const currentDate = new Date();
    const inputDate = new Date(timestamp);

    // Calculate the difference in days
    const diffDays = Math.floor(
        (currentDate.getTime() - inputDate.getTime()) / (1000 * 3600 * 24)
    );

    // If it's today, return the current time
    if (diffDays === 0) {
        const hours = inputDate.getHours().toString().padStart(2, '0');
        const minutes = inputDate.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    // If it's yesterday, return 'Yesterday'
    else if (diffDays === 1) {
        return 'Yesterday';
    }
    // Otherwise, return the date formatted as '05 Apr'
    else {
        const options = { day: '2-digit', month: 'short' } as const;
        return inputDate.toLocaleDateString('en-US', options);
    }
}

export function formatToMonthDay(timestamp: Date): string {
    const date = new Date(timestamp);
  
  // Format to "Month Day" like "January 22"
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export const getMessageSecondsDifference = (
    timestampA: string | Date,
    timestampB: string | Date
): number => {
    const dateA = new Date(timestampA);
    const dateB = new Date(timestampB);
    const diffInS = Math.floor((dateA.getTime() - dateB.getTime()) / 1000);

    return diffInS;
};

export function formatChatTimestamp(timestamp: Date) {
    const options = {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    } as const;
    return new Date(timestamp).toLocaleString('en-US', options);
}

export function updateInitialThreadData(
    initialThreadData: InitialThreadData[],
    currentMessage: any,
    thread_id: number
) {
    // Find the index of the object with the specified thread_id
    const indexToMove = initialThreadData.findIndex(
        (thread) => thread.thread_id === thread_id
    );

    // If the thread_id is not found, return the original array
    if (indexToMove === -1) {
        return initialThreadData;
    }

    // Update the entry of the object being moved
    const movedThread = {
        ...initialThreadData[indexToMove],
        message: {
            ...initialThreadData[indexToMove].message,
            content: currentMessage,
            created_at: new Date(Date.now()),
        },
    };

    // Remove the object from its current position
    initialThreadData.splice(indexToMove, 1);

    // Move the object to the beginning of the array
    initialThreadData.unshift(movedThread);
    return initialThreadData;
}

export function updateLastViewedThread(
    thread: InitialThreadData,
    initialThreadData: InitialThreadData[],
    setInitialThreadData: any
): void {
    const threadIndex = initialThreadData.findIndex(
        (t) => t.thread_id === thread.thread_id
    );

    if (threadIndex !== -1) {
        // Create a new array with the updated thread
        const updatedThreadData = [...initialThreadData];
        const updatedMessage = {
            ...updatedThreadData[threadIndex].message,
            last_read_at: new Date(), // Set the last_read_at to the current date and time
        };
        updatedThreadData[threadIndex] = {
            ...updatedThreadData[threadIndex],
            message: updatedMessage,
        };

        // Update the state with the new array
        setInitialThreadData(updatedThreadData);
    }
}

export function truncateMessageContent(content: string, maxLength: number) {
    if (typeof content !== 'string') {
        throw new TypeError('Input must be a string');
    }

    return content.length <= maxLength
        ? content
        : content.slice(0, maxLength) + '...';
}

export function hasMessageBeenRead(
    thread: InitialThreadData,
    currentThread: InitialThreadData | null
) {
    if (thread.thread_id === currentThread?.thread_id) {
        return true;
    }

    const createdAt = new Date(thread.message.created_at);
    const lastReadAt = new Date(thread.message.last_read_at);

    // Compare the dates in UTC to avoid timezone issues
    if (createdAt.getTime() > lastReadAt.getTime()) {
        return false;
    } else {
        return true;
    }
}
