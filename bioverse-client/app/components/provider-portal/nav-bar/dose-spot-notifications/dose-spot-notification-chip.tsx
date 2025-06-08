'use client';
import { Badge, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { getProviderNotificationCount } from '../../../../utils/actions/provider/provider-dosespot';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useRouter } from 'next/navigation';

interface Props {}

export default function DoseSpotNotificationChip() {
    const [notificationCount, setnotificationCount] = useState<number>(0);

    const router = useRouter();

    useEffect(() => {
        getNotificationCount();
    }, []);

    const getNotificationCount = async () => {
        //Get and Set notification conut
        const count = await getProviderNotificationCount();

        if (count) {
            setnotificationCount(count.data);
        }
    };

    const handleChipClick = () => {
        router.push('/provider/dosespot-general');
    };

    return (
        <>
            <div className="flex flex-row items-center justify-center">
                
                <Badge badgeContent={notificationCount} color="secondary">
                    <Chip
                        label={
                                <div className= 'flex flex-row gap-2 mx-1'>
                                    <NotificationsNoneIcon 
                                    fontSize='small'
                                        className='text-slate-400 '
                                    />
                                    <p className='mt-0.5'>Dose Spot Notifications</p>
                                </div>
                        }
                            
                        onClick={handleChipClick}
                        className='provider-tabs-subtitle '
                        sx={{
                            fontFamily: 'Inter Regular',
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: '22px',
                            color: 'rgba(0, 0, 0, 0.90)',
                          }}
                    />
                </Badge>
            </div>
        </>
    );
}
