'use client';

import { FC } from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Chip, Paper } from '@mui/material';
import Image from 'next/image';

type Props = {
    label: string;
    desc: string;
    chipLabel: string;
    onClick: () => void;
    image?: string;
    specialTag?: string;
};

const Card: FC<Props> = ({
    label,
    desc,
    chipLabel,
    specialTag = '',
    image,
    onClick,
}) => {
    return (
        <div className="flex flex-col w-full">
            {specialTag && (
                <div className="inline-flex ml-4">
                    <div className="bg-primary px-2 py-[0.375rem] rounded-t-md">
                        <BioType className="it-body md:itd-body text-white whitespace-nowrap">
                            {specialTag}
                        </BioType>
                    </div>
                </div>
            )}
            <Paper
                className="flex flex-col hover:cursor-pointer items-center self-stretch px-5 py-6 border-solid border-[#FFF] border-[1px]"
                onClick={onClick}
            >
                <div className="flex justify-between items-start w-full">
                    <div className="flex flex-col self-stretch items-start mr-5">
                        <div className="flex flex-col items-start gap-1">
                            <BioType className="it-subtitle md:itd-subtitle text-primary">
                                {label}
                            </BioType>
                            <BioType className="it-body md:itd-body">
                                {desc}
                            </BioType>
                        </div>
                        {image && (
                            <Chip label={chipLabel} className="mt-auto" />
                        )}
                    </div>
                    {image ? (
                        <Image src={image} alt={''} width={157} height={126}  unoptimized />
                    ) : (
                        <Chip label={chipLabel} />
                    )}
                </div>
            </Paper>
        </div>
    );
};

export default Card;