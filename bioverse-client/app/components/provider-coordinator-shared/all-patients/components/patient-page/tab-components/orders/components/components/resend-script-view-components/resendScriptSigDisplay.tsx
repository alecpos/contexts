'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { SigVizualizer } from '@/app/utils/classes/SigVisualizer/SigVisualizer';
import { useEffect, useState } from 'react';

interface ResendScriptSigDisplayProps {
    productHref: PRODUCT_HREF;
    variantIndex: number;
}

export default function ResendScriptSigDisplay({
    productHref,
    variantIndex,
}: ResendScriptSigDisplayProps) {
    const [sigObject, setSigObject] = useState<SigObject>();
    const [pharmacy, setPharmacy] = useState<string>();

    useEffect(() => {
        const sigVisualizer = new SigVizualizer(productHref, variantIndex);
        setSigObject(sigVisualizer.getSigs());
        setPharmacy(sigVisualizer.assigned_pharmacy);
    }, [productHref, variantIndex]);

    return (
        <div className='flex flex-col gap-2'>
            <BioType className='itd-subtitle'>
                {pharmacy
                    ? pharmacy.charAt(0).toUpperCase() + pharmacy.slice(1)
                    : ''}{' '}
                sig information:
            </BioType>
            <BioType className='itd-input'>{sigObject?.productName}</BioType>
            <div className='flex flex-col gap-2'>
                {sigObject?.sigs.map((sig, index) => (
                    <BioType key={index} className='itd-body'>
                        {sig}
                    </BioType>
                ))}
            </div>
        </div>
    );
}
