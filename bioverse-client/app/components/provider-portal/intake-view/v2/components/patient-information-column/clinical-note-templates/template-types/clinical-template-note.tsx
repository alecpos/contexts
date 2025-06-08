'use client';

import { TextField } from '@mui/material';

interface MultiSelectRenderProps {
    editing: boolean;
    noteValue: string;
    setNoteValue: React.Dispatch<React.SetStateAction<string>>;
    setEditsMade: (value: boolean) => void;
}

export default function ClinicalTemplateNoteRender({
    editing,
    noteValue,
    setNoteValue,
    setEditsMade,
}: MultiSelectRenderProps) {
    return (
        <div className='flex flex-col gap-1 mt-4'>
            <TextField
                multiline
                fullWidth
                disabled={!editing}
                className='provider-clinical-notes-bmi-text'
                sx={{
                    '& .MuiInputBase-input': {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '15px',
                    },
                }}
                value={noteValue}
                onChange={(e) => {
                    setEditsMade(true);
                    setNoteValue(e.target.value);
                }}
            ></TextField>
        </div>
    );
}
