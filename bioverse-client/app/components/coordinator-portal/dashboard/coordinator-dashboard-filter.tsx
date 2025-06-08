'use client';
import {
    Checkbox,
    FormControlLabel,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Dispatch, SetStateAction, useState } from 'react';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import { RenewalOrderStatus } from '@/app/types/renewal-orders/renewal-orders-types';

interface Props {
    onFilterChange: (filters: string[]) => void;
    idFilterStatus: boolean;
    setIDFilterStatus: Dispatch<SetStateAction<boolean>>;
}

const filterOptions = [
    // { label: 'Unapproved No Card', status: 'Unapproved-NoCard' },
    {
        label: 'Needs Provider Review',
        status: [
            'Unapproved-CardDown',
            RenewalOrderStatus.CheckupComplete_Unprescribed_Unpaid,
            RenewalOrderStatus.CheckupComplete_Unprescribed_Paid,
        ],
    },
    // { label: 'Approved No Card', status: 'Approved-NoCard' },
    {
        label: 'Approved Treatment Not Prescribed',
        status: ['Approved-CardDown'],
    },
    // { label: 'Pending Customer Response', status: 'Pending-Customer-Response' },
    // { label: 'Provider Denied Treatment', status: 'Denied-CardDown' },
    // { label: 'Denied No Card', status: 'Denied-NoCard' },
    // { label: 'Approved No Card', status: 'Approved-NoCard' },
    {
        label: 'Customer Charged Script Not Sent',
        status: [
            'Payment-Completed',
            RenewalOrderStatus.CheckupComplete_Unprescribed_Paid,
        ],
    },
    // { label: 'Payment Declined', status: 'Payment-Declined' },
    // { label: 'Canceled', status: 'Canceled' },
    // { label: 'Incomplete', status: 'Incomplete' },
    // {
    //     label: 'Approved No Card Finalized',
    //     status: 'Approved-NoCard-Finalized',
    // },
    {
        label: 'Prescription Sent',
        status: [
            'Approved-CardDown-Finalized',
            RenewalOrderStatus.PharmacyProcessing,
        ],
    },
    // { label: 'Order Processing', status: 'Order-Processing' },
];
export default function CoordinatorFilter({
    onFilterChange,
    idFilterStatus,
    setIDFilterStatus,
}: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleIDCheckboxChange = () => {
        setIDFilterStatus((prev) => {
            return !prev;
        });
    };

    return (
        <div>
            <IconButton onClick={handleMenuOpen}>
                <FilterAltIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={idFilterStatus}
                                onChange={handleIDCheckboxChange}
                            />
                        }
                        label={'ID Uploaded'}
                    />
                </MenuItem>
            </Menu>
        </div>
    );
}
