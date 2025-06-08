import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import Link from 'next/link';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import React from 'react';
interface CardLinkProps {
    name: string;
    url: string;
    icon: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CardLink({
    name,
    url,
    icon,
    setLoading,
}: CardLinkProps) {
    const renderIcon = () => {
        switch (icon) {
            case 'dashboard':
                return (
                    <SpaceDashboardOutlinedIcon
                        sx={{ color: 'black', width: '40px', height: '40px' }}
                    />
                );
            case 'list-numbered':
                return (
                    <FormatListNumberedOutlinedIcon
                        sx={{ color: 'black', width: '40px', height: '40px' }}
                    />
                );
            case 'profile':
                return (
                    <AccountBoxOutlinedIcon
                        sx={{ color: 'black', width: '40px', height: '40px' }}
                    />
                );
            case 'clock':
                return (
                    <ScheduleOutlinedIcon
                        sx={{ color: 'black', width: '40px', height: '40px' }}
                    />
                );
            case 'message':
                return (
                    <MessageOutlinedIcon
                        sx={{ color: 'black', width: '40px', height: '40px' }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Link
            href={url}
            className={`no-underline`}
            onClick={() => setLoading(true)}
        >
            <div className="w-[264px] h-[176px] p-[16px] bg-white shadow-md flex flex-col hover:bg-gray-100 rounded-md justify-between">
                <div className="flex">
                    <BioType className="itd-h1 text-[24px] text-black">
                        {name}
                    </BioType>
                </div>
                <div className="flex justify-end">{renderIcon()}</div>
            </div>
        </Link>
    );
}
