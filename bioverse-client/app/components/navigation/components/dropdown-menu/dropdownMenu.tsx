'use client';
import { Tabs, Menu, MenuItem, Tab, Box, Button } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/*
DROP DOWN MENU FOR MOBILE ON NORMAL SITE

02/02/2024 - @Olivier
 - Added About Tab (doesn't link anywhere)

*/

interface Props {
    hideLinks?: boolean;
}

export default function DropdownMenu({ hideLinks = false }: Props) {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [focusAreaAnchorEl, setFocusAreasOpen] = useState<null | HTMLElement>(
        null
    );
    const open = Boolean(anchorEl);
    const focusOpen = Boolean(focusAreaAnchorEl);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRedirect = (href: string) => {
        router.push(href);
    };

    const handleFocusAreasClick = (event: any) => {
        setFocusAreasOpen(event.currentTarget);
    };
    const handleFocusAreasClose: any = () => {
        setFocusAreasOpen(null);
    };

    return (
        <div className='inline-flex items-center text-center self-center overflow-auto'>
            <Tabs value={false} className='mr-5'>
                {/* <Tab label="Treatments"
                    icon={<ExpandMoreIcon className="self-center" />}
                    iconPosition="end"
                    onMouseDown={handleClick} /> */}
                {!hideLinks && (
                    <Tab
                        label='Focus Areas'
                        icon={<ExpandMoreIcon className='self-center' />}
                        iconPosition='end'
                        onMouseDown={handleFocusAreasClick}
                        sx={{ color: 'primary.main' }}
                    />
                )}

                {!hideLinks && (
                    <Tab
                        label='ABOUT'
                        onClick={() =>
                            router.push('https://gobioverse.com/about')
                        }
                        sx={{ color: 'primary.main' }}
                    />
                )}
            </Tabs>
            {/* <Menu
                disableScrollLock={true}
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}>
                <MenuItem onClick={() => handleRedirect('/prescriptions')}>Prescriptions</MenuItem>
                <MenuItem onClick={() => handleRedirect('/supplements')}>Supplements</MenuItem>
                <MenuItem onClick={() => handleRedirect('/advanced-testing')}>Advanced Testing</MenuItem>
                <MenuItem onClick={() => handleRedirect('/consultations')}>Consultations</MenuItem>
                <MenuItem onClick={() => handleRedirect('/collections')}>All Treatments</MenuItem>
            </Menu > */}
            <Menu
                disableScrollLock={true}
                id='focus-areas-menu'
                anchorEl={focusAreaAnchorEl}
                open={focusOpen}
                onClose={handleFocusAreasClose}
                MenuListProps={{
                    'aria-labelledby': 'focus-areas-button',
                }}
            >
                <MenuItem
                    onClick={() =>
                        handleRedirect('/collections?fpf=weight-loss')
                    }
                >
                    Weight Loss
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        handleRedirect('/collections?fpf=health-and-longevity')
                    }
                >
                    Health & Longevity
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        handleRedirect(
                            '/collections?fpf=energy-and-cognitive-function'
                        )
                    }
                >
                    Energy & Cognitive Function
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        handleRedirect('/collections?fpf=autoimmune-support')
                    }
                >
                    Autoimmune Support
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        handleRedirect(
                            '/collections?fpf=heart-health-and-blood-pressure'
                        )
                    }
                >
                    Heart Health & Blood Pressure
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        handleRedirect('/collections?fpf=nad-support')
                    }
                >
                    NAD+ Support
                </MenuItem>
                <MenuItem
                    onClick={() =>
                        handleRedirect('/collections?fpf=gsh-support')
                    }
                >
                    GSH Support
                </MenuItem>
                {/* <MenuItem
                    onClick={() =>
                        handleRedirect('/collections?fpf=erectile-dysfunction')
                    }
                >
                    Erectile Dysfunction
                </MenuItem> */}
                <MenuItem
                    onClick={() =>
                        handleRedirect('/collections?fpf=health-monitoring')
                    }
                >
                    Health Monitoring
                </MenuItem>
                {/* <MenuItem
                    onClick={() => handleRedirect('/collections?fpf=hair-loss')}
                >
                    Hair Loss
                </MenuItem> */}
                <MenuItem
                    onClick={() => handleRedirect('/collections?fpf=skincare')}
                >
                    Skincare
                </MenuItem>
                <MenuItem onClick={() => handleRedirect('/collections')}>
                    All Focus Areas
                </MenuItem>
            </Menu>
        </div>
    );
}
