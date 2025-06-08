'use client';

import { useRouter } from 'next/navigation';
import AdminDashboardCard from './components/dashboard-card';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import IntegrationInstructionsOutlinedIcon from '@mui/icons-material/IntegrationInstructionsOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import DynamicFeedOutlinedIcon from '@mui/icons-material/DynamicFeedOutlined';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';

interface AdminDashboardContainerProps {}

export default function AdminDashboardContainer({}: AdminDashboardContainerProps) {
    const router = useRouter();

    const handleRedirect = (destination: string) => {
        router.push(destination);
        return;
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-[500px] mx-[200px] mt-16'>
            <div className='flex flex-col items-start w-full gap-2'>
                <BioType className='itd-h1'>Admin Dashboard</BioType>
                <BioType className='itd-subtitle text-[#646464]'>
                    Queues & Tasks
                </BioType>
                <div className='flex flex-col w-full h-[1px]'>
                    <HorizontalDivider backgroundColor={'#DFDFDF'} height={1} />
                </div>
            </div>
            <div className='flex flex-wrap items-center justify-center gap-4 mt-4'>
                <AdminDashboardCard
                    cardText={'Provider Dashboard'}
                    cardIcon={
                        <SpaceDashboardOutlinedIcon
                            sx={{ color: '#286BA2', fontSize: '40px' }}
                        />
                    }
                    redirectFunction={() => {
                        handleRedirect('/provider/dashboard');
                    }}
                />
                <AdminDashboardCard
                    cardText={'Provider Task Queue'}
                    cardIcon={
                        <FormatListBulletedIcon
                            sx={{ color: '#286BA2', fontSize: '40px' }}
                        />
                    }
                    redirectFunction={() => {
                        handleRedirect('/provider/tasks');
                    }}
                />
                <AdminDashboardCard
                    cardText={'All Orders'}
                    cardIcon={
                        <InboxOutlinedIcon
                            sx={{ color: '#796CB9', fontSize: '40px' }}
                        />
                    }
                    redirectFunction={() => {
                        handleRedirect('/coordinator/all-orders');
                    }}
                />
                <AdminDashboardCard
                    cardText={'All Patients'}
                    cardIcon={
                        <AccountCircleOutlinedIcon
                            sx={{ color: '#796CB9', fontSize: '40px' }}
                        />
                    }
                    redirectFunction={() => {
                        handleRedirect('/provider/all-patients');
                    }}
                />
                <AdminDashboardCard
                    cardText={'Engineering Queue'}
                    cardIcon={
                        <IntegrationInstructionsOutlinedIcon
                            sx={{ color: '#C564B1', fontSize: '40px' }}
                        />
                    }
                    redirectFunction={() => {
                        handleRedirect('/engineer');
                    }}
                />
                <AdminDashboardCard
                    cardText={'Coordinator Queue'}
                    cardIcon={
                        <SupportAgentOutlinedIcon
                            sx={{ color: '#FD608C', fontSize: '40px' }}
                        />
                    }
                    redirectFunction={() => {
                        handleRedirect('/coordinator/dashboard');
                    }}
                />
                <AdminDashboardCard
                    cardText={'Tasks Overview'}
                    cardIcon={
                        <DynamicFeedOutlinedIcon
                            sx={{ color: '#FF7855', fontSize: '40px' }}
                        />
                    }
                    redirectFunction={() => {
                        handleRedirect('/admin/task-overview');
                    }}
                />
                <AdminDashboardCard
                    cardText={'Manage Application'}
                    cardIcon={
                        <ManageAccountsIcon
                            sx={{ color: '#00c04b', fontSize: '40px' }}
                        />
                    }
                    redirectFunction={() => {
                        handleRedirect('/admin/app-control');
                    }}
                />
                <AdminDashboardCard
                    cardText={'Upcoming Renewal List'}
                    cardIcon={
                        <EventRepeatIcon
                            sx={{ color: '#1434A4', fontSize: '40px' }}
                        />
                    }
                    redirectFunction={() => {
                        handleRedirect('/coordinator/upcoming-list');
                    }}
                />
                <AdminDashboardCard
                    cardText={'Announcements'}
                    cardIcon={
                        <AnnouncementIcon
                            sx={{ color: '#FFA600', fontSize: '40px' }}
                        />
                    }
                    redirectFunction={() => {
                        handleRedirect('/admin/announcements');
                    }}
                />
            </div>
            <div className='flex flex-col items-start w-full gap-2 mt-4'>
                <BioType className='itd-subtitle text-[#646464]'>
                    Performance Trackers
                </BioType>
                <div className='flex flex-col w-full h-[1px]'>
                    <HorizontalDivider backgroundColor={'#DFDFDF'} height={1} />
                </div>
            </div>
            <div className='flex flex-wrap items-center justify-center gap-4 mt-4 mb-10'>
                <AdminDashboardCard
                    cardText={'Provider Tracker'}
                    cardIcon={
                        <SpeedOutlinedIcon
                            sx={{ color: '#286BA2', fontSize: '40px' }}
                        />
                    }
                    redirectFunction={() => {
                        handleRedirect('/provider/track-hours');
                    }}
                />
                <AdminDashboardCard
                    cardText={'Coordinator Tracker'}
                    cardIcon={
                        <SpeedOutlinedIcon
                            sx={{ color: '#FD608C', fontSize: '40px' }}
                        />
                    }
                    redirectFunction={() => {
                        handleRedirect('/coordinator/track-hours');
                    }}
                />
                <AdminDashboardCard
                    cardText={'Registered Nurse Tracker'}
                    cardIcon={
                        <SpeedOutlinedIcon
                            sx={{ color: '#FFA600', fontSize: '40px' }}
                        />
                    }
                    redirectFunction={() => {
                        handleRedirect('/registered-nurse/track-hours');
                    }}
                />
            </div>
        </div>
    );
}
