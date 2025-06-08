'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Paper,
    Typography,
} from '@mui/material';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import dynamic from 'next/dynamic';
import { Dispatch, memo, SetStateAction, useCallback, useState } from 'react';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import CoordinatorAddManualInternalNoteDialog from '@/app/components/coordinator-portal/orderID-TaskView/coordinator-manual-internal-note/coordinator-manual-internal-note';

const DynamicClinicalNoteAccordionContent = dynamic(
    () => import('../patient-information-column/clinical-notes-v2-content'),
    {
        loading: () => <LoadingScreen />,
    }
);

const DynamicInternalNotesAccordionConent = dynamic(
    () =>
        import(
            '@/app/components/provider-portal/provider-patient-review/provider-review-UI/patient-information/internal-notes-accordion/internal-notes-accordion'
        ),
    {
        loading: () => <LoadingScreen />,
        ssr: false,
    }
);

interface PatientResponseColumnProps {
    patient_data: DBPatientData;
    order_data: DBOrderData;
    setClinicalNotesMinimized: Dispatch<SetStateAction<boolean>>;
}

const TitleArea = memo(({ onMinimize }: { onMinimize: () => void }) => (
    <div
        id='title_area'
        className='w-full h-[32px] flex justify-between items-center pt-[10px]'
    >
        <div className='px-3 flex items-center justify-between w-full'>
            <BioType className='provider-intake-tab-title'>
                Internal Notes
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

export default function NotesColumn({
    patient_data,
    order_data,
    setClinicalNotesMinimized,
}: PatientResponseColumnProps) {
    const [
        coordinatorAddManualInternalNoteDialogOpen,
        setCoordinatorAddManualInternalNoteDialogOpen,
    ] = useState(false);

    const handleMinimize = useCallback(() => {
        setClinicalNotesMinimized(true);
    }, [setClinicalNotesMinimized]);

    return (
        <div className={`flex flex-col w-full gap-2 h-full`}>
            <TitleArea onMinimize={handleMinimize} />
            <div id='divider' className='flex w-full'>
                <HorizontalDivider backgroundColor={'#e0e0e0'} height={1} />
            </div>
            <div className='flex flex-col flex-grow overflow-y-auto overflow-x-hidden scrollbar-hide'>
                <Accordion defaultExpanded={true} disableGutters>
                    <AccordionSummary
                        className='!bg-white'
                        expandIcon={<ExpandMoreIcon />}
                        id='panel1a-header'
                    >
                        <Typography className='provider-dropdown-title underline'>
                            Internal Notes
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <DynamicInternalNotesAccordionConent
                            patientId={patient_data.id}
                        />
                    </AccordionDetails>
                </Accordion>

                {/* <Accordion >
                    <AccordionSummary
                    className='!bg-white'
                        expandIcon={<ExpandMoreIcon />}
                        id="panel1a-header"
                    >
                        <Typography className='provider-dropdown-title underline'>Clinical Notes</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <DynamicClinicalNoteAccordionContent
                            patient_id={patient_data.id}
                            product_href={
                                order_data && order_data.product_href
                                    ? order_data.product_href
                                    : ''
                            }
                        />
                    </AccordionDetails>
                </Accordion> */}
            </div>
            <div className='flex flex-col items-center justify-center py-4 mt-auto'>
                <div className='flex flex-row gap-2'>
                    <Button
                        onClick={() =>
                            setCoordinatorAddManualInternalNoteDialogOpen(true)
                        }
                        variant='contained'
                        color='primary'
                        sx={{
                            textTransform: 'none',
                            fontSize: '14px',
                            px: 6,
                            py: 0,
                            height: '36px',
                            borderRadius: 'var(--Corner-radius-M,12px)',
                            bgcolor: 'black',
                            '&:hover': {
                                bgcolor: '#666666',
                            },
                        }}
                    >
                        <span className='font-inter'>Add custom note</span>
                    </Button>

                    <CoordinatorAddManualInternalNoteDialog
                        open={coordinatorAddManualInternalNoteDialogOpen}
                        onClose={() =>
                            setCoordinatorAddManualInternalNoteDialogOpen(false)
                        }
                        patient_id={patient_data.id}
                        order_id={order_data.id}
                    />
                </div>
            </div>
        </div>
    );
}
