'use client';

import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { OrderType } from '@/app/types/orders/order-types';
import { PRODUCT_TEMPLATE_MAPPING } from '@/app/utils/constants/clinical-note-template-product-map';
import { Fragment } from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import React from 'react';
import ClinicalTemplateDropdownRender from '../clinical-note-templates/template-types/clinical-template-dropdown';
import ClinicalTemplateMultiSelectRender from '../clinical-note-templates/template-types/clinical-template-multiselect';
import ClinicalTemplateNoteRender from '../clinical-note-templates/template-types/clinical-template-note';
import ClinicalTemplateSelectRender from '../clinical-note-templates/template-types/clinical-template-select';
import { ClinicalNoteTemplateData } from '@/app/utils/constants/clinical-note-template-latest-versions';

interface ClinicalNoteRenderProps {
    editing: boolean;
    note_data: ClinicalNotesV2Supabase;
    editable: boolean;
    setEditsMade: (value: boolean) => void;
    setTemplateOptionData: React.Dispatch<
        React.SetStateAction<ClinicalNoteTemplateData[]>
    >;
    templateOptionData: ClinicalNoteTemplateData[];
    noteValue: string;
    setNoteValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function ClinicalTemplateRender({
    editing,
    note_data,
    editable,
    setEditsMade,
    setTemplateOptionData,
    templateOptionData,
    noteValue,
    setNoteValue,
}: ClinicalNoteRenderProps) {
    const dataKey = {
        product: note_data.product_href!,
        data: note_data.metadata,
    };
    const orderType = note_data.renewal_order_id
        ? OrderType.RenewalOrder
        : OrderType.Order;
    const note = note_data.note;
    const noteId = note_data.id;

    const productMapping =
        PRODUCT_TEMPLATE_MAPPING[dataKey.product as PRODUCT_HREF];
    const template = productMapping
        ? productMapping[orderType === OrderType.Order ? 'intake' : 'renewal'][
              note_data.template_version ?? 1
          ]
        : null;

    if (!template) {
        console.error('Template not found for product:', dataKey.product);
        // Handle the case when the template is not found
    }

    const modifyOption = (optionIndex: number, value: any[]) => {
        setEditsMade(true);
        setTemplateOptionData((prev) => {
            const newOptionDataArray = [...prev];
            newOptionDataArray[optionIndex].values = value;

            return newOptionDataArray;
        });
    };

    const renderTemplateSectionByType = (
        type: string,
        template_index: number
    ) => {
        switch (type) {
            case 'select':
                return (
                    <Fragment key={template_index}>
                        <ClinicalTemplateSelectRender
                            modifyOption={modifyOption}
                            templateRenderData={
                                template!.render[template_index]
                            }
                            templateDataValues={
                                templateOptionData[template_index]
                            }
                            current_index={template_index}
                            key={template_index}
                            editable={editable}
                        />
                    </Fragment>
                );
            case 'multi-select':
                return (
                    <Fragment key={template_index}>
                        <ClinicalTemplateMultiSelectRender
                            modifyOption={modifyOption}
                            templateRenderData={
                                template!.render[template_index]
                            }
                            templateDataValues={
                                templateOptionData[template_index]
                            }
                            current_index={template_index}
                            key={template_index}
                            editable={editable}
                        />
                    </Fragment>
                );
            case 'drop-down':
                return (
                    <Fragment key={template_index}>
                        <ClinicalTemplateDropdownRender
                            modifyOption={modifyOption}
                            templateRenderData={
                                template!.render[template_index]
                            }
                            templateDataValues={
                                templateOptionData[template_index]
                            }
                            current_index={template_index}
                            editable={editable}
                            order_id={
                                ['semaglutide', 'tirzepatide'].includes(
                                    dataKey.product
                                )
                                    ? (note_data.order_id as number) ??
                                      undefined
                                    : undefined
                            }
                        />
                    </Fragment>
                );
        }
    };

    const convertTimestamp = (timestamp: string) => {
        if (!timestamp) {
            return 'not tracked';
        }

        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    return (
        <div className='flex flex-col px-2 itd-body gap-0 rounded-lg '>
            {templateOptionData && (
                <div className='flex flex-col '>
                    <div className='flex flex-col mt-1 mb-6'>
                        {note_data.last_modified_at ? (
                            <>
                                <BioType className='provider-dropdown-title text-weak'>
                                    Last Modified:{' '}
                                </BioType>
                                <BioType className='provider-dropdown-title'>
                                    {convertTimestamp(
                                        note_data.last_modified_at
                                    )}
                                </BioType>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>

                    <div className='flex flex-col gap-4'>
                        {template &&
                            templateOptionData.map(
                                (
                                    value: ClinicalNoteTemplateData,
                                    index: number
                                ) => {
                                    return renderTemplateSectionByType(
                                        value.type,
                                        index
                                    );
                                }
                            )}
                    </div>

                    <div>
                        <ClinicalTemplateNoteRender
                            editing={editing}
                            noteValue={noteValue}
                            setNoteValue={setNoteValue}
                            setEditsMade={setEditsMade}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
