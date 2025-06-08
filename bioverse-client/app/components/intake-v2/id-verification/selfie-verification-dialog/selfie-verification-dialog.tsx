import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import CloseIcon from '@mui/icons-material/Close';

// Define the interface for the component's props
interface SelfieVerificationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    // You can add more props here as needed, such as title, content, etc.
}

// Define the component using the interface for its props
export default function SelfieVerificationDialog({
    isOpen,
    onClose,
}: SelfieVerificationDialogProps) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby='id-verification-dialog-title'
        >
            <DialogTitle id='id-verification-dialog-title'>
                <div
                    className='flex flex-row justify-end m-2 hover:cursor-pointer'
                    onClick={onClose}
                >
                    <CloseIcon sx={{ color: '#7f7f7f' }} />
                </div>
                <div className='flex flex-col gap-4'>
                    <BioType className='subtitle1 !text-primary'>
                        Why do you need my selfie?
                    </BioType>
                    <div className='w-full h-[1px]'>
                        <HorizontalDivider
                            backgroundColor={'#1b1b1b33'}
                            height={1}
                        />
                    </div>
                </div>
            </DialogTitle>
            <DialogContent>
                <div className='flex flex-col gap-4'>
                    <BioType className='body1 !text-[#1b1b1bde]'>
                        According to telemedicine laws, we&apos;re required to
                        verify everyone&apos;s identity before prescribing
                        medication. You cou can verify your identity by
                        uploading your photo ID and a selfie next.
                    </BioType>
                    <BioType className='subtitle2'>Who sees this?</BioType>
                    <BioType className='body1 !text-[#1b1b1bde]'>
                        Your selfie will be stored securely and will only be
                        shared with the patient support team and our identity
                        verification platform.
                    </BioType>
                </div>
            </DialogContent>
        </Dialog>
    );
}
