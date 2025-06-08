"use client";

import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Tab,
    Tabs,
    TextField,
    Button
} from '@mui/material';

import { useState } from 'react';


interface BMIEditModalProps {
    open: boolean;
    onClose: () => void;
    setNoteValue: (note: string) => void;
    updateBMIRecord: () => void;
    noteValueObject: any

}


export default function BMIEditModal({
    open,
    onClose,
    setNoteValue,
    updateBMIRecord,
    noteValueObject
}: BMIEditModalProps) {

    const [heightFeet, setHeightFeet] = useState<string>(noteValueObject.heightF.toString());
    const [heightInches, setHeightInches] = useState<string>(noteValueObject.heightI.toString());
    const [weight, setWeight] = useState<string>(noteValueObject.weight.toString());

    const handleSubmit = () => {

        if (heightFeet === '' || heightInches === '' || weight === '') {
            return;
        }
        //turn the height, weight into a BMI string
        const heightText = "Height: " + heightFeet + ' ft ' + heightInches;
        const weightText = ", Weight: " + weight;
        const bmiText = ", BMI: " + (parseFloat(weight) / (parseFloat(heightFeet) * 12 + parseFloat(heightInches)) ** 2 * 703).toFixed(2);

        setNoteValue(heightText + weightText + bmiText);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose}  >
            <DialogTitle>
                <div className='flex items-center justify-between w-full mt-2'>
                    <span className='provider-intake-tab-title ml-4'>Edit patient height and/or weight</span>
                </div>
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} className='p-2 inter-basic w-[384px] mx-2 '>

                    <div className='flex items-center justify-between gap-4'>
                    <TextField
                        label="Height (Feet)"
                        value={heightFeet}
                        inputProps={{ maxLength: 1, pattern: "[0-9]"}}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px', 
                            },
                            '& .MuiInputBase-input': { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
                            '& .MuiInputLabel-root': { fontFamily: 'Inter, sans-serif' , fontSize: '14px' },
                   
                        }}
                        fullWidth
                        className='rounded-lg'
                        onChange={(e) => setHeightFeet(e.target.value)}
                       
                    />
                    <TextField
                        label="Height (Inches)"
                        value={heightInches}
                        inputProps={{ maxLength: 2, pattern: "[0-9]{1,2}" }}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px', 
                            },
                            '& .MuiInputBase-input': { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
                            '& .MuiInputLabel-root': { fontFamily: 'Inter, sans-serif' , fontSize: '14px' },
                        }}
                        fullWidth
                        onChange={(e) => setHeightInches(e.target.value)}
                    />
                    </div>
                    <TextField
                        label="Weight (lbs)"
                        value={weight}
                        className='inter-basic'
                        variant="outlined"
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px', 
                            },
                            '& .MuiInputBase-input': { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
                            '& .MuiInputLabel-root': { fontFamily: 'Inter, sans-serif' , fontSize: '14px' },
                        }}
                        onChange={(e) => setWeight(e.target.value)}
                    />

                    <div className='flex justify-center gap-[16px] mt-1'>
                        <Button
                            variant='contained'
                            size='large'
                            onClick={onClose}
                            className='bg-black hover:bg-slate-900'
                            sx={{ 
                                borderRadius: '12px', 
                                backgroundColor: 'white',
                                paddingX: '32px',
                                paddingY: '14px',
                                ":hover": {
                                    backgroundColor: 'white',
                                    boxShadow: 'none'

                                },
                                boxShadow: 'none'
                            }}
                        >
                            <span className='normal-case provider-bottom-button-text  text-weak'>Cancel</span>
                        </Button>
                        <Button
                            variant='contained'
                            size='large'
                            onClick={handleSubmit}
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
                            <span className='normal-case provider-bottom-button-text  text-white'>Confirm</span>
                        </Button>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    )

}
