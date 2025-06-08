'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import {
    endSession,
    startNewSession,
} from '@/app/utils/database/controller/coordinator_activity_audit/coordinator_activity_audit-api';
import { checkCoordinatorSessionStatus } from '@/app/utils/functions/coordinator-portal/time-tracker/coordinator-time-tracker-functions';
import { Button, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import { useState } from 'react';
import useSWR from 'swr';

interface StartSessionButtonProps {
    userId: string;
    role: BV_AUTH_TYPE;
}

export default function StartSessionButton({
    userId,
    role,
}: StartSessionButtonProps) {
    const isCoordinator = [
        BV_AUTH_TYPE.COORDINATOR,
        BV_AUTH_TYPE.LEAD_COORDINATOR,
        BV_AUTH_TYPE.ADMIN,
    ].includes(role);

    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const {
        data: isSessionActive,
        isLoading,
        isValidating,
        mutate,
    } = useSWR(isCoordinator ? `${userId}-isSessionActive` : null, () =>
        checkCoordinatorSessionStatus(userId),
    );

    const [sessionStarted, setSessionStarted] = useState<boolean>(false);

    useEffect(() => {
        if (isSessionActive != undefined) {
            setSessionStarted(isSessionActive);
        }
    }, [isSessionActive]);

    const onClick = async () => {
        setButtonLoading(true);
        if (!sessionStarted) {
            await startNewSession(userId);
            mutate();
        } else {
            await endSession(userId);
            mutate();
        }
        setButtonLoading(false);
        return;
    };

    return (
        <>
            <Button
                variant="outlined"
                onClick={onClick}
                sx={{
                    minWidth: '200px',
                    borderColor: `${sessionStarted ? '#D32F2F' : 'black'}`,
                    color: `${sessionStarted ? '#D32F2F' : 'black'}`,
                    '&:hover': {
                        backgroundColor: '#f0f0f0',
                        borderColor: `${sessionStarted ? '#D32F2F' : 'black'}`,
                    },
                    borderRadius: '12px',
                }}
                disabled={!isCoordinator}
            >
                {isLoading || isValidating ? (
                    <BioType className="provider-intake-tab-title text-weak py-[3px]">
                        Verifying Session...
                    </BioType>
                ) : (
                    <BioType className="provider-intake-tab-title text-weak py-[3px]">
                        {!buttonLoading ? (
                            sessionStarted ? (
                                'End Session'
                            ) : (
                                'Start Session'
                            )
                        ) : (
                            <CircularProgress
                                sx={{ color: 'black' }}
                                size={20}
                            />
                        )}
                    </BioType>
                )}
            </Button>
        </>
    );
}
