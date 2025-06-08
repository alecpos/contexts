'use client';

import { Switch, Button } from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import {
    getAdminControlState,
    changeAdminControlState,
} from '@/app/utils/database/controller/admin_controlled_items/admin-controlled-items';
import { useState, useEffect } from 'react';
import useSWR from 'swr';

interface DashboardControlsProps {
    role: string;
}

export default function DashboardControls({ role }: DashboardControlsProps) {
    const { data: providerData, isLoading: providerLoading } = useSWR(
        'providerDashboardState',
        () => getAdminControlState('provider_dashboard')
    );

    const { data: nurseData, isLoading: nurseLoading } = useSWR(
        'nurseDashboardState',
        () => getAdminControlState('registered_nurse_dashboard')
    );

    const [providerDashboardActive, setProviderDashboardActive] = useState<
        'active' | 'inactive' | 'loading'
    >('loading');

    const [nurseDashboardActive, setNurseDashboardActive] = useState<
        'active' | 'inactive' | 'loading'
    >('loading');

    const [providerDashboardChangeMade, setProviderDashboardChangeMade] =
        useState<boolean>(false);

    const [nurseDashboardChangeMade, setNurseDashboardChangeMade] =
        useState<boolean>(false);

    useEffect(() => {
        if (providerData) {
            setProviderDashboardActive(
                providerData.active ? 'active' : 'inactive'
            );
        }
    }, [providerData]);

    useEffect(() => {
        if (nurseData) {
            setNurseDashboardActive(nurseData.active ? 'active' : 'inactive');
        }
    }, [nurseData]);

    if (role !== BV_AUTH_TYPE.ADMIN) {
        return (
            <div>
                <BioType>No Authorization</BioType>
            </div>
        );
    }

    const changeProviderDashboardStatus = () => {
        if (providerDashboardActive === 'active') {
            setProviderDashboardActive('inactive');
        }

        if (providerDashboardActive === 'inactive') {
            setProviderDashboardActive('active');
        }

        setProviderDashboardChangeMade(true);
    };

    const changeNurseDashboardStatus = () => {
        if (nurseDashboardActive === 'active') {
            setNurseDashboardActive('inactive');
        }

        if (nurseDashboardActive === 'inactive') {
            setNurseDashboardActive('active');
        }

        setNurseDashboardChangeMade(true);
    };

    const saveProviderDashboardChanges = async () => {
        await changeAdminControlState(
            'provider_dashboard',
            providerDashboardActive === 'active' ? true : false
        );
        setProviderDashboardChangeMade(false);
    };

    const saveNurseDashboardChanges = async () => {
        await changeAdminControlState(
            'registered_nurse_dashboard',
            nurseDashboardActive === 'active' ? true : false
        );
        setNurseDashboardChangeMade(false);
    };

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex flex-row gap-5 items-center'>
                <BioType className='itd-subtitle'>Provider Dashboard:</BioType>
                {!providerLoading ? (
                    <div className='flex flex-row items-center'>
                        <BioType
                            className={`${
                                providerDashboardActive === 'inactive'
                                    ? 'itd-subtitle text-primary'
                                    : 'itd-body'
                            }`}
                        >
                            Inactive
                        </BioType>
                        <Switch
                            checked={providerDashboardActive === 'active'}
                            onChange={changeProviderDashboardStatus}
                        ></Switch>
                        <BioType
                            className={`${
                                providerDashboardActive === 'active'
                                    ? 'itd-subtitle text-primary'
                                    : 'itd-body'
                            }`}
                        >
                            Active
                        </BioType>
                    </div>
                ) : (
                    <BioType className='itd-body'>Loading ...</BioType>
                )}
                {providerDashboardChangeMade && (
                    <div>
                        <Button
                            variant='outlined'
                            onClick={saveProviderDashboardChanges}
                        >
                            Save
                        </Button>
                    </div>
                )}
            </div>

            <div className='flex flex-row gap-5 items-center'>
                <BioType className='itd-subtitle'>
                    Registered Nurse Dashboard:
                </BioType>
                {!nurseLoading ? (
                    <div className='flex flex-row items-center'>
                        <BioType
                            className={`${
                                nurseDashboardActive === 'inactive'
                                    ? 'itd-subtitle text-primary'
                                    : 'itd-body'
                            }`}
                        >
                            Inactive
                        </BioType>
                        <Switch
                            checked={nurseDashboardActive === 'active'}
                            onChange={changeNurseDashboardStatus}
                        ></Switch>
                        <BioType
                            className={`${
                                nurseDashboardActive === 'active'
                                    ? 'itd-subtitle text-primary'
                                    : 'itd-body'
                            }`}
                        >
                            Active
                        </BioType>
                    </div>
                ) : (
                    <BioType className='itd-body'>Loading ...</BioType>
                )}
                {nurseDashboardChangeMade && (
                    <div>
                        <Button
                            variant='outlined'
                            onClick={saveNurseDashboardChanges}
                        >
                            Save
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
