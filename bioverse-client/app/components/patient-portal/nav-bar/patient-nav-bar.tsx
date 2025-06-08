import Link from 'next/link';
import PatientPortalNavBarButtons from './portal-nav-bar-buttons/patient-nav-buttons';
import PatientPortalNavBarMobile from './mobile-nav/patient-mobile-nav-bar';
import Image from 'next/image';

interface Props {
    loggedIn: boolean;
}

export default function PatientPortalNavBar({ loggedIn }: Props) {
    return (
        <>
            <div id='desktop-container' className='hidden md:flex'>
                <div
                    className={`w-full h-[var(--nav-height)] top-0 flex shadow-navbar justify-between z-50 fixed bg-white`}
                >
                    <div className='flex flex-row items-center ml-[0.83vw] mt-2'>
                        <Link href={'/'} className='relative font-normal'>
                            <Image
                                src={'/img/bioverse-logo-full.png'}
                                alt={'bioverse-banners'}
                                width={200}
                                height={50}
                                unoptimized
                            />
                        </Link>
                    </div>

                    <PatientPortalNavBarButtons />
                </div>
            </div>

            <div id='mobile-container' className='flex md:hidden'>
                <PatientPortalNavBarMobile loggedIn={loggedIn} />
                {/* <PortalNavBottomMenu /> */}
            </div>
        </>
    );
}
