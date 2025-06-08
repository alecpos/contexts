'use client';

import { Button } from '@mui/material';
import { useState } from 'react';
import ClinicalNoteCreationModal from './note-creation-modal';
import React from 'react';

interface AddNoteButtonProps {
    patient_id: string;
    product_href: string;
    order_id: string | number;
    renewal_order_id?: string;
}

export default function AddClinicalNoteButton({
    patient_id,
    product_href,
    order_id,
    renewal_order_id,
}: AddNoteButtonProps) {
    const [createNoteModalOpen, setCreateNoteModalOpen] =
        useState<boolean>(false);

    const openCreateNoteModal = () => {
        setCreateNoteModalOpen(true);
    };

    const closeCreateNoteModal = () => {
        setCreateNoteModalOpen(false);
    };

    return (
        <>
            <Button
                variant='contained'
                size='large'
                onClick={openCreateNoteModal}
                className='bg-black hover:bg-slate-900'
                sx={{ 
                    borderRadius: '12px', 
                    backgroundColor: 'black',
                    paddingX: '32px',
                    paddingY: '14px',
                    ":hover": {
                        backgroundColor: 'darkslategray',
                    }
                }}
            >
                <span className='normal-case provider-bottom-button-text  text-white'>Add clinical note</span>
            </Button>
            <ClinicalNoteCreationModal
                open={createNoteModalOpen}
                onClose={closeCreateNoteModal}
                patient_id={patient_id}
                product_href={product_href}
                order_id={order_id}
                renewal_order_id={renewal_order_id}
            />
        </>
    );
}
