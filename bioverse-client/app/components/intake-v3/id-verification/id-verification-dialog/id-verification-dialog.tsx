import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import CloseIcon from '@mui/icons-material/Close';

// Define the interface for the component's props
interface IDVerificationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    // You can add more props here as needed, such as title, content, etc.
}

// Define the component using the interface for its props
export default function IDVerificationDialog({
    isOpen,
    onClose,
}: IDVerificationDialogProps) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby='id-verification-dialog-title'
            sx={{
                borderRadius: '20px',

            }}
            className='rounded-lg mx-auto p-1 w-full'
            style={{ maxWidth: '550px' }} 
     
        >

            <div className='flex flex-col gap-4 p-6'>
                <div className='flex flex-row justify-between '>
            
                    <BioType className='inter-h5-constant text-[22px] mt-0.5'>
                        Why do you need a photo of my ID?
                    </BioType>
                <div
                        className='flex flex-row justify-end m-2 hover:cursor-pointer'
                        onClick={onClose}
                    >
                    <CloseIcon sx={{ color: '#7f7f7f' }} fontSize='small' />
             </div>
            
            </div>
                <BioType className='inter-tight text-weak text-[16px]'>
                    According to telemedicine laws, we&apos;re required to
                    verify everyone&apos;s identity before prescribing
                    medication. You cou can verify your identity by
                    uploading your photo ID and a selfie next.
                </BioType>
                <BioType className='inter-tight-bold text-[16px]'>Who sees this?</BioType>
                <BioType className='inter-tight text-weak text-[16px]'>
                    Your photo ID will be stored securely and will only be
                    shared with the patient support team and our identity
                    verification platform.
                </BioType>
            </div>
      
        </Dialog>
    );
}
