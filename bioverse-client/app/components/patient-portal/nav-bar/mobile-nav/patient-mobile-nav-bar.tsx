'use client';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { Drawer, IconButton } from '@mui/material';
import Image from 'next/image';
import PortalMobileMenuDrawer from './portal-nav-drawer';
import PortalNavTopMenu from './top-menu';

interface Props {
    loggedIn: boolean;
}
export default function PatientPortalNavBarMobile({ loggedIn }: Props) {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const toggleDrawer = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <div className="z-50 fixed top-0 w-full left-0 right-0 bg-white overflow-x-hidden">
            <div
                className={`w-full h-[50px] bg-white inline-flex flex-row justify-between`}
            >
                <div className="flex flex-row items-center ml-[0.83vw]">
                    <Link
                        href={'/'}
                        className="[font-family:'Ofelia_Display-Regular',Helvetica] fontthin relative text-black no-underline"
                    >
                        <div className="flex items-center ml-2 mt-1">
                            <div>
                                <Image
                                    src={'/img/bioverse-logo-full.png'}
                                    alt={'bioverse-banners'}
                                    width={155}
                                    height={38}
                                    unoptimized
                                />
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="items-center flex p-2 gap-3 mr-2">
                    {/* <ShoppingBagOutlinedIcon fontSize="large" /> */}
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer}
                    >
                        <MenuIcon fontSize="large" />
                    </IconButton>
                    <Drawer
                        anchor="right"
                        open={menuOpen}
                        onClose={toggleDrawer}
                    >
                        <PortalMobileMenuDrawer
                            setMenuOpen={setMenuOpen}
                            className={''}
                            loggedIn={loggedIn}
                        />
                    </Drawer>
                </div>
            </div>

            <PortalNavTopMenu />
        </div>
    );
}
