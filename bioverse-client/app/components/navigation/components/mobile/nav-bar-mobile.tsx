'use client';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { Drawer, IconButton } from '@mui/material';
import MobileMenuDrawer from './menu-drawer/menu-drawer';
import Image from 'next/image';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

interface Props {
    loggedIn: boolean;
    role: BV_AUTH_TYPE | null;
}

export default function NavBarMobile({ loggedIn, role }: Props) {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const toggleDrawer = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <div className='flex flex-row justify-between w-full'>
            <div className='flex flex-row items-center ml-[0.83vw]'>
                <Link
                    href={'/'}
                    className="[font-family:'Ofelia_Display-Regular',Helvetica] fontthin relative text-black no-underline"
                >
                    <div className='flex items-center ml-2 mt-1'>
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

            <div className='items-center flex p-2 gap-3 mr-2'>
                {/* <ShoppingBagOutlinedIcon fontSize="large" /> */}
                <IconButton
                    edge='end'
                    color='inherit'
                    aria-label='menu'
                    onClick={toggleDrawer}
                >
                    <MenuIcon fontSize='large' />
                </IconButton>
                <Drawer anchor='right' open={menuOpen} onClose={toggleDrawer}>
                    <MobileMenuDrawer
                        setMenuOpen={setMenuOpen}
                        className={''}
                        loggedIn={loggedIn}
                    />
                </Drawer>
            </div>
        </div>
    );
}
