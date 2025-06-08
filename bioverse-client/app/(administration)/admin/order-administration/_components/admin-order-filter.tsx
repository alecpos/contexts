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

interface Props {
    onFilterChange: (filters: string[]) => void;
    selectedApprovalStatusFilters: string[];
    idFilterStatus: boolean;
    setIDFilterStatus: Dispatch<SetStateAction<boolean>>;
}

const filterOptions = [
    // { label: 'Unapproved No Card', status: 'Unapproved-NoCard' },
    { label: 'Administrative Cancel', status: 'Administrative-Cancel' },
    { label: 'Needs Provider Review', status: 'Unapproved-CardDown' },
    // { label: 'Approved No Card', status: 'Approved-NoCard' },
    { label: 'Approved, Not Prescribed', status: 'Approved-CardDown' },
    { label: 'Provider Denied Treatment', status: 'Denied-CardDown' },
    {
        label: 'Prescription Sent',
        status: 'Approved-CardDown-Finalized',
    },
    // { label: 'Denied No Card', status: 'Denied-NoCard' },
    // { label: 'Approved No Card', status: 'Approved-NoCard' },
    { label: 'Charged, Script Not Sent', status: 'Payment-Completed' },
    { label: 'Payment Declined', status: 'Payment-Declined' },
    { label: 'Canceled', status: 'Canceled' },
];
export default function AdminFilter({
    onFilterChange,
    selectedApprovalStatusFilters,
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

    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        filter: { label: string; status: string }
    ) => {
        let newSelectedFilters;

        if (event.target.checked) {
            newSelectedFilters = [
                ...selectedApprovalStatusFilters,
                filter.status,
            ];
        } else {
            newSelectedFilters = selectedApprovalStatusFilters.filter(
                (status) => status !== filter.status
            );
        }

        onFilterChange(newSelectedFilters);
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
                {filterOptions.map((option) => (
                    <MenuItem key={option.label}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={selectedApprovalStatusFilters.includes(
                                        option.status
                                    )}
                                    onChange={(event) =>
                                        handleCheckboxChange(event, option)
                                    }
                                />
                            }
                            label={option.label}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
