'use client';

import {
    Dialog,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import React from 'react';
import ClinicalNoteDisplayTiptap from './note-tiptap';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getProviderNameFromId } from './utils/clinical-note-provider-map';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface AllergyMedPreviousHistoryModalProps {
    dialogOpen: boolean;
    onClose: () => void;
    data_type: string;
    note_history_array: any[];
}

export default function AllergyMedicationPreviousHistoryModal({
    dialogOpen,
    onClose,
    data_type,
    note_history_array,
}: AllergyMedPreviousHistoryModalProps) {
    const renderTitle = () => {
        switch (data_type) {
            case 'allergy':
                return 'Previous Allergy History';
            case 'medication':
                return 'Previous Medication History';
            default:
                return 'Previous History';
        }
    };

    const convertTimestamp = (timestamp: string) => {
        if (!timestamp) {
            return 'not tracked';
        }

        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    return (
        <>
            <Dialog open={dialogOpen} onClose={onClose}>
                <DialogTitle sx={{ backgroundColor: '#FAFAFA' }}>
                    <div className='provider-intake-tab-title-secondary '>{renderTitle()}</div>
                </DialogTitle>
                <DialogContent>
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 650 }}
                            aria-label='history table'
                        >
                            <TableBody>
                                {note_history_array.map((item, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? 'white' : 'inherit', 
                                        }}
                                    >
                                        <div className='flex flex-col my-[6px] min-h-[59px] p-[12px]' style={{ border: '1px solid black', borderRadius: '4px' }}>
                                            <div>
                                                <span className='provider-dropdown-title'>Updated by: {getProviderNameFromId(item.editor)}</span>
                                            </div>
                                            <div 
                                            className='flex mt-1'
                                               
                                            >
                                                <CalendarMonthIcon className='text-slate-300 text-[10px] mt-[1px] mr-1' fontSize='inherit'/>
                                                <span className='provider-tabs-subtitle-weak'>{convertTimestamp(item.date)}</span>
                                            </div>
                                        
                                            <div>
                                                <ClinicalNoteDisplayTiptap
                                                    content={item.note}
                                                    editable={false}
                                                    onContentChange={(
                                                        dummy: string
                                                    ) => {}}
                                                />
                                            </div>
                                        </div>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>
        </>
    );
}
