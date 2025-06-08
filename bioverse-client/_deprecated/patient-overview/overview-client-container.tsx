// 'use client';
// import { useState } from 'react';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
// import ProviderStatusButtonMain from '../clinical-intake-flow/approval-buttons/provider-status-button-main';
// import ClinicalIntakeFlowContainer from '../clinical-intake-flow/clinical-intake-flow';
// import ClinicalNotes from './clinical-notes/clinical-notes';
// import ProviderPatientInformation from './patient-information/provider-patient-information';
// import ProviderIDView from './id-selfie-view/provider-id-view';
// import { useRouter } from 'next/navigation';
// import { OrderType } from '@/app/types/orders/order-types';
// import { CheckupQuestionnaire } from '@/app/types/questionnaires/questionnaire-types';
// import dynamic from 'next/dynamic';
// import LoadingScreen from '../../global-components/loading-screen/loading-screen';

// interface Props {
//     orderData: any;
//     providerId: string;
//     orderId: string;
//     patientData: any;
//     allergy_data: string;
//     questionnaire_response: any;
//     health_history_response?: any;
//     license_data: any;
//     patientId: string;
//     orderType: OrderType;
//     checkup_response: CheckupQuestionnaire[];
// }

// const DynamicDoseSpotIframeContainer = dynamic(
//     () =>
//         import(
//             '../clinical-intake-flow/dose-spot-iframe/dose-spot-iframe-container'
//         ),
//     {
//         loading: () => <LoadingScreen />,
//     }
// );

// const DynamicTailorMadeCompoundsInterface = dynamic(
//     () => import('../clinical-intake-flow/tmc-interface/tmc-interface'),
//     {
//         loading: () => <LoadingScreen />,
//     }
// );

// const DynamicEmpowerInterface = dynamic(
//     () => import('../clinical-intake-flow/empower-interface/empower-interface'),
//     {
//         loading: () => <LoadingScreen />,
//     }
// );

// export default function OverviewMainContainer({
//     orderData,
//     providerId,
//     orderId,
//     patientData,
//     allergy_data,
//     questionnaire_response,
//     health_history_response,
//     license_data,
//     patientId,
//     orderType,
//     checkup_response,
// }: Props) {
//     const [prescribeWindowOpen, setPrescribeWindowState] =
//         useState<boolean>(false);
//     console.log(orderData);
//     const determineWindowBasedOnPharmacy = () => {
//         switch (orderData.assigned_pharmacy) {
//             case 'curexa':
//             case 'ggm':
//                 return (
//                     <DynamicDoseSpotIframeContainer
//                         patientDoseSpotId={patientData.dose_spot_id}
//                         providerId={providerId}
//                     />
//                 );
//             case 'tmc':
//                 return (
//                     <DynamicTailorMadeCompoundsInterface
//                         patientData={patientData}
//                         orderData={orderData}
//                         allergyData={allergy_data}
//                     />
//                 );
//             case 'empower':
//                 return (
//                     <DynamicEmpowerInterface
//                         patientData={patientData}
//                         orderData={orderData}
//                         orderType={orderType}
//                     />
//                 );
//         }
//     };

//     const router = useRouter();

//     const handleDashboardRedirect = () => {
//         router.push('/provider/dashboard');
//     };

//     const handleCustomerRedirect = () => {
//         router.push(`/provider/patient-overview/${orderData.customer_uid}`);
//     };

//     return (
//         <>
//             <div className='flex flex-col w-full gap-4 mb-[150px]'>
//                 <div className='flex flex-row ml-[-50px] gap-2'>
//                     <div
//                         className={`flex flex-row items-center gap-2 no-underline hover:underline text-[#1B1B1B8F]`}
//                         onClick={handleDashboardRedirect}
//                     >
//                         <ArrowBackIcon className='text-[#1B1B1B8F]' />
//                         <BioType className='body1 text-[#B1B1B1]'>
//                             Provider Portal
//                         </BioType>
//                     </div>

//                     <BioType className='body1 text-[#B1B1B1]'>/</BioType>

//                     <div
//                         className='flex flex-row items-center gap-2 hover:underline no-underline'
//                         onClick={handleCustomerRedirect}
//                     >
//                         <BioType className='body1 text-[#B1B1B1]'>
//                             {patientData.first_name} {patientData.last_name}
//                         </BioType>
//                     </div>
//                 </div>
//                 <div className='flex flex-row justify-between w-full'>
//                     <BioType className='h3'>Prescription Intake Flow</BioType>
//                     <div className='flex flex-col mr-20 gap-2'>
//                         {/* {orderData.order_status === "Unapproved-NoCard" || orderData.order_status === "Unapproved-CardDown" ? ( */}
//                         <ProviderStatusButtonMain
//                             orderData={orderData}
//                             providerId={providerId}
//                             orderId={orderId}
//                             patientData={patientData}
//                             setPrescribeWindowState={setPrescribeWindowState}
//                             prescribeWindowOpen={prescribeWindowOpen}
//                             orderType={orderType}
//                         />
//                     </div>
//                 </div>

//                 <ProviderPatientInformation
//                     orderData={orderData}
//                     patientData={patientData}
//                     showAddress
//                 />
//                 <ProviderIDView licenseData={license_data} />
//                 {prescribeWindowOpen && determineWindowBasedOnPharmacy()}
//                 <ClinicalNotes
//                     patientId={patientId}
//                     product_href={orderData.product_href}
//                 />
//                 <ClinicalIntakeFlowContainer
//                     orderData={orderData}
//                     questionnaire_response={questionnaire_response}
//                     health_history_response={health_history_response || null}
//                     checkup_response={checkup_response}
//                 />
//             </div>
//         </>
//     );
// }
