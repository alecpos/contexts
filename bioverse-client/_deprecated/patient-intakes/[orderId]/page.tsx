// import styles from '../../../../styles/provider-portal/provider-portal.module.css';
// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import { getPatientInformationById } from '@/app/utils/actions/provider/patient-overview';
// import { readUserSession } from '@/app/utils/actions/auth/session-reader';
// import { redirect } from 'next/navigation';
// import OverviewMainContainer from '@/app/components/provider-portal/patient-overview/overview-client-container';
// import { fetchOrderData } from '@/app/utils/database/controller/orders/orders-api';
// import { getHHQAnswersForProduct } from '@/app/utils/actions/intake/hhq-questionnaire';
// import { getPatientAllergyData } from '@/app/utils/database/controller/clinical_notes/clinical-notes';
// import {
//     getCheckupQuestionnaireResponse,
//     getQuestionnaireResponseForProduct_with_version,
// } from '@/app/utils/actions/intake/questionnaire';
// import { getLicenseOrSelfieURL } from '@/app/utils/actions/membership/membership-portal-actions';
// import { OrderType } from '@/app/types/orders/order-types';

// interface Props {
//     params: {
//         orderId: string;
//     };
// }

// export default async function ProviderPatientIntakeDisplay({ params }: Props) {
//     const providerId = (await readUserSession()).data.session?.user.id;
//     if (providerId === undefined) {
//         return redirect('/login');
//     }

//     const { type: orderType, data: orderData } = await fetchOrderData(
//         params.orderId
//     );

//     const patient_id =
//         orderType === OrderType.Order
//             ? orderData.customer_uid
//             : orderData.customer_uuid;

//     const questionnaire_response =
//         await getQuestionnaireResponseForProduct_with_version(
//             orderData.customer_uid,
//             orderData.product_href,
//             params.orderId,
//             orderData.question_set_version
//         );

//     const checkup_response = await getCheckupQuestionnaireResponse(patient_id);

//     function transformHealthHistoryResponse(
//         health_history_response: any[]
//     ): { question: string; answer: string }[] {
//         // Sort the response by question_id in ascending order
//         const sortedResponse = health_history_response.sort(
//             (a, b) => a.question_id - b.question_id
//         );

//         // Map the sorted response to the desired format
//         const transformedResponse = sortedResponse.map((item) => ({
//             question: item.answer[0].question,
//             answer: item.answer[0].answer,
//         }));

//         return transformedResponse;
//     }

//     const { data: patientData, error: patientDataError } =
//         await getPatientInformationById(patient_id);

//     if (patientDataError || !patientData) {
//         return (
//             <>
//                 <div className={styles.pageBackground}>
//                     <BioType>
//                         There was an error with fetching this order. Please try
//                         again later.
//                     </BioType>
//                     <BioType>Error Message: {patientDataError.message}</BioType>
//                 </div>
//             </>
//         );
//     }

//     const urlToRetrieveLicenseFrom = `${patientData.id}/${patientData.license_photo_url}`;
//     const { data: licenseUrl, error: licenseError } =
//         await getLicenseOrSelfieURL(urlToRetrieveLicenseFrom);

//     const urlToRetrieveSelfieFrom = `${patientData.id}/${patientData.selfie_photo_url}`;
//     const { data: selfieUrl, error: selfieError } = await getLicenseOrSelfieURL(
//         urlToRetrieveSelfieFrom
//     );

//     if (selfieError || licenseError) {
//         console.log('selfieError: ', selfieError);
//         console.log('licenseError', licenseError);
//     }

//     const licenseData: LicenseData = {
//         license: licenseError ? undefined : licenseUrl.signedUrl,
//         selfie: selfieError ? undefined : selfieUrl.signedUrl,
//     };

//     const { data: allergy_data, error: allergy_data_error } =
//         await getPatientAllergyData(patient_id, orderData.product_href);

//     if (!patientData) {
//         return (
//             <>
//                 <div className='flex flex-col max-w-[1128px] justify-start items-start gap-3 mx-auto mt-[100px] min-h-[100vh]'>
//                     <BioType>
//                         There was an error in loading the patient&apos;s
//                         information.
//                     </BioType>
//                 </div>
//             </>
//         );
//     }

//     if (Number(params.orderId) <= 1599) {
//         const health_history_response = await getHHQAnswersForProduct(
//             patient_id,
//             orderData.product_href
//         );

//         const health_history_transformed = transformHealthHistoryResponse(
//             health_history_response
//         );

//         return (
//             <div className={styles.pageBackground}>
//                 <div className='flex flex-col max-w-[1128px] justify-start items-start gap-3 mx-auto mt-[100px] min-h-[100vh]'>
//                     <OverviewMainContainer
//                         orderData={orderData}
//                         patientId={patient_id}
//                         providerId={providerId}
//                         orderId={params.orderId}
//                         patientData={patientData}
//                         checkup_response={checkup_response}
//                         questionnaire_response={questionnaire_response}
//                         health_history_response={health_history_transformed}
//                         allergy_data={
//                             allergy_data && allergy_data.length > 0
//                                 ? allergy_data[0].allergies
//                                 : 'nkda'
//                         }
//                         license_data={licenseData}
//                         orderType={orderType}
//                     />
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className={styles.pageBackground}>
//             <div className='flex flex-col max-w-[1128px] justify-start items-start gap-3 mx-auto mt-[100px] min-h-[100vh]'>
//                 <OverviewMainContainer
//                     orderData={orderData}
//                     patientId={patient_id}
//                     providerId={providerId}
//                     orderId={params.orderId}
//                     patientData={patientData}
//                     questionnaire_response={questionnaire_response}
//                     allergy_data={
//                         allergy_data && allergy_data.length > 0
//                             ? allergy_data[0].allergies
//                             : 'nkda'
//                     }
//                     license_data={licenseData}
//                     orderType={orderType}
//                     checkup_response={checkup_response}
//                 />
//             </div>
//         </div>
//     );
// }
