import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import { useState } from 'react';

interface B12ModalProps {
    open: boolean;
    onClose: () => void;
    onConfirmExtraInformation: (type: string) => void;
}

export default function B12Modal({
    open,
    onClose,
    onConfirmExtraInformation,
}: B12ModalProps) {
    const [syringeType, setSyringeType] = useState<string>();
    const handleSyringeSelection = (type: string) => {
        setSyringeType(type);
    };

    const shouldCloseCheck = () => {
        return;
    };

    const handleSave = () => {
        if (!syringeType) {
            return;
        }
        onConfirmExtraInformation(syringeType);
        onClose();
    };

    return (
        <Dialog open={open} onClose={shouldCloseCheck}>
            <DialogTitle>
                <BioType className='h6 font-twcsemimedium'>
                    Finish B12 Item Selection
                </BioType>
            </DialogTitle>
            <DialogContent>
                <div className='flex flex-col gap-4'>
                    <BioType className='body1'>
                        Select Syringe/Needle type
                    </BioType>
                    <div className='flex flex-row gap-2'>
                        <Button
                            variant='outlined'
                            onClick={() => {
                                handleSyringeSelection('standard');
                            }}
                            sx={{
                                backgroundColor:
                                    syringeType === 'standard'
                                        ? 'rgba(40, 106, 162, 0.1)'
                                        : syringeType === 'female'
                                        ? '#FFFFFF'
                                        : 'white',
                                borderColor:
                                    syringeType === 'standard'
                                        ? 'rgba(40, 106, 162, 1)'
                                        : '#BDBDBD',
                                color:
                                    syringeType === 'standard'
                                        ? 'primary'
                                        : '#C0C0C0',
                            }}
                        >
                            Regular Needle
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={() => {
                                handleSyringeSelection('female');
                            }}
                            sx={{
                                backgroundColor:
                                    syringeType === 'female'
                                        ? 'rgba(40, 106, 162, 0.1)'
                                        : syringeType === 'standard'
                                        ? '#FFFFFF'
                                        : 'white',
                                borderColor:
                                    syringeType === 'female'
                                        ? 'rgba(40, 106, 162, 1)'
                                        : '#BDBDBD',
                                color:
                                    syringeType === 'female'
                                        ? 'primary'
                                        : '#C0C0C0',
                            }}
                        >
                            Female Needle (Thin)
                        </Button>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' onClick={handleSave}>
                    SAVE
                </Button>
            </DialogActions>
        </Dialog>
    );
}
