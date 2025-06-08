import React from 'react';
import styles from '../../../../../styles/pdp/prescription-pdp.module.css';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import Marquee from 'react-fast-marquee';
import './styles.css';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface Props {
    type: string;
    isMobile: boolean;
}

const DesktopHealthStepsData = [
    {
        id: 1,
        key: 1,
        value: 'NO HIDDEN FEES (PAY ONLY FOR MEDICATION)',
        icon: 'paid_outlined',
    },
    {
        id: 2,
        key: 2,
        value: 'ON-GOING PROVIDER SUPPORT',
        icon: 'person_outlined',
    },
];

const DesktopProductData = [
    {
        id: 1,
        key: 1,
        value: 'NO INSURANCE REQUIRED',
        icon: 'paid_outlined',
    },
    {
        id: 2,
        key: 2,
        value: 'FREE SHIPPING',
        icon: 'inventory_outlined',
    },
    {
        id: 3,
        key: 3,
        value: 'DELIVERED TO YOUR DOOR',
        icon: 'local_shipping_outlined',
    },
    {
        id: 4,
        key: 4,
        value: 'NO HIDDEN FEES (PAY ONLY FOR MEDICATION)',
        icon: 'paid_outlined',
    },
    {
        id: 5,
        key: 5,
        value: 'ON-GOING PROVIDER SUPPORT',
        icon: 'person_outlined',
    },
];

export default function ScrollingMarqueeBar({ isMobile, type }: Props) {
    const renderIcon = (icon_type: string) => {
        switch (icon_type) {
            case 'paid_outlined':
                return <PaidOutlinedIcon color='primary' />;
            case 'person_outlined':
                return <PersonOutlineOutlinedIcon color='secondary' />;
            case 'inventory_outlined':
                return <Inventory2OutlinedIcon color='primary' />;
            case 'local_shipping_outlined':
                return <LocalShippingOutlinedIcon color='primary' />;
        }
    };

    const renderItem = (item: any) => {
        return (
            <div className='flex items-center ml-5'>
                {renderIcon(item.icon)}
                <BioType className=''>
                    <span className='gradientText ml-1 flex-wrap'>
                        {item.value}
                    </span>
                </BioType>
            </div>
        );
    };

    const renderItemMobile = (item: any) => {
        return (
            <div className='flex items-center ml-5'>
                {renderIcon(item.icon)}
                <BioType className=''>
                    <span className='gradientText ml-1 flex-wrap'>
                        {item.value}
                    </span>
                </BioType>
            </div>
        );
    };

    if (isMobile && type === 'health-steps') {
        return (
            <div>
                <Marquee
                    style={{
                        backgroundColor: '#F9F8FF',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                        marginTop: '30px',
                    }}
                >
                    {DesktopHealthStepsData.map((item, index) => (
                        <React.Fragment key={index}>
                            {renderItemMobile(item)}
                        </React.Fragment>
                    ))}
                </Marquee>
            </div>
        );
    }

    if (!isMobile && type === 'health-steps') {
        return (
            <div>
                <Marquee
                    autoFill
                    style={{
                        backgroundColor: '#F9F8FF',
                        paddingTop: '2px',
                        paddingBottom: '2px',
                    }}
                >
                    {DesktopHealthStepsData.map((item, index) => (
                        <React.Fragment key={index}>
                            {renderItem(item)}
                        </React.Fragment>
                    ))}
                </Marquee>
            </div>
        );
    }

    if (!isMobile && type === 'header') {
        return (
            <div>
                <Marquee
                    style={{
                        backgroundColor: '#F9F8FF',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                    }}
                >
                    {DesktopProductData.map((item, index) => (
                        <React.Fragment key={index}>
                            {renderItem(item)}
                        </React.Fragment>
                    ))}
                </Marquee>
            </div>
        );
    }

    if (isMobile && type === 'header') {
        return (
            <div>
                <Marquee
                    style={{
                        backgroundColor: '#F9F8FF',
                        paddingTop: '8px',
                        paddingBottom: '8px',
                    }}
                >
                    {DesktopProductData.map((item, index) => (
                        <React.Fragment key={index}>
                            {renderItemMobile(item)}
                        </React.Fragment>
                    ))}
                </Marquee>
            </div>
        );
    }
}
