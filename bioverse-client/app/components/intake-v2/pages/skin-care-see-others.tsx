'use client';

import { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { getNextIntakeRoute } from '@/app/utils/functions/intake-route-controller';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { getIntakeURLParams } from '../intake-functions';
import { LoadingButtonCustom } from '../buttons/LoadingButtonCustom';
import SkincareSeeOthersDekstopComponent from '../skin-care/see-others-page/see-others-desktop-cards';

interface SkinCareSeeOthersComponentProps {}

export default function SkinCareSeeOthersComponent({}: SkinCareSeeOthersComponentProps) {
    const router = useRouter();
    const url = useParams();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const fullPath = usePathname();
    const { product_href } = getIntakeURLParams(url, searchParams);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const pushToNextRoute = () => {
        setButtonLoading(true);
        const nextRoute = getNextIntakeRoute(fullPath, product_href, search);
        const searchParams = new URLSearchParams(search);
        // Remove the 'nu' parameter
        searchParams.delete('nu');
        // Construct the new search string without the 'nu' parameter
        const newSearch = searchParams.toString();
        router.push(
            `/intake/prescriptions/${product_href}/${nextRoute}?${newSearch}`,
        );
        return;
    };

    return (
        <>
            <div className="w-[90%] md:w-full items-center md:flex md:flex-col">
                <BioType className="it-h1 md:itd-h1 text-primary">
                    See what others are saying about their treatments.
                </BioType>

                <div className="flex">
                    <SkincareSeeOthersDekstopComponent />
                </div>

                <div className="flex flex-col gap-4">
                    <LoadingButtonCustom
                        onClick={pushToNextRoute}
                        loading={buttonLoading}
                        customButtonText="Free Today"
                    />
                    <BioType className="text-[#00000061] it-body md:itd-body">
                        Individual results may vary. Customer results have not
                        been independently verified.
                    </BioType>
                </div>
            </div>
        </>
    );
}
