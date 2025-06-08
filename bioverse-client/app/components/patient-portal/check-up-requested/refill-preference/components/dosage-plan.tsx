"use client"

import { Button } from '@mui/material';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import { event } from 'jquery';



interface DosagePlanProps {
    plan: {
        title: string,
        plan: string,
        dosage: number,
        subtitle: string,
        extraText: string
    }
    selectedPlan: string,
    setSelectedPlan: Function
    selectedDosage: number | null,
    setSelectedDosage: Function
}

export default function DosagePlan({ 
    plan,
    selectedPlan, 
    setSelectedPlan,
    selectedDosage,
    setSelectedDosage
}: DosagePlanProps) {


    return (
        <div>
            {plan.title === 'Dosage Plan 1' &&  
                <div className=' intake-v3-disclaimer-text w-fit h-[0.75rem] md:h-[18px] px-3 py-1 rounded-t-lg bg-gradient-to-r from-cyan-200 to-pink-200 ml-3 flex flex-col justify-center'>
                    Recommended
                </div>
            }
            <Button
                onClick={(e) => {
                    e.preventDefault();
                    setSelectedPlan(plan.plan);
                    setSelectedDosage(plan.dosage);
                }}
                className={`w-full md:w-[447px] rounded-lg items-start hover:cursor-pointer flex flex-col border-solid text-black normal-case  ${
                    selectedPlan === plan.plan
                        ? 'border-[#98d2ea] border-solid border-4 bg-[#f5fafc] py-[0.9rem] md:py-[14px] px-[0.9rem] md:px-[14px]'
                        : 'border-[#e0e0e0] border-solid border-2 bg-white py-[1rem] md:py-[16px] px-[1rem] md:px-[16px]'
                    }`
                }
            >
                <div className="flex flex-col ">
                    <p className='intake-v3-18px-20px-bold text-black'>{plan.title}</p>
                    <p className='intake-subtitle text-black text-start mt-[11px]'>{plan.subtitle}</p>
                   
                    <p 
                        className='intake-subtitle pt-[16px] mt-[16px] border-t'
                        style={{
                            borderTopColor: '#E0E0E0',
                            borderTopWidth: '1px',
                            borderTopStyle: 'solid',
                        }}
                    >{plan.extraText}</p>  </div>
            </Button>
        </div>
        

    )
}