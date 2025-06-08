// import Divider from '@mui/material/Divider/Divider';
// import InfoBox from './info-box';
// import InfoBoxWithOption from './option-info-box';
// import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
// import { CONDITIONAL_QUESTIONS_LIST } from '@/app/components/intake-v2/constants/question-constants';
// import { Question } from '../../../../types/check-up/check-up-types';

// interface Props {
//     list: any;
//     version: string;
// }

// const IntakeQAList = ({ list, version }: Props) => {
//     if (version === 'old') {
//         return list && list.length > 0
//             ? list.map((e: any, i: number) => (
//                   <div key={i}>
//                       <Divider sx={{ margin: '1.25em 0' }} />
//                       <div className='grid grid-cols-2 gap-[4vw]'>
//                           <InfoBox label='Question' data={e.question} />
//                           <InfoBox label='Answer' data={e.answer} />
//                       </div>
//                   </div>
//               ))
//             : null;
//     }

//     if (!list) {
//         return (
//             <>
//                 <BioType>There was an issue with the question intake</BioType>
//             </>
//         );
//     }

//     return list && list.length > 0 ? (
//         list.map((e: any, i: number) => (
//             <>
//                 {determineQuestionRender(e) && (
//                     <div key={i}>
//                         <Divider sx={{ margin: '1.25em 0' }} />
//                         <div className='grid grid-cols-2 gap-[4vw]'>
//                             <InfoBoxWithOption
//                                 label='Question'
//                                 data={
//                                     e.question.steps
//                                         ? e.question.steps[0].question
//                                         : e.question.question
//                                 }
//                                 options={
//                                     e.question.steps
//                                         ? e.question.steps[0].options
//                                         : e.question.options
//                                 }
//                             />
//                             <InfoBox
//                                 label='Answer'
//                                 data={
//                                     e.answer
//                                         ? e.answer.answer
//                                         : 'There was no answer specified'
//                                 }
//                             />
//                         </div>
//                     </div>
//                 )}
//             </>
//         ))
//     ) : (
//         <div className='mt-5 italic'>
//             This patient has not yet completed this intake questionnaire.
//         </div>
//     );
// };

// function determineQuestionRender(question_object: any): boolean {
//     if (question_object.question.question === 'Transition Screen') {
//         return false;
//     }
//     if (
//         CONDITIONAL_QUESTIONS_LIST.includes(
//             String(question_object.question_id)
//         ) &&
//         question_object.answer === null
//     ) {
//         return false;
//     }

//     return true;
// }

// export default IntakeQAList;
