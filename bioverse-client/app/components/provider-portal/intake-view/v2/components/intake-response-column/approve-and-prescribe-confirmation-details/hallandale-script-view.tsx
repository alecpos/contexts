import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import React from 'react';

interface ConfirmationWindowProps {
    script: HallandaleOrderObject;
    sigList: string[];
    hallandaleDisplayName: string | undefined;
}

export default function HallandaleConfirmationView({
    script,
    sigList,
    hallandaleDisplayName,
}: ConfirmationWindowProps) {
    if (!script) {
        return <>No Script</>;
    }

    return (
        <>
            <BioType className="itd-subtitle text-primary">
                {hallandaleDisplayName}
            </BioType>

            {script.rxs &&
                script.rxs.map((rx: HallandaleNewRxObject, index: number) => {
                    if (rx.drugName === 'GLP-1 Inj Kit') {
                        return;
                    }
                    return (
                        <div key={index} className="py-2 w-full">
                            <BioType className="itd-body text-primary">
                                Medication:{' '}
                                <span className="it-body text-[#000000]">
                                    {rx.drugName}
                                </span>
                            </BioType>
                            <BioType className="itd-body text-primary">
                                Sig:{' '}
                                {!rx.internalSigDisplay &&
                                    sigList.length > index && (
                                        <span className="it-body text-[#000000]">
                                            {sigList[index]}
                                        </span>
                                    )}
                                {rx.internalSigDisplay &&
                                    rx.internalSigDisplay.map((sig, index) => {
                                        return (
                                            <BioType
                                                key={index}
                                                className="it-body text-black"
                                            >
                                                {sig}
                                            </BioType>
                                        );
                                    })}
                            </BioType>
                        </div>
                    );
                })}
        </>
    );
}
