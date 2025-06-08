'use client';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MessageIcon from '@mui/icons-material/Message';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { usePathname, useRouter } from 'next/navigation';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ViewListIcon from '@mui/icons-material/ViewList';

export default function PortalNavBottomMenu() {
    const router = useRouter();
    const pathname = usePathname();

    // Determine active state based on the current pathname
    const isActive = (path: string) => {
        return pathname.includes(path);
    };

    if (pathname.includes('check-up')) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 h-[56px] bg-white shadow-navbar z-50">
            <div className="flex justify-around items-center h-full">
                <div
                    className={`flex flex-col items-center ${
                        isActive('/portal/subscriptions')
                            ? 'text-blue-500'
                            : 'text-gray-500'
                    }`}
                    onClick={() => router.push('/portal/subscriptions')}
                >
                    <ViewListIcon />
                    <span className="text-xs">Subscriptions</span>
                </div>
                <div
                    className={`flex flex-col items-center ${
                        isActive('/portal/order-history')
                            ? 'text-blue-500'
                            : 'text-gray-500'
                    }`}
                    onClick={() => router.push('/portal/order-history')}
                >
                    <ShoppingCartIcon />
                    <span className="text-xs">Orders</span>
                </div>
                <div
                    className={`flex flex-col items-center ${
                        isActive('/portal/message')
                            ? 'text-blue-500'
                            : 'text-gray-500'
                    }`}
                    onClick={() => router.push('/portal/message')}
                >
                    <MessageIcon />
                    <span className="text-xs">Messages</span>
                </div>
                <div
                    className={`flex flex-col items-center ${
                        isActive('/portal/account-information')
                            ? 'text-blue-500'
                            : 'text-gray-500'
                    }`}
                    onClick={() => router.push('/portal/account-information')}
                >
                    <AccountCircleIcon />
                    <span className="text-xs">Account</span>
                </div>
            </div>
        </div>
    );
}
