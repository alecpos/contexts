'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Chip, Radio } from '@mui/material';
import { useEffect, useState } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface EDDosageSelectionProps {
    dosageMapArray: {
        dosage: string;
        cost: number;
        recommended: boolean;
    }[];
    setDosageSelection: (dosage: string) => void;
}

export default function EDDosageSelection({
    dosageMapArray,
    setDosageSelection,
}: EDDosageSelectionProps) {
    const recommendedDosage = dosageMapArray.find(
        (option) => option.recommended === true
    );

    const [selectedOption, setSelectedOption] = useState<string>(
        recommendedDosage?.dosage ?? ''
    );

    useEffect(() => {
        setDosageSelection(selectedOption);
    }, [selectedOption]);

    return (
        <>
            <div className='flex flex-col gap-4 mt-16'>
                {recommendedDosage && (
                    <div
                        className={`border-solid rounded-md ${
                            selectedOption === recommendedDosage.dosage
                                ? 'border-[#286BA2]'
                                : 'border-[#BDBDBD]'
                        } border-2 p-4 relative gap-4 flex flex-col cursor-pointer`}
                        onClick={() => {
                            setSelectedOption(recommendedDosage.dosage);
                        }}
                    >
                        <div className='inline-flex absolute top-[-40px]'>
                            <div className='bg-primary px-4 py-[0.375rem] rounded-t-md'>
                                <BioType className='it-body md:itd-body text-white whitespace-nowrap'>
                                    Recommended Dose
                                </BioType>
                            </div>
                        </div>

                        {recommendedDosage.recommended && (
                            <BioType className='it-body md:itd-body text-[#666666]'>
                                We recommend the following dosage strength if
                                you are new to the medication.
                            </BioType>
                        )}

                        <div className='flex flex-row justify-between'>
                            <div className='flex flex-row items-center'>
                                <Radio
                                    checked={
                                        selectedOption ===
                                        recommendedDosage.dosage
                                    }
                                    value={recommendedDosage.dosage}
                                />
                                <BioType className='it-input md:itd-input'>
                                    {recommendedDosage.dosage}
                                </BioType>
                            </div>

                            <Chip
                                label={`From $${recommendedDosage.cost}/use`}
                            />
                        </div>

                        <div className='rounded-md bg-[#E5F6FD] p-2 flex flex-row gap-4'>
                            <InfoOutlinedIcon sx={{ color: '#0288D1' }} />
                            <BioType className='it-body md:itd-body'>
                                Your medical provider will determine if this
                                dose (or another) is appropriate.
                            </BioType>
                        </div>
                    </div>
                )}
                {dosageMapArray.length > 2 && (
                    <>
                        <BioType className='it-subtitle md:itd-subtitle text-[#646464]'>
                            If you&apos;ve used the medication before, you can
                            also choose a preferred dosage.{' '}
                        </BioType>
                    </>
                )}
                {dosageMapArray &&
                    dosageMapArray.map((dosageOption, index) => {
                        if (dosageOption.recommended) {
                            return null;
                        }

                        return (
                            <div
                                key={index}
                                className={`border-solid rounded-md ${
                                    selectedOption === dosageOption.dosage
                                        ? 'border-[#286BA2]'
                                        : 'border-[#BDBDBD]'
                                } border-2 p-4 cursor-pointer`}
                                onClick={() =>
                                    setSelectedOption(dosageOption.dosage)
                                }
                            >
                                <div className='flex flex-row justify-between'>
                                    <div className='flex flex-row items-center'>
                                        <Radio
                                            checked={
                                                selectedOption ===
                                                dosageOption.dosage
                                            }
                                            value={dosageOption.dosage}
                                        />
                                        <BioType className='it-input md:itd-input'>
                                            {dosageOption.dosage}
                                        </BioType>
                                    </div>

                                    <Chip
                                        label={`From $${dosageOption.cost}/use`}
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </>
    );
}
