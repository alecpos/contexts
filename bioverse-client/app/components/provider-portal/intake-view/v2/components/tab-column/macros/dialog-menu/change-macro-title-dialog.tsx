'use client';

import { Status } from '@/app/types/global/global-enumerators';
import { updateMacroTitle } from '@/app/utils/database/controller/macros/macros-api';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';

interface MacroTitleChangeMenuProps {
    open: boolean;
    onClose: () => void;
    macroTitle: string;
    macroId: string | number;
    mutateMacroList: KeyedMutator<{
        macros: MacrosSBR[];
        categories: any[];
    } | null>;
}

export default function MacroTitleChangeDialog({
    open,
    onClose,
    macroTitle,
    macroId,
    mutateMacroList,
}: MacroTitleChangeMenuProps) {
    const [macroTitleInputValue, setMacroTitleInputValue] =
        useState<string>(macroTitle);
    const [macroIdValue, setMacroIdValue] = useState<string | number>(macroId);
    const [isChangingTitle, setIsChangingTitle] = useState<boolean>(false);

    useEffect(() => {
        setMacroTitleInputValue(macroTitle);
        setMacroIdValue(macroId);
    }, [macroTitle, macroId]);

    const changeMacroTitle = async () => {
        setIsChangingTitle(true);

        const result = await updateMacroTitle(
            macroIdValue,
            macroTitleInputValue
        );

        setIsChangingTitle(false);
        if (result === Status.Success) {
            mutateMacroList;
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} style={{ width: '100%' }}>
            <DialogTitle>{'Change Macro Title'}</DialogTitle>
            <DialogContent style={{ width: '500px' }}>
                <TextField
                    label='Macro Title'
                    value={macroTitleInputValue}
                    onChange={(e) => setMacroTitleInputValue(e.target.value)}
                    fullWidth
                    margin='normal' // Adjust the margin
                    InputLabelProps={{
                        style: { top: '0' }, // Adjust the label position if needed
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color='error' variant='outlined'>
                    Cancel
                </Button>
                <Button onClick={changeMacroTitle} variant='contained'>
                    {isChangingTitle ? (
                        <CircularProgress
                            size={20}
                            style={{ color: 'white' }}
                        />
                    ) : (
                        'Save'
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
