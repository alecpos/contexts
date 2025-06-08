'use client';

import { ButtonBase, Paper } from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface AdminDashboardCardProps {
    cardText: string;
    cardIcon: JSX.Element;
    redirectFunction: () => void;
}

export default function AdminDashboardCard({
    cardText,
    cardIcon,
    redirectFunction,
}: AdminDashboardCardProps) {
    return (
        <>
            <ButtonBase onClick={redirectFunction}>
                <Paper className='w-[240px] h-[146px] cursor-pointer'>
                    <div className='flex flex-col p-4 gap-4 items-start'>
                        <div className='flex flex-col ml-2'>
                            {cardIcon}
                            {/* <AccountCircleOutlinedIcon
                            sx={{ color: 'green', fontSize: '40px' }}
                        /> */}
                        </div>
                        <div className='flex flex-col justify-start items-start text-start'>
                            <BioType className='itd-subtitle'>
                                {cardText}
                            </BioType>
                        </div>
                    </div>
                </Paper>
            </ButtonBase>
        </>
    );
}
