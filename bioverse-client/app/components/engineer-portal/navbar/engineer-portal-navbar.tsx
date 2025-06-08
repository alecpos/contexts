'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import SignOutButton from '../../coordinator-portal/navbar/components/sign-out-button';
import LogoHorizontal from '../../navigation/components/logo-horizontal/logo-horizontal';

interface CoordinatorNavBarProps {
    user_id: string | undefined;
}

export default function EngineerNavBar({ user_id }: CoordinatorNavBarProps) {
    const router = useRouter();

    const fullPath = usePathname();

    if (!user_id) {
        router.push(`/login?originalRef=${encodeURIComponent(fullPath)}`);
    }

    return (
        <div
            className={`w-full h-[var(--nav-height)] bg-white top-0 flex shadow-navbar justify-between z-50 fixed`}
        >
            <div className='flex flex-row items-center ml-[0.83vw]'>
                <Link href={'/'} className='relative font-normal'>
                    <div>
                        <LogoHorizontal
                            breakpoint='desktop'
                            className='!flex-[0_0_auto]'
                            logoColor='/img/bioverse-logo.png'
                            status='visitor'
                        />
                    </div>
                </Link>
            </div>

            {user_id && (
                <div className='flex flex-row justify-center items-center pr-10 gap-[1.5em] h-full'>
                    <div>Dashboard</div>
                    <SignOutButton />
                </div>
            )}
        </div>
    );
}
