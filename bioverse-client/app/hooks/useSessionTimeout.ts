import { useEffect, useCallback, useRef } from 'react';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import { useRouter } from 'next/navigation';
import { endSessionAndSignOutUser } from '@/app/utils/functions/provider-portal/time-tracker/provider-time-tracker-functions';
import {
    createEmployeeLogoutAudit,
    createEmployeeLoginAudit,
} from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

interface UseSessionTimeoutProps {
    userId: string;
    isAdmin?: boolean;
    onTimeout?: () => void;
    employeeRole: BV_AUTH_TYPE;
}

// Global state to persist across re-renders
const globalTimeoutState = {
    lastActivity: Date.now(),
    timeoutId: null as NodeJS.Timeout | null,
    countdownId: null as NodeJS.Timeout | null,
    broadcastChannel: null as BroadcastChannel | null,
    isInitialized: false,
};

/**
 *
 * useSessionTimeout hook
 *
 **/
export function useSessionTimeout({
    userId,
    isAdmin,
    onTimeout,
    employeeRole,
}: UseSessionTimeoutProps) {
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();
    const timeoutMs = 600000; // 10 minutes (600000ms)
    const instanceIdRef = useRef<string>(
        Math.random().toString(36).substr(2, 9)
    );

    const handleTimeout = useCallback(async () => {
        try {
            // Double check if we're still inactive before logging out
            const currentSession = await supabase.auth.getSession();
            if (!currentSession.data.session) {
                console.log('Session already ended - skipping timeout logout');
                return;
            }

            await createEmployeeLogoutAudit(
                userId,
                undefined,
                { source: 'session-timeout' },
                employeeRole
            );
            await supabase.auth.signOut();
            localStorage.clear();
            document.cookie.split(';').forEach((c) => {
                document.cookie = c
                    .replace(/^ +/, '')
                    .replace(
                        /=.*/,
                        '=;expires=' + new Date().toUTCString() + ';path=/'
                    );
            });
            onTimeout?.();
            console.log('Timeout reached - pushing to login');
            router.push('/provider-auth/login');
        } catch (error) {
            console.error('Error during session timeout:', error);
        }
    }, [userId, router, supabase.auth, onTimeout]);

    useEffect(() => {
        if (!userId) {
            return;
        }

        if (
            isAdmin &&
            userId !== '4122d7b8-fd9f-4605-a3e7-796b8be75fda' && // Daniel (he will be tracked) 😈
            userId !== '9afc3d1d-a9d0-46aa-8598-d2ac3d6ab928' && // Ben
            userId !== '6d920c41-4fa8-46c6-94f9-c97e6e3c5219' // Lara
        ) {
            return;
        }

        // Initialize broadcast channel if not already initialized
        if (!globalTimeoutState.broadcastChannel) {
            console.log('initializing broadcast channel');
            globalTimeoutState.broadcastChannel = new BroadcastChannel(
                'session-timeout-channel'
            );
        }

        const resetTimeout = () => {
            console.log('reset timeout');

            if (
                globalTimeoutState.isInitialized &&
                globalTimeoutState.lastActivity < Date.now() - 10 * 60 * 1000
            ) {
                //to handle a situation where the timeout gets reset prior to the initial timeout setup where the login audit is created
                //we don't want the reset timemout function to run prior to the initial timeout setup where the login audit is created
                return;
            }
            // Clear existing timeouts
            if (globalTimeoutState.timeoutId) {
                clearTimeout(globalTimeoutState.timeoutId);
            }
            if (globalTimeoutState.countdownId) {
                clearInterval(globalTimeoutState.countdownId);
            }

            globalTimeoutState.lastActivity = Date.now();

            // Set actual timeout
            globalTimeoutState.timeoutId = setTimeout(handleTimeout, timeoutMs);

            // Broadcast the new timeout to other tabs
            globalTimeoutState.broadcastChannel?.postMessage({
                type: 'TIMEOUT_RESET',
                timestamp: globalTimeoutState.lastActivity,
                source: instanceIdRef.current,
            });

            // Start countdown
            globalTimeoutState.countdownId = setInterval(() => {
                const remainingMs =
                    timeoutMs - (Date.now() - globalTimeoutState.lastActivity);
                if (remainingMs <= 0) return;

                // console.log('remainingMs', remainingMs);
            }, 1000);
        };

        // console.log("globalTimeoutState: ", globalTimeoutState);
        // Initial timeout setup - only if not already initialized or if last activity is more than 10 minute ago
        if (
            !globalTimeoutState.isInitialized ||
            globalTimeoutState.lastActivity < Date.now() - 10 * 60 * 1000
        ) {
            console.log('Initializing session timeout...');
            resetTimeout();
            createEmployeeLoginAudit(userId, employeeRole);
            globalTimeoutState.isInitialized = true;
        }

        const handleActivity = () => {
            if (
                globalTimeoutState.isInitialized &&
                globalTimeoutState.lastActivity < Date.now() - 10 * 60 * 1000
            ) {
                //to handle a situation where the timeout gets reset prior to the initial timeout setup where the login audit is created
                //we don't want the reset timemout function to run prior to the initial timeout setup where the login audit is created
                return;
            }
            resetTimeout();
        };

        // Listen for messages from other tabs
        const handleMessage = (event: MessageEvent) => {
            if (
                event.data.type === 'TIMEOUT_RESET' &&
                event.data.source !== instanceIdRef.current
            ) {
                if (
                    globalTimeoutState.isInitialized &&
                    globalTimeoutState.lastActivity <
                        Date.now() - 10 * 60 * 1000
                ) {
                    //to handle a situation where the timeout gets reset prior to the initial timeout setup where the login audit is created
                    //we don't want the reset timemout function to run prior to the initial timeout setup where the login audit is created
                    return;
                }
                if (event.data.timestamp > globalTimeoutState.lastActivity) {
                    globalTimeoutState.lastActivity = event.data.timestamp;
                    resetTimeout();
                }
            }
        };

        globalTimeoutState.broadcastChannel.addEventListener(
            'message',
            handleMessage
        );

        // Set up activity listeners
        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
        ];

        events.forEach((event) => {
            window.addEventListener(event, handleActivity);
        });

        // Handle visibility change
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                handleActivity();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup - only remove event listeners, don't clear timeouts
        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            );
            globalTimeoutState.broadcastChannel?.removeEventListener(
                'message',
                handleMessage
            );
        };
    }, [handleTimeout, userId]);

    return {};
}
