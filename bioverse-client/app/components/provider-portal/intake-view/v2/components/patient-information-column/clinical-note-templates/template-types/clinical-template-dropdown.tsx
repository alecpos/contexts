'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    ClinicalTemplateOption,
    ClinicalNoteTemplateData,
} from '@/app/utils/constants/clinical-note-template-latest-versions';
import { updateOrderAssignedDosage } from '@/app/utils/database/controller/orders/orders-api';
import { FormControl, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';

interface MultiSelectRenderProps {
    templateRenderData: ClinicalTemplateOption;
    templateDataValues: ClinicalNoteTemplateData;
    modifyOption: (optionIndex: number, value: any[]) => void;
    current_index: number;
    order_id?: number;
    editable: boolean;
}

export default function ClinicalTemplateDropdownRender({
    templateRenderData,
    templateDataValues,
    modifyOption,
    current_index,
    order_id,
    editable,
}: MultiSelectRenderProps) {
    const [dataValues, setDataValues] = useState<any[]>(
        templateDataValues.values || ['']
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
        setDosageForOrder(newValue);
    };

    console.log('order ID from template dropdown: ', order_id);

    const setDosageForOrder = async (assignedDosage: string) => {
        if (order_id) {
            await updateOrderAssignedDosage(order_id, assignedDosage);
        }
    };

    return (
        <div className='flex flex-col'>
            {templateRenderData.title && (
                <BioType className='provider-dropdown-title'>
                    {templateRenderData.title}
                </BioType>
            )}

            <div className='flex flex-col gap-2'>
                <FormControl>
                    <Select
                        disabled={!editable}
                        value={dataValues[0]}
                        onChange={(e) => {
                            modifyDataValue(e.target.value);
                        }}
                        displayEmpty
                        renderValue={(selected) => {
                            if (!selected) {
                                return <em>Please Select</em>;
                            }
                            return selected;
                        }}
                    >
                        <MenuItem
                            value={undefined}
                            disabled
                            sx={{ display: 'hidden' }}
                        ></MenuItem>
                        {templateRenderData.values &&
                            templateRenderData.values.map((value, index) => {
                                return (
                                    <MenuItem value={value} key={index}>
                                        {value}
                                    </MenuItem>
                                );
                            })}
                    </Select>
                </FormControl>
            </div>
        </div>
    );
}
