'use client';

import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { Button, Switch } from '@mui/material';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import {
    changeAdminControlState,
    getAdminControlState,
} from '@/app/utils/database/controller/admin_controlled_items/admin-controlled-items';
import DashboardControls from './dashboard-controls';
import IDDocsCounter from './intake-id-docs-counter';

interface AdminAppControlPageProps {
    role: BV_AUTH_TYPE;
}

export default function AdminAppControlContainer({
    role,
}: AdminAppControlPageProps) {
    if (role !== BV_AUTH_TYPE.ADMIN) {
        return (
            <div>
                <BioType>No Authorization</BioType>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center justify-start min-h-[500px] mt-16 w-full gap-10'>
            <div>
                <BioType className='itd-h1'>Modify Application</BioType>
            </div>
            <div className='flex flex-col w-[800px] items-start gap-4'>
                <DashboardControls role={role} />
                <IDDocsCounter />
            </div>
        </div>
    );
}
