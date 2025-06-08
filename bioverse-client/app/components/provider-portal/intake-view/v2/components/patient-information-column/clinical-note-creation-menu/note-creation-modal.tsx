'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Tab,
    Tabs,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import ClinicalNoteCreationTab from './creation-tab-content/note-creation/note-creation';
import ClinicalTemplateCreationTab from './creation-tab-content/template-creation';
import React from 'react';
import { TEMPLATIZED_PRODUCT_LIST } from '@/app/utils/constants/clinical-note-template-product-map';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import BMIClinicalNoteCreationTab from './creation-tab-content/bmi-creation';

interface NoteCreationModalProps {
    open: boolean;
    onClose: () => void;
    patient_id: string;
    product_href: string;
    order_id: string | number;
    renewal_order_id?: string;
}

export default function ClinicalNoteCreationModal({
    open,
    onClose,
    patient_id,
    product_href,
    order_id,
    renewal_order_id,
}: NoteCreationModalProps) {
    //Uses index values to create the new tab.
    const [currentTab, setCurrentTab] = useState<number>(0);

    const renderTabContent = () => {
        switch (currentTab) {
            case 0:
                return (
                    <>
                        <ClinicalNoteCreationTab
                            patient_id={patient_id}
                            product_href={product_href}
                            onClose={onClose}
                        />
                    </>
                );
            case 1:
                return (
                    <>
                        <ClinicalTemplateCreationTab
                            patient_id={patient_id}
                            product_href={product_href}
                            onClose={onClose}
                            order_id={order_id}
                            renewal_order_id={renewal_order_id}
                        />
                    </>
                );
            case 2:
                return (
                    <>
                        <BMIClinicalNoteCreationTab
                            patient_id={patient_id}
                            onClose={onClose}
                        />
                    </>
                );
            default:
                return (
                    <BioType className='itd-subtitle'>
                        There was an issue with the application. Please refresh
                        the page
                    </BioType>
                );
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ backgroundColor: '#FAFAFA' }}>
                    <div className='flex flex-row justify-between'>
                        <BioType className='provider-intake-tab-title-secondary'>
                            Add Clinical Note
                        </BioType>
                        <div onClick={onClose} className='hover:cursor-pointer'>
                            <CloseIcon />
                        </div>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={currentTab}
                            onChange={(e, index) => {
                                setCurrentTab(index);
                            }}
                        >
                            <Tab
                                label={
                                    <span className='provider-dropdown-title normal-case'>
                                        Note
                                    </span>
                                }
                                value={0}
                            />
                            {TEMPLATIZED_PRODUCT_LIST.includes(
                                product_href as PRODUCT_HREF
                            ) && (
                                <Tab
                                    label={
                                        <span className='provider-dropdown-title normal-case'>
                                            Template
                                        </span>
                                    }
                                    value={1}
                                />
                            )}
                            <Tab
                                label={
                                    <span className='provider-dropdown-title normal-case'>
                                        BMI
                                    </span>
                                }
                                value={2}
                            />
                        </Tabs>
                    </Box>
                    <div>{renderTabContent()}</div>
                </DialogContent>
            </Dialog>
        </>
    );
}
