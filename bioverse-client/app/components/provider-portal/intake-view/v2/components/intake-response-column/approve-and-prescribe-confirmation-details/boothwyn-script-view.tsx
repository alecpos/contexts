'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { BOOTHWYN_SKU_NAME_MAP } from '@/app/services/pharmacy-integration/boothwyn/boothwyn-variant-mapping';
import { PRODUCT_NAME_HREF_MAP } from '@/app/types/global/product-enumerator';

interface BoothwynScriptViewProps {
    script: BoothwynScriptJSON;
    sigList: string[];
    dosage: string;
    product_href: string;
}

export default function BoothwynScriptView({
    script,
    sigList,
    dosage,
    product_href,
}: BoothwynScriptViewProps) {
    const prodcut_name = PRODUCT_NAME_HREF_MAP[product_href];

    console.log('BOSAOAOAOSODASKDSAODKSAD', script);

    return (
        <div className='flex flex-col w-full gap-2'>
            <BioType className='itd-subtitle text-primary'>
                Script Information:
            </BioType>
            <BioType className='itd-subtitle'>
                {prodcut_name + ' ' + dosage}
            </BioType>

            <div>
                <BioType className='itd-subtitle'>Medication:</BioType>
                {script.prescriptions.map(
                    (prescription_item, index: number) => {
                        return (
                            <BioType className='itd-body' key={index}>
                                {BOOTHWYN_SKU_NAME_MAP[prescription_item.sku]} x
                                {prescription_item.amount}
                            </BioType>
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
