// interface Props {
//     label: string;
//     data: string;
//     options: string[];
// }

// const InfoBoxWithOption = (props: Props) => (
//     <div className='flex flex-col gap-2'>
//         <div className='flex flex-row'>
//             <div className='text-primary font-medium mr-5 body1'>
//                 {props.label}
//             </div>
//             <div className='body1'>{props.data}</div>
//         </div>
//         {props.options && (
//             <div className='flex flex-row ml-2'>
//                 <div className='text-primary font-medium body2 mr-5'>
//                     Options:
//                 </div>
//                 <div className='flex flex-col gap-1 body2'>
//                     {props.options.map((option) => {
//                         return <div key={option}>{option}</div>;
//                     })}
//                 </div>
//             </div>
//         )}
//     </div>
// );

// export default InfoBoxWithOption;
