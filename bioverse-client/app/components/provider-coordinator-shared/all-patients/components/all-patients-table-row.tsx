'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { determineAccessByRoleName } from '@/app/utils/functions/auth/authorization/authorizaiton-helper';
import { TableRow, TableCell, Button, Tooltip } from '@mui/material';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Fragment, useCallback } from 'react';

interface APTableRowProps {
    profile: APProfile;
    router: AppRouterInstance;
    access_type: BV_AUTH_TYPE | null;
}

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
};

const determineStatus = (intake_completion_time: string | null) => {
    return intake_completion_time ? 'Patient' : 'Lead';
};

const reformatDate = (dateToFormat: string) => {
    const date = new Date(dateToFormat);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const convertMemberSince = (completion_time: string) => {
    if (!completion_time) return '';

    const date = new Date(completion_time);
    return date.toLocaleString('en-US', DATE_FORMAT_OPTIONS);
};

export default function AllPatientsTableRow({
    profile,
    router,
    access_type,
}: APTableRowProps) {
    const handleIconClick = useCallback(
        (event: React.MouseEvent, patient_id: string) => {
            const url = determineAccessByRoleName(
                access_type,
                BV_AUTH_TYPE.PROVIDER
            )
                ? `/provider/all-patients/${patient_id}`
                : `/coordinator/all-patients/${patient_id}`;

            if (event.metaKey) {
                window.open(url, '_blank');
            } else {
                router.push(url);
            }
        },
        [access_type, router]
    );

    const TOOLTIP_CONTENT = (
        <Fragment>
            <div>Open chart</div>
            <div>⌘-Click for new tab</div>
        </Fragment>
    );

    return (
        <TableRow key={profile.email}>
            <TableCell component='th' scope='row'>
                <div className='flex flex-row items-center gap-1'>
                    <Tooltip title={TOOLTIP_CONTENT} placement='right'>
                        <Button
                            onClick={(e) => {
                                handleIconClick(e, profile.id);
                            }}
                        >
                            <BioType className='body1 text-primary'>
                                {profile.first_name} {profile.last_name}
                            </BioType>
                        </Button>
                    </Tooltip>
                </div>
            </TableCell>

            <TableCell>
                <BioType className='body1'>{profile.state}</BioType>
            </TableCell>

            <TableCell>
                <BioType className='body1'>{profile.sex_at_birth}</BioType>
            </TableCell>

            <TableCell>
                <BioType className='body1'>
                    {reformatDate(profile.date_of_birth)}
                </BioType>
            </TableCell>

            <TableCell>
                <BioType className='body1'>{profile.phone_number}</BioType>
            </TableCell>

            <TableCell>
                <BioType className='body1'>{profile.email}</BioType>
            </TableCell>

            <TableCell>
                <BioType className='body1'>
                    {determineStatus(profile.intake_completion_time)}
                </BioType>
            </TableCell>

            <TableCell>
                <BioType className='body1'>
                    {convertMemberSince(profile.created_at)}
                </BioType>
            </TableCell>
        </TableRow>
    );
}
