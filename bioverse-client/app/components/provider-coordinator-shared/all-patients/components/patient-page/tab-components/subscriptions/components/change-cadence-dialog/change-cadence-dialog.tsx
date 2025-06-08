'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { changeSubscriptionRenewalDate } from '@/app/services/stripe/subscriptions';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    DialogActions,
    Button,
    CircularProgress,
    Checkbox,
    Tooltip,
} from '@mui/material';
import { useState, useEffect } from 'react';

interface SubscriptionChangeDialogProps {
    stripe_data: any;
    open: boolean;
    subscription_data: SubscriptionTableItem;
    onClose: () => void;
    onSuccess: () => void;
    onFailure: () => void;
}

export default function SubscriptionChangeDialog({
    open,
    onClose,
    subscription_data,
    stripe_data,
    onSuccess,
    onFailure,
}: SubscriptionChangeDialogProps) {
    const [timeToAdd, setTimeToAdd] = useState<number>(604800);
    const [customTimeValue, setCustomTimeValue] = useState<number>();
    const [usingCustom, setUsingCustom] = useState<boolean>(false);
    const [isValidChange, setIsValidChange] = useState<boolean>(true);

    const [isChangingRenewalDate, setIsChangingRenewalDate] =
        useState<boolean>(false);

    const handleDeny = () => {
        onClose();
    };

    useEffect(() => {
        if (usingCustom && customTimeValue) {
            setTimeToAdd(customTimeValue * 24 * 60 * 60);
        }
    }, [customTimeValue, usingCustom]);

    function convertEpochToReadableTimestamp(epoch: number): string {
        const date = new Date(epoch * 1000); // Convert epoch to milliseconds
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };

        if (
            convertDateToEpochTimestamp(date) <
            convertDateToEpochTimestamp(new Date())
        ) {
            setIsValidChange(false);
            return 'Invalid Date: Renewal Date cannot be in the past';
        }

        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    function convertDateToEpochTimestamp(date: Date): number {
        return Math.floor(date.getTime() / 1000);
    }

    const changeRenewalDate = async () => {
        setIsChangingRenewalDate(true);

        const result = await changeSubscriptionRenewalDate(
            parseInt(subscription_data.id),
            stripe_data.id,
            stripe_data.current_period_end + timeToAdd,
            timeToAdd < 0 ? -1 : 1
        );

        if (result === 'success') {
            onSuccess();
            setIsChangingRenewalDate(false);
            onClose();
        } else {
            onFailure();
            setIsChangingRenewalDate(false);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>
                    Change Subscription Renewal Date
                </DialogTitle>
                <DialogContent>
                    <div className='body1 p-2 flex flex-col justify-center items-center'>
                        <DialogContentText id='alert-dialog-description'>
                            <BioType className='body1'>
                                Current renewal date:{' '}
                                {stripe_data &&
                                    stripe_data.current_period_end &&
                                    convertEpochToReadableTimestamp(
                                        stripe_data.current_period_end
                                    )}
                            </BioType>
                            <FormControl>
                                <FormLabel id='demo-radio-buttons-group-label'>
                                    By how many days would you like to modify
                                    the subscription?
                                </FormLabel>
                                <RadioGroup
                                    aria-labelledby='demo-radio-buttons-group-label'
                                    defaultValue={604800}
                                    name='radio-buttons-group'
                                    onChange={(event) => {
                                        if (event.target.value === 'custom') {
                                            setUsingCustom(true);

                                            return;
                                        } else {
                                            setUsingCustom(false);
                                        }
                                        setTimeToAdd(
                                            parseInt(event.target.value, 10)
                                        );
                                    }}
                                >
                                    <FormControlLabel
                                        value={-604800}
                                        control={<Radio />}
                                        label='-7 days'
                                    />
                                    <FormControlLabel
                                        value={604800}
                                        control={<Radio />}
                                        label='+7 days'
                                    />
                                    <FormControlLabel
                                        value={1209600}
                                        control={<Radio />}
                                        label='+14 days'
                                    />
                                    <FormControlLabel
                                        value={1814400}
                                        control={<Radio />}
                                        label='+21 days'
                                    />
                                    <FormControlLabel
                                        value={'custom'}
                                        id='custom'
                                        control={<Radio />}
                                        label={
                                            <>
                                                {usingCustom ? (
                                                    <div className='flex flex-row gap-1 items-start'>
                                                        <TextField
                                                            label={'Days'}
                                                            autoComplete='off'
                                                            value={
                                                                customTimeValue
                                                            }
                                                            onKeyDown={(e) => {
                                                                // Handle the minus key press
                                                                if (
                                                                    e.key ===
                                                                    '-'
                                                                ) {
                                                                    e.preventDefault(); // Prevent the default minus sign input
                                                                    if (
                                                                        customTimeValue &&
                                                                        customTimeValue <=
                                                                            70 &&
                                                                        customTimeValue >
                                                                            0
                                                                    ) {
                                                                        setCustomTimeValue(
                                                                            -customTimeValue
                                                                        );
                                                                    }
                                                                }

                                                                // Handle backspace when there's only one digit left in a negative number
                                                                if (
                                                                    e.key ===
                                                                        'Backspace' &&
                                                                    customTimeValue &&
                                                                    customTimeValue <
                                                                        0
                                                                ) {
                                                                    const absValue =
                                                                        Math.abs(
                                                                            customTimeValue
                                                                        );
                                                                    if (
                                                                        absValue <
                                                                        10
                                                                    ) {
                                                                        e.preventDefault();
                                                                        setCustomTimeValue(
                                                                            0
                                                                        );
                                                                    }
                                                                }
                                                            }}
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                const inputValue =
                                                                    event.target
                                                                        .value;

                                                                // Handle empty input
                                                                if (
                                                                    inputValue ===
                                                                    ''
                                                                ) {
                                                                    setCustomTimeValue(
                                                                        0
                                                                    );
                                                                    return;
                                                                }

                                                                // Parse the value
                                                                const parsedValue =
                                                                    parseInt(
                                                                        inputValue,
                                                                        10
                                                                    );

                                                                // If it's not a valid number, return
                                                                if (
                                                                    isNaN(
                                                                        parsedValue
                                                                    )
                                                                ) {
                                                                    return;
                                                                }

                                                                // Check if the absolute value is greater than 90
                                                                if (
                                                                    Math.abs(
                                                                        parsedValue
                                                                    ) > 90
                                                                ) {
                                                                    // Maintain the sign but cap at 90
                                                                    setCustomTimeValue(
                                                                        parsedValue >
                                                                            0
                                                                            ? 90
                                                                            : -70
                                                                    );
                                                                } else {
                                                                    setCustomTimeValue(
                                                                        parsedValue
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <Tooltip
                                                            title={
                                                                'For negative values press "-" after writing a number'
                                                            }
                                                        >
                                                            <HelpOutlineIcon fontSize='small' />
                                                        </Tooltip>
                                                    </div>
                                                ) : (
                                                    'Custom'
                                                )}
                                            </>
                                        }
                                    />
                                </RadioGroup>
                            </FormControl>
                            <BioType>
                                New renewal date:{' '}
                                {stripe_data &&
                                    stripe_data.current_period_end &&
                                    convertEpochToReadableTimestamp(
                                        stripe_data.current_period_end +
                                            timeToAdd
                                    )}
                            </BioType>
                        </DialogContentText>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDeny}
                        variant='outlined'
                        color='error'
                    >
                        nevermind
                    </Button>
                    {!isChangingRenewalDate ? (
                        <Button
                            disabled={!isValidChange}
                            onClick={() => changeRenewalDate()}
                            autoFocus
                            variant='outlined'
                            color='primary'
                            sx={{ width: '200px' }}
                        >
                            Confirm change
                        </Button>
                    ) : (
                        <Button
                            disabled
                            variant='contained'
                            sx={{ width: '200px' }}
                        >
                            <CircularProgress size={'22px'} />
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}
