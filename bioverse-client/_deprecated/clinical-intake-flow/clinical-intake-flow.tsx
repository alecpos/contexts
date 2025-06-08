// 'use client';

// import { Divider, Paper } from '@mui/material';
// import IntakeQAList from './intake-display/qa-list';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import { useState } from 'react';
// import cx from 'classnames';
// import styles from '../../../styles/provider-portal/provider-portal.module.css';
// import { generalIntakeToProviderDisplay } from '@/app/utils/actions/provider/parsers';
// import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
// import { CheckupQuestionnaire } from '@/app/types/questionnaires/questionnaire-types';

// interface Props {
//     orderData: {
//         id: any;
//         customer_uid: any;
//         product_href: any;
//         variant_text: any;
//         subscription_type: any;
//         rx_questionnaire_answers: any;
//         patient: {
//             first_name: any;
//             last_name: any;
//             health_history_response?: any;
//         }[];
//         product: any;
//         renewal_order_id?: string;
//     };
//     questionnaire_response: any;
//     health_history_response?: any;
//     checkup_response: CheckupQuestionnaire[];
// }

// export default function ClinicalIntakeFlowContainer({
//     orderData,
//     questionnaire_response,
//     health_history_response,
//     checkup_response,
// }: Props) {
//     const [healthHistoryExpanded, setHealthHistoryExpanded] =
//         useState<boolean>(true);
//     const [rxQuestionsExpanded, setRxQuestionsExpanded] =
//         useState<boolean>(true);
//     const [checkupExpanded, setCheckupExpanded] = useState<boolean>(true);
//     const sectionHeaderClass = `flex flex-row items-center gap-2 mt-4`;
//     if (orderData.id <= 1599 && !orderData.renewal_order_id) {
//         const rxIntakeConverted = generalIntakeToProviderDisplay(
//             orderData.rx_questionnaire_answers
//         );

//         return (
//             <div className='w-full'>
//                 <Paper className={cx('p-10 pt-5 mb-10', styles.dataContainer)}>
//                     <div className={sectionHeaderClass}>
//                         <BioType className='h6 text-primary'>
//                             Clinical Intake Flow
//                         </BioType>
//                     </div>

//                     <BioType className={'subtitle2'}>
//                         {orderData.product.name}, {orderData.variant_text},{' '}
//                         {orderData.subscription_type}
//                     </BioType>

//                     <Divider sx={{ margin: '1.25em 0' }} />

//                     <div className={styles.lastUpdated}>
//                         LAST UPDATED: 1/3/2024
//                     </div>

//                     <div>
//                         <div
//                             className={sectionHeaderClass}
//                             onClick={() =>
//                                 setHealthHistoryExpanded((prev) => !prev)
//                             }
//                         >
//                             <BioType className='h6 text-primary'>
//                                 Health History
//                             </BioType>
//                             {healthHistoryExpanded ? (
//                                 <KeyboardArrowUpIcon />
//                             ) : (
//                                 <KeyboardArrowDownIcon />
//                             )}
//                         </div>
//                         {healthHistoryExpanded && (
//                             <IntakeQAList
//                                 version='old'
//                                 list={health_history_response}
//                             />
//                         )}
//                         <div
//                             className={sectionHeaderClass}
//                             onClick={() =>
//                                 setRxQuestionsExpanded((prev) => !prev)
//                             }
//                         >
//                             <BioType className='h6 text-primary'>
//                                 Product Questionnaire
//                             </BioType>
//                             {rxQuestionsExpanded ? (
//                                 <KeyboardArrowUpIcon />
//                             ) : (
//                                 <KeyboardArrowDownIcon />
//                             )}
//                         </div>
//                         {rxQuestionsExpanded && (
//                             <IntakeQAList
//                                 version='old'
//                                 list={rxIntakeConverted}
//                             />
//                         )}
//                         <div
//                             className={sectionHeaderClass}
//                             onClick={() => setCheckupExpanded((prev) => !prev)}
//                         >
//                             <BioType className='h6 text-primary'>
//                                 Check-in Questionnaire
//                             </BioType>
//                             {checkupExpanded ? (
//                                 <KeyboardArrowUpIcon />
//                             ) : (
//                                 <KeyboardArrowDownIcon />
//                             )}
//                         </div>
//                         {checkupExpanded && (
//                             <IntakeQAList
//                                 version='new'
//                                 list={checkup_response}
//                             />
//                         )}
//                     </div>
//                 </Paper>
//             </div>
//         );
//     }

//     return (
//         <div className='w-full '>
//             <Paper className={cx('p-10 pt-5', styles.dataContainer)}>
//                 <div className={sectionHeaderClass}>
//                     <BioType className='h6 text-primary'>
//                         Clinical Intake Flow
//                     </BioType>
//                 </div>

//                 <BioType className={'subtitle2'}>
//                     {orderData.product.name}, {orderData.variant_text},{' '}
//                     {orderData.subscription_type}
//                 </BioType>

//                 <Divider sx={{ margin: '1.25em 0' }} />

//                 <div className={styles.lastUpdated}>LAST UPDATED: 1/3/2024</div>

//                 <div>
//                     <div
//                         className={sectionHeaderClass}
//                         onClick={() => setRxQuestionsExpanded((prev) => !prev)}
//                     >
//                         <BioType className='h6 text-primary'>
//                             Product Questionnaire
//                         </BioType>
//                         {rxQuestionsExpanded ? (
//                             <KeyboardArrowUpIcon />
//                         ) : (
//                             <KeyboardArrowDownIcon />
//                         )}
//                     </div>
//                     {rxQuestionsExpanded && (
//                         <IntakeQAList
//                             version='new'
//                             list={questionnaire_response}
//                         />
//                     )}
//                 </div>
//                 <div>
//                     <div
//                         className={sectionHeaderClass}
//                         onClick={() => setCheckupExpanded((prev) => !prev)}
//                     >
//                         <BioType className='h6 text-primary'>
//                             Check-in Questionnaire
//                         </BioType>
//                         {checkupExpanded ? (
//                             <KeyboardArrowUpIcon />
//                         ) : (
//                             <KeyboardArrowDownIcon />
//                         )}
//                     </div>
//                     {checkupExpanded && (
//                         <IntakeQAList version='new' list={checkup_response} />
//                     )}
//                 </div>
//             </Paper>
//         </div>
//     );
// }
