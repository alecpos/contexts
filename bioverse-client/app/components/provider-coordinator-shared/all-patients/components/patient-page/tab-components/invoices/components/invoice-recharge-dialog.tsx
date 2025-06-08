import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    FormControlLabel,
    Checkbox,
    TextField,
    DialogActions,
    Button,
} from '@mui/material';
import { useState } from 'react';

interface RechargeConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason: string, amount: number) => void;
    total: number;
}

export default function RechargeConfirmationDialog({
    open,
    onClose,
    onConfirm,
    total,
}: RechargeConfirmationDialogProps) {
    const [amount, setAmount] = useState<number>(0);

    // State to hold the raw input value in cents
    const [inputValue, setInputValue] = useState('');
    // State to hold the formatted value in dollars
    const [formattedValue, setFormattedValue] = useState('');
    // State to hold the reason for recharge
    const [reason, setReason] = useState<string>('');

    const [usingCustomValue, setUsingCustomValue] = useState<boolean>(false);

    const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;

        setReason(value);
    };

    // Function to handle input changes
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        // Remove any non-numeric characters
        value = value.replace(/[^0-9.]/g, '');
        // Check if the input value is empty after removing non-numeric characters
        if (value === '') {
            // Set both inputValue and formattedValue to represent 0
            setInputValue('0');
            setFormattedValue('0.00');
            return; // Exit the function early since we've handled the empty case
        }
        // Check if the current value is '0' and the new input is not '0'
        if (inputValue === '0' && value !== '0') {
            // Remove the initial '0'
            value = value.replace(/^0+/, '');
        }
        // Check for more than two decimal points and truncate if necessary
        const decimalParts = value.split('.');
        if (decimalParts.length > 2) {
            // If there are more than two decimal points, remove the extra ones
            value = decimalParts.slice(0, 2).join('.');
        } else if (decimalParts.length === 2 && decimalParts[1].length > 2) {
            // If there are exactly two decimal points but the second part has more than two digits, truncate it
            value = decimalParts[0] + '.' + decimalParts[1].slice(0, 2);
        }
        // Convert the value to a number and truncate to two decimal places
        let numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
            // Check if the numericValue exceeds the total (converted to dollars)
            if (numericValue > total / 100) {
                // If it exceeds, set numericValue to total (converted to dollars)
                numericValue = total / 100;
                // Update the input value to reflect the total (in dollars)
                value = numericValue.toString();
            }
            // Multiply by 100, floor to remove any fractional part, then divide by 100
            const truncated = Math.floor(numericValue * 100) / 100;
            // Format the value as a dollar amount
            const formatted = `${truncated.toFixed(2)}`;
            setInputValue(value);
            setFormattedValue(formatted);
        }
    };

    const handleDeny = () => {
        onClose();
        // Additional actions on deny
    };

    const setValueAsTotal = () => {
        setInputValue(String(total / 100));
        setFormattedValue(String(total / 100));
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle id='alert-dialog-title'>Confirm Recharge</DialogTitle>
            <DialogContent>
                <div className='flex flex-col gap-2 p-2'>
                    <div>
                        <DialogContentText id='alert-dialog-description'>
                            How much to recharge patient?
                        </DialogContentText>
                    </div>
                    <div className='flex flex-col'>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={
                                        !usingCustomValue &&
                                        Number(inputValue) === total / 100
                                    }
                                    onClick={() => {
                                        setUsingCustomValue(false);
                                        setValueAsTotal();
                                    }}
                                />
                            }
                            label={`Entire sum: ${total / 100}`}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={usingCustomValue}
                                    onClick={() => {
                                        setUsingCustomValue(true);
                                        setInputValue('0');
                                        setFormattedValue('0');
                                    }}
                                />
                            }
                            label={`Custom amount`}
                        />
                    </div>
                    {usingCustomValue && (
                        <div>
                            <TextField
                                label='Amount'
                                value={inputValue}
                                onChange={handleInputChange}
                                type='number'
                                InputProps={{
                                    inputProps: {
                                        min: 0,
                                        step: 1,
                                    },
                                }}
                            />
                        </div>
                    )}
                    <div>
                        {/* 
                        Exists as code to test and visuallize input value - the dollar value unrounded to tens place.
                        <BioType className='body1'>
                            Input Value: {inputValue}
                        </BioType> */}
                        <BioType className='body1'>
                            Amount to Recharge: {formattedValue}
                        </BioType>
                        <BioType className='body1'>
                            Total Remaining:{' '}
                            {(total / 100 - Number(formattedValue)).toFixed(2)}
                        </BioType>
                    </div>
                    <div>
                        <TextField
                            fullWidth
                            value={reason}
                            type='text'
                            label={'Reason'}
                            onChange={handleReasonChange}
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions sx={{ padding: '1rem' }}>
                <Button onClick={handleDeny} variant='outlined' color='error'>
                    NEVERMIND
                </Button>
                <Button
                    onClick={() =>
                        onConfirm(reason, Number(formattedValue) * 100)
                    }
                    autoFocus
                    variant='outlined'
                    color='primary'
                >
                    Confirm Recharge
                </Button>
            </DialogActions>
        </Dialog>
    );
}
