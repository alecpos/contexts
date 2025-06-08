'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { FormControlLabel, Radio } from '@mui/material';
import { useEffect, useState } from 'react';
import ClinicalTemplateCustomTooltip from './custom-template-mods/clinical-template-tooltip';
import {
    ClinicalTemplateOption,
    ClinicalNoteTemplateData,
} from '@/app/utils/constants/clinical-note-template-latest-versions';

interface MultiSelectRenderProps {
    templateRenderData: ClinicalTemplateOption;
    templateDataValues: ClinicalNoteTemplateData;
    modifyOption: (optionIndex: number, value: any[]) => void;
    current_index: number;
    editable: boolean;
}

export default function ClinicalTemplateSelectRender({
    templateRenderData,
    templateDataValues,
    modifyOption,
    current_index,
    editable,
}: MultiSelectRenderProps) {
    const [dataValues, setDataValues] = useState<any[]>(
        templateDataValues.values
    );

    useEffect(() => {
        setDataValues(templateDataValues.values);
    }, [templateDataValues]);

    useEffect(() => {
        if (dataValues !== templateDataValues.values) {
            modifyOption(current_index, dataValues);
        }
    }, [dataValues]);

    const modifyDataValue = (newValue: any) => {
        setDataValues(() => {
            const newDataValues = [];
            newDataValues[0] = newValue;
            return newDataValues;
        });
    };

    const renderCustomClinicalNoteMod = (customObject: any) => {
        switch (customObject.type) {
            case 'tooltip':
                return (
                    <ClinicalTemplateCustomTooltip
                        text={customObject.text}
                        hover={customObject.hover}
                    />
                );
        }
    };

    return (
        <div className='flex flex-col'>
            {(templateRenderData?.title ?? '') && (
                <BioType className='provider-dropdown-title mb-1'>
                    {templateRenderData.title}
                </BioType>
            )}
            {(templateRenderData?.custom ?? '') && (
                <span className='provider-dropdown-title mb-1'>
                    {renderCustomClinicalNoteMod(templateRenderData.custom)}
                </span>
            )}
            <div className='flex flex-col gap-1'>
                {(templateRenderData?.values ?? '') &&
                    templateRenderData.values.map((value, index) => {
                        return (
                            <div className='flex flex-row' key={index}>
                                <FormControlLabel
                                    control={
                                        <Radio
                                            disabled={!editable}
                                            checked={dataValues[0] === value}
                                            onChange={() =>
                                                modifyDataValue(value)
                                            }
                                            size='small'
                                        />
                                    }
                                    label={
                                        <BioType
                                            className={`${
                                                dataValues[0] === value
                                                    ? 'provider-dropdown-title '
                                                    : 'provider-dropdown-title text-weak'
                                            }`}
                                        >
                                            {value}
                                        </BioType>
                                    }
                                />
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
