'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    ClinicalTemplateOption,
    ClinicalNoteTemplateData,
} from '@/app/utils/constants/clinical-note-template-latest-versions';
import { Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import { useEffect, useState } from 'react';

interface MultiSelectRenderProps {
    templateRenderData: ClinicalTemplateOption;
    templateDataValues: ClinicalNoteTemplateData;
    modifyOption: (optionIndex: number, value: any[]) => void;
    current_index: number;
    editable: boolean;
}

export default function ClinicalTemplateMultiSelectRender({
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

    const modifyDataValue = (index: number, newValue: any) => {
        setDataValues((prev) => {
            const newDataValues = [...prev];
            newDataValues[index] = newValue;
            return newDataValues;
        });
    };

    return (
        <div className='flex flex-col'>
            {(templateRenderData?.title ?? '') && (
                <BioType className='provider-dropdown-title'>
                    {templateRenderData.title}
                </BioType>
            )}
            {current_index === 0 && (
                <>
                    <div className='flex flex-row items-start gap-9'>
                        <BioType className='provider-dropdown-title'>Y</BioType>
                        <BioType className='provider-dropdown-title'>N</BioType>
                    </div>
                </>
            )}
            <div
                className={`flex flex-col ${
                    templateRenderData && templateRenderData.setting === 'Dx'
                        ? ''
                        : 'gap-1'
                }`}
            >
                {templateRenderData && templateRenderData.values && (
                    <div
                        className={
                            templateRenderData.setting === 'Dx'
                                ? 'grid grid-cols-2 gap-0'
                                : ''
                        }
                    >
                        {templateRenderData.values.map((value, index) => {
                            if (current_index === 0) {
                                return (
                                    <div
                                        className='flex flex-row my-3'
                                        key={index}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    disabled={!editable}
                                                    checked={dataValues[index]}
                                                    onChange={(e) =>
                                                        modifyDataValue(
                                                            index,
                                                            e.target.checked
                                                        )
                                                    }
                                                    size='small'
                                                />
                                            }
                                            label={''}
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    disabled={!editable}
                                                    checked={!dataValues[index]}
                                                    onChange={(e) =>
                                                        modifyDataValue(
                                                            index,
                                                            !e.target.checked
                                                        )
                                                    }
                                                    size='small'
                                                />
                                            }
                                            label={
                                                <BioType
                                                    className={
                                                        'provider-dropdown-title text-weak tracking-tight'
                                                    }
                                                >
                                                    {value}
                                                </BioType>
                                            }
                                        />
                                    </div>
                                );
                            }

                            if (templateRenderData.setting === 'Dx') {
                                return (
                                    <div
                                        className='flex flex-row my-1'
                                        key={index}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    disabled={!editable}
                                                    checked={dataValues[index]}
                                                    onChange={(e) =>
                                                        modifyDataValue(
                                                            index,
                                                            e.target.checked
                                                        )
                                                    }
                                                    size='small'
                                                />
                                            }
                                            label={
                                                <BioType
                                                    className={
                                                        'provider-dropdown-title text-weak tracking-tight'
                                                    }
                                                >
                                                    {value}
                                                </BioType>
                                            }
                                        />
                                    </div>
                                );
                            }

                            return (
                                <div className='flex flex-row' key={index}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                disabled={!editable}
                                                checked={dataValues[index]}
                                                onChange={(e) =>
                                                    modifyDataValue(
                                                        index,
                                                        e.target.checked
                                                    )
                                                }
                                                size='small'
                                            />
                                        }
                                        label={
                                            <BioType
                                                className={
                                                    'provider-dropdown-title text-weak tracking-tight'
                                                }
                                            >
                                                {value}
                                            </BioType>
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
