import { Button, Checkbox, Chip } from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import {
    INTAKE_INPUT_TAILWIND,
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_SUBTITLE_TAILWIND,
} from '../styles/intake-tailwind-declarations';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Image from 'next/image';

interface DosageCardProps {
    dose: number;
    price: number;
    selectedDosage: number;
    setSelectedDosage: Dispatch<SetStateAction<number>>;
}
const DosageCard = ({
    price,
    dose,
    selectedDosage,
    setSelectedDosage,
}: DosageCardProps) => {
    const [showMore, setShowMore] = useState<boolean>(false);

    return (
        <div className='flex flex-col md:py-6 md:px-[30px] md:pb-2 py-4 px-2 rounded-[4px] border border-solid border-[#BDBDBD] items-center gap-2'>
            <div className='flex gap-4'>
                {selectedDosage == dose && (
                    <Chip
                        label='Selected Dosage'
                        color='primary'
                        className='w-auto'
                    />
                )}
                <Chip
                    label='For a limited time, save $60!'
                    color='secondary'
                    className='w-auto'
                />
            </div>

            <div className='flex flex-row w-full'>
                <div className='flex pt-[2.375rem] pr-3'>
                    <Checkbox
                        size='medium'
                        sx={{ height: '36px', width: '36px', bottom: 0 }}
                        checked={selectedDosage == dose}
                        onChange={() => {
                            setSelectedDosage(dose);
                        }}
                    />
                </div>
                <div className='w-full'>
                    <div className='flex flex-row w-full justify-between'>
                        <div>
                            <BioType
                                className={`${INTAKE_PAGE_SUBTITLE_TAILWIND}  !font-twcsemimedium`}
                            >
                                {dose} mg/week (1-month supply)
                            </BioType>
                            <BioType
                                className={`${INTAKE_INPUT_TAILWIND}  !font-twcsemimedium`}
                            >
                                ${price}/first month{' '}
                                <span className='text-[#FFFFF] opacity-[.36]'>
                                    <s>${price + 60}/month</s>
                                </span>
                            </BioType>

                            <BioType
                                className={`${INTAKE_INPUT_TAILWIND}  !font-twcsemimedium`}
                            >
                                {dose * 4} mg monthly protocol
                            </BioType>
                        </div>

                        <div className=' w-[48px] md:w-[76px] aspect-square relative'>
                            <Image
                                src={`/img/product-images/prescriptions/semaglutide.png`}
                                alt={'Semaglutide '}
                                fill
                                unoptimized
                            />
                        </div>
                    </div>
                    <div className='w-full text-center'>
                        <Button onClick={() => setShowMore(!showMore)}>
                            {!showMore ? (
                                <>
                                    <BioType className='text-[.8125rem]'>
                                        Learn More
                                    </BioType>
                                    <ExpandMore fontSize='small' />
                                </>
                            ) : (
                                <>
                                    <BioType className='text-[.8125rem]'>
                                        See Less
                                    </BioType>
                                    <ExpandLessIcon fontSize='small' />
                                </>
                            )}
                        </Button>
                    </div>
                    {showMore && (
                        <div
                            className={`${INTAKE_PAGE_BODY_TAILWIND} text-textSecondary w-full mb-4`}
                        >
                            <BioType className={`${INTAKE_PAGE_BODY_TAILWIND}`}>
                                What&apos;s included
                            </BioType>{' '}
                            <ul className='ml-4'>
                                <li>Semaglutide {dose * 4} mg vial</li>
                                <li>Injection needles</li>
                                <li>Alcohol pads</li>
                                <li>
                                    Consistent support from your care team to
                                    ensure you&apos;re achieving your weight
                                    loss goals
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DosageCard;
