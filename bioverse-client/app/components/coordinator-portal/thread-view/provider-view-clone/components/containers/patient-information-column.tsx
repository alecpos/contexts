'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Paper,
    Typography,
} from '@mui/material';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import dynamic from 'next/dynamic';
import { Dispatch, memo, SetStateAction, useCallback } from 'react';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

const DynamicDemographicsAccordionContent = dynamic(
    () => import('../patient-information-column/demographics-content'),
    {
        loading: () => <LoadingScreen />,
    }
);

const DynamicDocumentAccordionContent = dynamic(
    () => import('../patient-information-column/documents-content'),
    {
        loading: () => <LoadingScreen />,
    }
);

const DynamicOrderAccordionContent = dynamic(
    () => import('../patient-information-column/orders-content'),
    {
        loading: () => <LoadingScreen />,
    }
);

interface PatientResponseColumnProps {
    patient_data: DBPatientData;
    order_data: DBOrderData;
    setPatientInformationMinimized?: Dispatch<SetStateAction<boolean>>;
    setMessageContent?: Dispatch<SetStateAction<string>>;
}

const TitleArea = memo(({ onMinimize }: { onMinimize: () => void }) => (
    <div
        id='title_area'
        className='w-full h-[32px] flex justify-between items-center pt-[10px]'
    >
        <div className='px-3 flex items-center justify-between w-full'>
            <BioType className='provider-intake-tab-title'>
                Demographics, Intakes & Orders
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

export default function PatientInformationColumn({
    patient_data,
    order_data,
    setPatientInformationMinimized,
    setMessageContent,
}: PatientResponseColumnProps) {
    const handleMinimize = useCallback(() => {
        if (setPatientInformationMinimized) {
            setPatientInformationMinimized(true);
        }
    }, [setPatientInformationMinimized]);

    return (
        <div className={`flex flex-col w-full gap-2`}>
            <TitleArea onMinimize={handleMinimize} />

            <div id='divider' className='flex w-full '>
                <HorizontalDivider backgroundColor={'#e0e0e0'} height={1} />
            </div>
            <div className='flex flex-col flex-grow overflow-y-auto overflow-x-hidden'>
                <Accordion defaultExpanded={true} disableGutters>
                    <AccordionSummary
                        className='!bg-white'
                        expandIcon={<ExpandMoreIcon />}
                        id='panel1a-header'
                    >
                        <Typography className='provider-dropdown-title underline'>
                            Patient Demographics
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <DynamicDemographicsAccordionContent
                            patient_data={patient_data}
                        />
                        <DynamicDocumentAccordionContent
                            patient_id={patient_data.id}
                            setMessageContent={setMessageContent}
                        />
                    </AccordionDetails>
                </Accordion>
                <Accordion disableGutters>
                    <AccordionSummary
                        className='!bg-white'
                        expandIcon={<ExpandMoreIcon />}
                        id='panel1a-header'
                    >
                        <Typography className='provider-dropdown-title underline'>
                            Past Orders
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <DynamicOrderAccordionContent
                            order_data={order_data}
                            patient_data={patient_data}
                        />
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
}
