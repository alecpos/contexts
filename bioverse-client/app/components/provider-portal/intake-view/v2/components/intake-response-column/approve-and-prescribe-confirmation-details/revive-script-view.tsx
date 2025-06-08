'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { BOOTHWYN_SKU_NAME_MAP } from '@/app/services/pharmacy-integration/boothwyn/boothwyn-variant-mapping';
import { PRODUCT_NAME_HREF_MAP } from '@/app/types/global/product-enumerator';

interface ReviveScriptViewProps {
    script: ReviveScriptJSON;
    sigList: string[];
    dosage: string;
    product_href: string;
}

export default function ReviveScriptView({
    script,
    sigList,
    dosage,
    product_href,
}: ReviveScriptViewProps) {
    const prodcut_name = PRODUCT_NAME_HREF_MAP[product_href];

    console.log('revive script view check: ', script);

    return (
        <div className='flex flex-col w-full gap-2'>
            <BioType className='itd-subtitle text-primary'>
                Script Information:
            </BioType>
            <BioType className='itd-subtitle'>
                {prodcut_name + ' ' + dosage}
            </BioType>

            <div>
                <BioType className='itd-subtitle'>Medications:</BioType>
                {script.medication_requests.map(
                    (medication_item, index: number) => {
                        return (
                            <div className='flex flex-col' key={index}>
                                <BioType className='itd-subtitle' key={index}>
                                    {medication_item.medication}
                                </BioType>
                                <BioType className='itd-body ml-2' key={index}>
                                    {medication_item.sig}
                                </BioType>
                            </div>
                        );
                    }
                )}
            </div>

            <div>
                {sigList.map((sig, index) => {
                    return (
                        <BioType className='itd-body' key={index}>
                            {sig}
                        </BioType>
                    );
                })}
            </div>
        </div>
    );
}
