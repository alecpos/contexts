'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import BMIAccordionRecord from './bmi-accordion-record';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';

import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';


interface BmiAccordionProps {
    bmi_notes: ClinicalNotesV2Supabase[];
}

export default function BmiClinicalNoteAccordion({
    bmi_notes,
}: BmiAccordionProps) {
    const [showMore, setShowMore] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState(true);

    const convertTimestamp = (timestamp: string) => {
        if (!timestamp) {
            return 'not tracked';
        }

        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const handleAccordionChange = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <Accordion disableGutters defaultExpanded style={{ boxShadow: 'none' }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                onClick={() => handleAccordionChange()}
            >
                <BioType
                    className={`provider-dropdown-title ${
                        isExpanded ? 'underline' : ''
                    }`}
                >
                    BMI
                </BioType>
            </AccordionSummary>
            <AccordionDetails>
                <div className='flex flex-col gap-2'>
                    {bmi_notes.length === 1 && (
                        <BMIAccordionRecord 
                            bmi_note_data={bmi_notes[0]} 
                            initial_note={null}
                            last_note={null}
                        />
                    )}
      
                    {!showMore && bmi_notes.length > 1 && (
                        <>
                        <BMIAccordionRecord 
                            bmi_note_data={bmi_notes[0]} 
                            initial_note={bmi_notes[bmi_notes.length - 1].note}
                            last_note={bmi_notes[1]}
                        />
                
                        <div onClick={() => setShowMore(true)} className='bg-[#E5EDF4] py-2 px-2'>
                            <BioType className='text-strong inter-basic text-[14px] items-center flex gap-1 hover:underline cursor-pointer'>
                                <RestoreOutlinedIcon
                                    sx={{ fontSize: '20px' }}
                                />
                                Show Previous BMI Records
                            </BioType>
                        </div>
                        </>
                    )} 

                    {showMore &&
                        bmi_notes.length > 1 && (
                        <>
                        <BMIAccordionRecord 
                            bmi_note_data={bmi_notes[0]} 
                            initial_note={bmi_notes[bmi_notes.length - 1].note}
                            last_note={bmi_notes[1]}
                        />
          
                        {bmi_notes.map(
                            (
                                bmi_note_item: ClinicalNotesV2Supabase,
                                index: number
                            ) => {
                                if (index < 1) {
                                    return null;
                                }

                                return (
                                    <>
                                    <div className='flex flex-col h-[1px]'>
                                    <HorizontalDivider backgroundColor={'#E4E4E4'} height={1} />
                                </div>
                                    <BMIAccordionRecord
                                        key={index}
                                        bmi_note_data={bmi_note_item}
                                        initial_note={index === bmi_notes.length - 1 ? null : bmi_notes[bmi_notes.length - 1].note} 
                                        last_note={bmi_notes[index + 1] ? bmi_notes[index + 1]: null}
                                    />
                                </>
                                );
                            }
                        )}
                        </>

                    )}
                        
                    {showMore && bmi_notes.length > 1 && (
                        <div onClick={() => setShowMore(false)} className='bg-[#E5EDF4] py-2 px-2'>
                            <BioType className='text-weak inter-basic text-[14px] items-center flex gap-1 hover:underline cursor-pointer'>
                                Show Fewer BMI Records
                            </BioType>
                        </div>
                    )}
                </div>
            </AccordionDetails>
        </Accordion>
    );
}
