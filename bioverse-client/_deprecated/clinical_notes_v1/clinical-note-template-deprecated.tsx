// 'use client';

// import {
//     PRODUCT_HREF,
//     PRODUCT_NAME_HREF_MAP,
// } from '@/app/types/global/product-enumerator';
// import { OrderType } from '@/app/types/orders/order-types';
// import {
//     ClinicalNoteDataKey,
//     ClinicalNoteTemplateData,
//     PRODUCT_TEMPLATE_LATEST_VERSION_MAP,
//     PRODUCT_TEMPLATE_MAPPING,
// } from '@/app/utils/constants/clinical-note-templates';
// import { useEffect, useState } from 'react';

// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import ClinicalTemplateMultiSelectRender from './template-types/clinical-template-multiselect';
// import ClinicalTemplateDropdownRender from './template-types/clinical-template-dropdown';
// import ClinicalTemplateNoteRender from './template-types/clinical-template-note';
// import ClinicalTemplateSelectRender from './template-types/clinical-template-select';
// import { Button } from '@mui/material';
// import { readUserSession } from '@/app/utils/actions/auth/session-reader';
// import { updateClinicalNoteTemplateData } from '@/app/utils/database/controller/clinical_notes/clinical_notes_v2';
// import useSWR from 'swr';

// interface ClinicalNoteRenderProps {
//     dataKey: ClinicalNoteDataKey;
//     orderType: OrderType;
//     note: string;
//     noteId: number;
//     note_template_record: any;
// }

// /**
//  *
//  * This component is deprecated and unused.
//  */
// export default function ClinicalNoteTemplateComponent({
//     dataKey,
//     orderType,
//     note,
//     noteId,
//     note_template_record,
// }: ClinicalNoteRenderProps) {
//     const [templateOptionData, setTemplateOptionData] = useState<
//         ClinicalNoteTemplateData[]
//     >(dataKey.data);
//     const [changesMade, setChangesMade] = useState<boolean>(false);
//     const [editable, setEditable] = useState<boolean>(false);

//     console.log('note template record logging: ', note_template_record);
//     const { data: sessionData } = useSWR('user_id', () => readUserSession());

//     useEffect(() => {
//         if (sessionData) {
//             const editability = isTemplateEditable(
//                 note_template_record,
//                 sessionData.data.session?.user.id ?? ''
//             );
//             setEditable(editability);
//         }
//     }, [sessionData]);

//     useEffect(() => {
//         setTemplateOptionData(dataKey.data);
//     }, [dataKey]);

//     const latestVersion =
//         PRODUCT_TEMPLATE_LATEST_VERSION_MAP[dataKey.product][
//             orderType === OrderType.Order ? 'intake' : 'renewal'
//         ];

//     const productMapping =
//         PRODUCT_TEMPLATE_MAPPING[dataKey.product as PRODUCT_HREF];
//     const template = productMapping
//         ? productMapping[orderType === OrderType.Order ? 'intake' : 'renewal'][
//               latestVersion
//           ]
//         : null;

//     if (!template) {
//         console.error('Template not found for product:', dataKey.product);
//         // Handle the case when the template is not found
//     }

//     const modifyOption = (optionIndex: number, value: any[]) => {
//         setChangesMade(true);
//         setTemplateOptionData((prev) => {
//             const newOptionDataArray = [...prev];
//             newOptionDataArray[optionIndex].values = value;

//             return newOptionDataArray;
//         });
//     };

//     const renderTemplateSectionByType = (
//         type: string,
//         template_index: number
//     ) => {
//         switch (type) {
//             case 'select':
//                 return (
//                     <div key={template_index}>
//                         <ClinicalTemplateSelectRender
//                             modifyOption={modifyOption}
//                             templateRenderData={
//                                 template!.render[template_index]
//                             }
//                             templateDataValues={
//                                 templateOptionData[template_index]
//                             }
//                             current_index={template_index}
//                             key={template_index}
//                             editable={editable}
//                         />
//                     </div>
//                 );
//             case 'multi-select':
//                 return (
//                     <div key={template_index}>
//                         <ClinicalTemplateMultiSelectRender
//                             modifyOption={modifyOption}
//                             templateRenderData={
//                                 template!.render[template_index]
//                             }
//                             templateDataValues={
//                                 templateOptionData[template_index]
//                             }
//                             current_index={template_index}
//                             key={template_index}
//                             editable={editable}
//                         />
//                     </div>
//                 );
//             case 'drop-down':
//                 return (
//                     <div key={template_index}>
//                         <ClinicalTemplateDropdownRender
//                             modifyOption={modifyOption}
//                             templateRenderData={
//                                 template!.render[template_index]
//                             }
//                             templateDataValues={
//                                 templateOptionData[template_index]
//                             }
//                             current_index={template_index}
//                             order_id={
//                                 ['semaglutide', 'tirzepatide'].includes(
//                                     dataKey.product
//                                 )
//                                     ? note_template_record.order_id
//                                     : null
//                             }
//                             editable={editable}
//                         />
//                     </div>
//                 );
//         }
//     };

//     const updateClinicalNoteTemplate = async () => {
//         const userId = (await readUserSession()).data.session?.user.id;
//         updateClinicalNoteTemplateData(noteId, templateOptionData, userId!);
//         setChangesMade(false);
//     };

//     return (
//         <div className='flex flex-col p-4 itd-body gap-4'>
//             {templateOptionData && (
//                 <div className='flex flex-col gap-2'>
//                     <div className='flex flex-row justify-between'>
//                         <BioType className='itd-subtitle'>
//                             {PRODUCT_NAME_HREF_MAP[dataKey.product]}
//                         </BioType>
//                         {changesMade && (
//                             <Button
//                                 variant='outlined'
//                                 size='small'
//                                 onClick={updateClinicalNoteTemplate}
//                             >
//                                 Save changes
//                             </Button>
//                         )}
//                     </div>
//                     <div className='flex flex-col gap-4'>
//                         {template &&
//                             templateOptionData.map(
//                                 (
//                                     value: ClinicalNoteTemplateData,
//                                     index: number
//                                 ) => {
//                                     return renderTemplateSectionByType(
//                                         value.type,
//                                         index
//                                     );
//                                 }
//                             )}
//                     </div>
//                     {changesMade && (
//                         <Button
//                             variant='outlined'
//                             onClick={updateClinicalNoteTemplate}
//                         >
//                             Save changes
//                         </Button>
//                     )}
//                     <div>
//                         <ClinicalTemplateNoteRender
//                             note={note}
//                             noteId={noteId}
//                             editable={editable}
//                         />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// function isTemplateEditable(
//     note_template_record: any,
//     userId: string
// ): boolean {
//     if (!note_template_record.created_by) {
//         return false;
//     }

//     if (note_template_record.created_by === userId) {
//         const createdAt = new Date(note_template_record.created_at);
//         const now = new Date();
//         const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

//         const timeDifference = now.getTime() - createdAt.getTime();

//         return timeDifference < oneDayInMilliseconds;
//     }
//     return false;
// }
