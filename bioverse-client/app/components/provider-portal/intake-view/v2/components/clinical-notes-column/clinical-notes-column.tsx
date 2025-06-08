import React, { Dispatch, SetStateAction, memo, useCallback } from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import AddClinicalNoteButton from '../patient-information-column/clinical-note-creation-menu/add-note-button';
import ClinicalNoteAccordionContent from '../patient-information-column/clinical-notes-content';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';

interface ClinicalNotesColumnProps {
    patient_data: DBPatientData;
    order_data: DBOrderData;
    setClinicalNotesMinimized: Dispatch<SetStateAction<boolean>>;
    provider_id: string;
}

const TitleArea = memo(({ onMinimize }: { onMinimize: () => void }) => (
    <div
        id='title_area'
        className='w-full h-[32px] flex justify-between items-center py-[10px]'
    >
        <div className='px-3 flex items-center justify-between w-full'>
            <BioType className='provider-intake-tab-title'>
                Allergy, Medication, Vitals & Clinical Notes
            </BioType>
            <div className='flex justify-center items-center hover:cursor-pointer border-[1px] border-solid border-[#D7E3EB] rounded'>
                <UnfoldLessIcon
                    className='transform rotate-45 text-black'
                    onClick={onMinimize}
                />
            </div>
        </div>
    </div>
));

TitleArea.displayName = 'TitleArea';

const ClinicalNotesColumn = memo(
    ({
        setClinicalNotesMinimized,
        order_data,
        patient_data,
        provider_id,
    }: ClinicalNotesColumnProps) => {
        const handleMinimize = useCallback(() => {
            setClinicalNotesMinimized(true);
        }, [setClinicalNotesMinimized]);

        const orderId = order_data.renewal_order_id
            ? order_data.original_order_id
            : order_data.id;

        return (
            <div 
                className='flex flex-col pt-0.5 pb-3 bg-white rounded flex-grow overflow-auto' 
                style={{ boxShadow: '0px -2px 15px 0px rgba(0, 0, 0, 0.15)' }}
            >
                <TitleArea onMinimize={handleMinimize} />

                <div className='flex'>
                    <HorizontalDivider backgroundColor='#E4E4E4' height={1} />
                </div>

                <div className='flex flex-col box-border flex-grow h-full overflow-y-auto'>
                    <ClinicalNoteAccordionContent
                        patient_id={patient_data.id}
                        product_href={order_data.product_href}
                        order_data={order_data}
                        provider_id={provider_id}
                    />
                </div>

                <div className='flex flex-col w-full items-center pt-3'>
                    <AddClinicalNoteButton
                        patient_id={patient_data.id}
                        product_href={order_data.product_href}
                        order_id={orderId}
                        renewal_order_id={
                            order_data.renewal_order_id ?? undefined
                        }
                    />
                </div>
            </div>
        );
    }
);

ClinicalNotesColumn.displayName = 'ClinicalNotesColumn';

export default ClinicalNotesColumn;
