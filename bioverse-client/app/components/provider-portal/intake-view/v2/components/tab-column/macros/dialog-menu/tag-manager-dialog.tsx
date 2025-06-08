'use client';

import { Status } from '@/app/types/global/global-enumerators';
import {
    updateMacroTags,
    updateMacroTitle,
} from '@/app/utils/database/controller/macros/macros-api';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
    Chip,
    Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { KeyedMutator } from 'swr';
import CloseIcon from '@mui/icons-material/Close';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface MacroTitleChangeMenuProps {
    open: boolean;
    onClose: () => void;
    macroId: string | number;
    mutateMacroList: KeyedMutator<{
        macros: MacrosSBR[];
        categories: any[];
    } | null>;
    tags: string[];
}

export default function TagManagerDialog({
    open,
    onClose,
    macroId,
    tags,
    mutateMacroList,
}: MacroTitleChangeMenuProps) {
    const [macroIdValue, setMacroIdValue] = useState<string | number>(macroId);
    const [macroTags, setMacroTags] = useState<string[]>(tags);
    const [tagsToAdd, setTagsToAdd] = useState<string[]>([]);
    const [tagsToRemove, setTagsToRemove] = useState<string[]>([]);
    const [isChangingTitle, setIsChangingTitle] = useState<boolean>(false);

    const [newTagInputValue, setNewTagInputValue] = useState<string>('');

    useEffect(() => {
        setMacroIdValue(macroId);
        setMacroTags(tags);
    }, [macroId, tags]);

    const changeMacroTags = async () => {
        setIsChangingTitle(true);

        let resultTags = [...macroTags];

        resultTags = [...resultTags, ...tagsToAdd];

        // Remove tags that are in tagsToRemove
        resultTags = resultTags.filter((tag) => !tagsToRemove.includes(tag));

        const result = await updateMacroTags(macroId, resultTags);

        if (result === Status.Success) {
            mutateMacroList;
            onClose();
        }

        setTagsToAdd([]);
        setTagsToRemove([]);
        setMacroTags(resultTags);

        await mutateMacroList();
        setIsChangingTitle(false);
    };

    const handleAddNewMacro = () => {
        if (!tagsToAdd.includes(newTagInputValue)) {
            setTagsToAdd((prev) => {
                if (newTagInputValue.trim()) {
                    return [...prev, newTagInputValue];
                } else return [...prev];
            });
        }
    };

    const removeTagFromToAdd = (tag: string) => {
        setTagsToAdd((prev) => prev.filter((t) => t !== tag));
    };

    const removeTagFromToRemove = (tag: string) => {
        setTagsToRemove((prev) => prev.filter((t) => t !== tag));
    };

    const addToTagsToRemove = (tag: string) => {
        setTagsToRemove((prev) => [...prev, tag]);
    };

    return (
        <Dialog open={open} onClose={onClose} style={{ width: '100%' }}>
            <DialogTitle>{'Manage Tags for this Macro'}</DialogTitle>
            <DialogContent style={{ width: '500px' }}>
                <div className='flex flex-col gap-2'>
                    <div>
                        <BioType className='itd-body'>Add a new tag:</BioType>
                        <div className='flex flex-row items-center justify-center gap-2'>
                            <TextField
                                label='Macro Title'
                                value={newTagInputValue}
                                onChange={(e) =>
                                    setNewTagInputValue(e.target.value)
                                }
                                fullWidth
                                margin='normal' // Adjust the margin
                                InputLabelProps={{
                                    style: { top: '0' }, // Adjust the label position if needed
                                }}
                            />
                            <Button
                                variant='outlined'
                                style={{ height: 40, marginTop: 2 }}
                                onClick={handleAddNewMacro}
                            >
                                Add
                            </Button>
                        </div>
                    </div>

                    <BioType className='itd-body'>
                        Current searchable Tags:
                    </BioType>
                    <div className='flex flex-row gap-2 flex-wrap'>
                        {macroTags.map((tag, index) => {
                            if (tagsToRemove.includes(tag)) {
                                return null;
                            }

                            return (
                                <Chip
                                    key={index}
                                    label={
                                        <Tooltip title='Remove Tag'>
                                            <div
                                                className='flex flex-row justify-center items-center gap-2 hover:cursor-pointer'
                                                onClick={() => {
                                                    addToTagsToRemove(tag);
                                                }}
                                            >
                                                {tag}
                                                <CloseIcon
                                                    fontSize='small'
                                                    style={{ color: 'grey' }}
                                                />
                                            </div>
                                        </Tooltip>
                                    }
                                ></Chip>
                            );
                        })}
                        {tagsToAdd.map((tag, index) => {
                            return (
                                <Chip
                                    key={index}
                                    style={{ backgroundColor: '#abf7b1' }}
                                    label={
                                        <Tooltip title='Remove Tag'>
                                            <div
                                                className='flex flex-row justify-center items-center gap-2 hover:cursor-pointer'
                                                onClick={() => {
                                                    removeTagFromToAdd(tag);
                                                }}
                                            >
                                                {tag}
                                                <CloseIcon
                                                    fontSize='small'
                                                    style={{ color: 'grey' }}
                                                />
                                            </div>
                                        </Tooltip>
                                    }
                                />
                            );
                        })}
                    </div>

                    <div className='flex flex-col gap-1'>
                        <BioType className='itd-body text-red-400'>
                            Tags to be removed:
                        </BioType>
                        <div className='flex flex-row flex-wrap gap-2'>
                            {tagsToRemove.map((tag, index) => {
                                return (
                                    <Chip
                                        key={index}
                                        style={{ backgroundColor: '#f94449' }}
                                        label={
                                            <Tooltip title='Cancel Tag Removal'>
                                                <div
                                                    className='flex flex-row justify-center items-center gap-2 hover:cursor-pointer'
                                                    onClick={() => {
                                                        removeTagFromToRemove(
                                                            tag
                                                        );
                                                    }}
                                                >
                                                    {tag}
                                                    <CloseIcon
                                                        fontSize='small'
                                                        style={{
                                                            color: 'white',
                                                        }}
                                                    />
                                                </div>
                                            </Tooltip>
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color='error' variant='outlined'>
                    Cancel
                </Button>
                <Button onClick={changeMacroTags} variant='contained'>
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
