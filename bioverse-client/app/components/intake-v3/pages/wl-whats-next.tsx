'use client';
import Image from 'next/image';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ContinueButtonV3 from '../buttons/ContinueButtonV3';
import { useState } from 'react';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import router from 'next/router';
import { getIntakeURLParams } from '../intake-functions';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';

export default function WhatsNextComponent() {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const url = useParams();
    const searchParams = useSearchParams();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const search = searchParams.toString();
    const router = useRouter();

    const fullPath = usePathname();

    const pushToNextRoute = () => {
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(
            fullPath,
            product_href,
            search,
            false,
            'none',
            '',
        );

        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${search}`,
        );
    };

    return (
        <div className="flex flex-col gap-12 items-center flex-1 mt-12 ">
            <BioType className="inter-h5-question-header self-start">
                Almost done, here&apos;s what&apos;s next
            </BioType>
            <div className="hidden md:flex w-[490px] h-[478px]">
                <Image
                    src="/img/intake/wl/whats-next-desktop.png"
                    width={490}
                    height={478}
                    alt="Whats next"
                />
            </div>
            <div className="md:hidden w-[330px] h-[460px] mr-2">
                <Image
                    src="/img/intake/wl/whats-next-mobile.png"
                    width={345}
                    height={475}
                    alt="Whats next"
                />
            </div>
            <ContinueButtonV3
                onClick={pushToNextRoute}
                buttonLoading={buttonLoading}
            />
        </div>
    );
}
