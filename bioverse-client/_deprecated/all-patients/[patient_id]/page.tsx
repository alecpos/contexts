// 'use server';

// import PatientInformationContainer from '@/app/components/provider-coordinator-shared/all-patients/components/patient-page/patient-container';
// import { getProfileDataForProviderLookup } from '@/app/utils/database/controller/profiles/profiles';

// interface Props {
//     params: {
//         patient_id: string;
//     };
// }

// export default async function AdminAllPatientsPage({ params }: Props) {
//     const { data: profile_data, error: profile_data_error } =
//         await getProfileDataForProviderLookup(params.patient_id);

//     return (
//         <>
//             <div className='flex justify-center items-center py-10 px-40'>
//                 <PatientInformationContainer
//                     profile_data={profile_data as APProfileData}
//                 />
//             </div>
//         </>
//     );
// }
