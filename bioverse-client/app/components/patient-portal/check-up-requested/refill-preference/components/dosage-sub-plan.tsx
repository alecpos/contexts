import { Button } from '@mui/material';


export default function DosageSubPlan({ 
    key,
    title,
    description,
    quarterlyOptionVariantIndex,
    selectedSubPlan,
    setSelectedSubPlan
}:
{
    key: number,
    title: string,
    description: string
    quarterlyOptionVariantIndex: number | null
    selectedSubPlan: number | null
    setSelectedSubPlan: (value: number | null) => void
}) {

    //once we have biannual/yearly options, we would have to check if all three (3m, 6m, 12m) are undefined before returning null
    //Then, instead of selectedSubPlan, we would have to have 3 useStates (selectedQuarterlySubPlan, selectedBiannualSubPlan, selectedYearlySubPlan)...
    //...which would all just represent variant indices, then each variant index would be placed in its own respective URL parameter
    if (!quarterlyOptionVariantIndex) {
        return null;
    }

    return (
        <div>
            <Button
                onClick={(e) => {
                    e.preventDefault();
                    setSelectedSubPlan(quarterlyOptionVariantIndex)
                }}
                className={`w-full md:w-[490px] rounded-lg items-start hover:cursor-pointer flex flex-col border-solid text-black normal-case  ${
                    selectedSubPlan === quarterlyOptionVariantIndex
                        ? 'border-[#98d2ea] border-solid border-4 bg-[#f5fafc] px-[0.9rem] md:px-[0.9rem] py-[1.3rem] md:py-[22px]'
                        : 'border-[#e0e0e0] border-solid border-2 bg-white px-[1rem] md:px-[1rem] py-[1.5rem] md:py-[24px]'
                    }`
                }
            >
                <div 
                    className="flex flex-row  intake-subtitle text-start normal-case text-black "
                    style={{
                            borderRadius: '12px'
                        }}
                >
                    <p> {title} <span>({description})</span></p>
                </div>
            </Button>
        </div>

    )
}