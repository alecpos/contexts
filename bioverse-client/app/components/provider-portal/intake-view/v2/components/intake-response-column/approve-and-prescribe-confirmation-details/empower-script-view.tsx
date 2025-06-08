import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import React from 'react';

interface ConfirmationWindowProps {
    script: EmpowerPrescriptionOrder;
    sigList: string[];
    empowerDisplayName: string | undefined;
}

export default function EmpowerConfirmationView({
    script,
    sigList,
    empowerDisplayName,
}: ConfirmationWindowProps) {
    return (
        <>
            {/* <BioType className='itd-body'>
                Please confirm the below medications and sig&apos;s
            </BioType> */}
            <BioType className="itd-subtitle text-primary">
                {empowerDisplayName}
            </BioType>

            {script.newRxs.map((rx: EmpowerNewRx, index: number) => {
                return (
                    <div key={index} className="py-2 w-full">
                        <BioType className="itd-body text-primary">
                            Medication:{' '}
                            <span className="it-body text-[#000000]">
                                {rx.medication.drugDescription}
                            </span>
                        </BioType>
                        <BioType className="itd-body text-primary">
                            Sig:{' '}
                            <span className="it-body text-[#000000]">
                                {sigList[index]}
                            </span>
                        </BioType>
                    </div>
                );
            })}
        </>
    );
}
