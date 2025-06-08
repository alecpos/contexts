// 'use server';

// import AllPatientsPageContainer from '@/app/components/provider-portal/all-patients/page-container';
// import { getAllProfiles } from '@/app/utils/database/controller/profiles/profiles';

// interface Props {}

// export default async function AdminAllPatientsPage({}: Props) {
//     const { profiles, error: profile_error } = await getAllProfiles();

//     if (profile_error) {
//         return <>Error</>;
//     }

//     return (
//         <>
//             <div className='flex justify-center items-start py-10 px-10'>
//                 <AllPatientsPageContainer profiles={profiles} />
//             </div>
//         </>
//     );
// }
