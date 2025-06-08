'use client';

import { FC, useState } from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { INTAKE_PAGE_HEADER_TAILWIND } from '@/app/components/intake-v2/styles/intake-tailwind-declarations';
import MultiSelectItem from '@/app/components/intake-v2/questions/question-types/multi-select/multi-select-item';
type Props = {
    handleSelection: () => void;
};

const SingleSelect: FC<Props> = ({ handleSelection }) => {
    return (
        <>
            <div
                className={`justify-center flex animate-slideRight max-w-[456px]`}
            >
                <div className="flex flex-row gap-8">
                    <div className="flex flex-col gap-6">
                        <BioType className={`${INTAKE_PAGE_HEADER_TAILWIND}`}>
                            How often do you have trouble getting or keeping an
                            erection during sex?
                        </BioType>

                        <div className="flex flex-col gap-2 md:gap-[22px]">
                            <MultiSelectItem
                                option="Every time"
                                showCheck={false}
                                selected={false}
                                handleCheckboxChange={handleSelection}
                                intake={false}
                            />
                            <MultiSelectItem
                                option="Half the time"
                                showCheck={false}
                                selected={false}
                                handleCheckboxChange={handleSelection}
                                intake={false}
                            />
                            <MultiSelectItem
                                option="On occasion"
                                showCheck={false}
                                selected={false}
                                handleCheckboxChange={handleSelection}
                                intake={false}
                            />
                            <MultiSelectItem
                                option="Rarely"
                                showCheck={false}
                                selected={false}
                                handleCheckboxChange={handleSelection}
                                intake={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleSelect;
