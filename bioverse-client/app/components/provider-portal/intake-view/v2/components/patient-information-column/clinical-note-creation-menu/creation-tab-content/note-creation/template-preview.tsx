'use client';

import {
    PRODUCT_HREF,
    PRODUCT_NAME_HREF_MAP,
} from '@/app/types/global/product-enumerator';
import { OrderType } from '@/app/types/orders/order-types';
import { PRODUCT_TEMPLATE_MAPPING } from '@/app/utils/constants/clinical-note-template-product-map';
import { useState } from 'react';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import ClinicalTemplateDropdownRender from '../../../clinical-note-templates/template-types/clinical-template-dropdown';
import ClinicalTemplateMultiSelectRender from '../../../clinical-note-templates/template-types/clinical-template-multiselect';
import ClinicalTemplateSelectRender from '../../../clinical-note-templates/template-types/clinical-template-select';
import { createClinicalNoteValuesFromTemplate } from '../../../../../utils/clinical-notes/clinical-note-functions';
import {
    PRODUCT_TEMPLATE_LATEST_VERSION_MAP,
    ClinicalNoteTemplateOptionType,
    ClinicalNoteTemplateData,
} from '@/app/utils/constants/clinical-note-template-latest-versions';

interface ClinicalNoteRenderProps {
    orderType: OrderType;
    product_href: string;
}

export default function ClinicalNoteTemplateComponent({
    orderType,
    product_href,
}: ClinicalNoteRenderProps) {
    const [editable, setEditable] = useState<boolean>(false);

    const latestVersion =
        PRODUCT_TEMPLATE_LATEST_VERSION_MAP[product_href][
            orderType === OrderType.Order ? 'intake' : 'renewal'
        ];

    const productMapping =
        PRODUCT_TEMPLATE_MAPPING[product_href as PRODUCT_HREF];
    const template = productMapping
        ? productMapping[orderType === OrderType.Order ? 'intake' : 'renewal'][
              latestVersion
          ]
        : null;

    console.log('template', template, orderType);

    if (!template) {
        console.error('Template not found for product');
        // Handle the case when the template is not found
    }

    const modifyOption = (optionIndex: number, value: any[]) => {};

    const renderTemplateSectionByType = (
        type: string,
        template_index: number
    ) => {
        switch (type) {
            case 'select':
                return (
                    <div key={template_index}>
                        <ClinicalTemplateSelectRender
                            modifyOption={modifyOption}
                            templateRenderData={
                                template!.render[template_index]
                            }
                            templateDataValues={{
                                type: ClinicalNoteTemplateOptionType.SELECT,
                                values: [],
                            }}
                            current_index={template_index}
                            key={template_index}
                            editable={editable}
                        />
                    </div>
                );
            case 'multi-select':
                return (
                    <div key={template_index}>
                        <ClinicalTemplateMultiSelectRender
                            modifyOption={modifyOption}
                            templateRenderData={
                                template!.render[template_index]
                            }
                            templateDataValues={{
                                type: ClinicalNoteTemplateOptionType.MULTISELECT,
                                values: [],
                            }}
                            current_index={template_index}
                            key={template_index}
                            editable={editable}
                        />
                    </div>
                );
            case 'drop-down':
                return (
                    <div key={template_index}>
                        <ClinicalTemplateDropdownRender
                            modifyOption={modifyOption}
                            templateRenderData={
                                template!.render[template_index]
                            }
                            templateDataValues={{
                                type: ClinicalNoteTemplateOptionType.DROPDOWN,
                                values: [],
                            }}
                            current_index={template_index}
                            editable={editable}
                        />
                    </div>
                );
        }
    };

    const templateOptionData = createClinicalNoteValuesFromTemplate(template!);

    return (
        <div className='flex flex-col p-4 itd-body gap-4 '>
            <div className='flex flex-col gap-2'>
                <div className='flex flex-row justify-between'>
                    <BioType className='provider-intake-tab-title '>
                        {PRODUCT_NAME_HREF_MAP[product_href]}
                    </BioType>
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
            </div>
        </div>
    );
}
