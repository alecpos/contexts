import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import CloseIcon from '@mui/icons-material/Close';
import { Button, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export default function PaymentChangeDrawer({ setMenuOpen }: Props) {
    const [nameOnCard, setNameOnCard] = useState<string>('');
    const [cardNumber, setCardNumber] = useState<string>('');
    const [expDate, setExpDate] = useState<string>('');
    const [cvc, setCvc] = useState<number>();

    const handleInputChange =
        (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value;

            switch (fieldName) {
                case 'name_on_card':
                    setNameOnCard(value);
                    break;
                case 'card_number':
                    setCardNumber(value);
                    break;
                case 'exp_date':
                    setExpDate(value);
                    break;
                case 'cvc':
                    setCvc(parseInt(value) || undefined); // Parse to integer, but use undefined for non-numeric input
                    break;
                default:
                    break;
            }
        };

    const handleClose = () => {
        setMenuOpen((prev) => !prev);
    };

    const horizontal_divider_container_class = 'h-[1px] py-2';

    return (
        <>
            <div
                id='payment-change-main-container'
                className='flex flex-col w-[100vw] md:w-[40vw]'
            >
                <div
                    onClick={handleClose}
                    className='h-[50px] h7 flex flex-row justify-end items-center mr-4'
                >
                    <BioType className='rubik-large flex flex-row'>
                        CLOSE
                        <CloseIcon className='flex' />
                    </BioType>
                </div>

                <div className={horizontal_divider_container_class}>
                    <HorizontalDivider backgroundColor='#1B1B1B' height={1} />
                </div>

                <div className='mx-[5%] gap-4 flex flex-col'>
                    <BioType className='h5'>Update Payment Method</BioType>

                    <FormControl className='md:flex-grow'>
                        <InputLabel htmlFor='name_on_card'>
                            Name On Card
                        </InputLabel>
                        <OutlinedInput
                            id='name_on_card'
                            label='Name On Card'
                            value={nameOnCard}
                            onChange={handleInputChange('name_on_card')}
                        />
                    </FormControl>

                    <FormControl className='md:flex-grow'>
                        <InputLabel htmlFor='card_number'>
                            Card Number
                        </InputLabel>
                        <OutlinedInput
                            id='card_number'
                            label='Card Number'
                            value={cardNumber}
                            onChange={handleInputChange('card_number')}
                            type='number'
                        />
                    </FormControl>

                    <div className='flex flex-row gap-4'>
                        <FormControl className='md:flex-grow'>
                            <InputLabel htmlFor='exp_date'>
                                Expiration Date
                            </InputLabel>
                            <OutlinedInput
                                id='exp_date'
                                label='Expiration Date'
                                value={expDate}
                                onChange={handleInputChange('exp_date')}
                            />
                        </FormControl>

                        <FormControl className='md:flex-grow'>
                            <InputLabel htmlFor='cvc'>CVC</InputLabel>
                            <OutlinedInput
                                id='cvc'
                                label='CVC'
                                value={cvc || ''} // Handle undefined state
                                onChange={handleInputChange('cvc')}
                                type='number'
                            />
                        </FormControl>
                    </div>

                    <Button variant='contained'>SAVE</Button>

                    <Button onClick={handleClose} variant='outlined'>
                        CANCEL
                    </Button>
                </div>
            </div>
        </>
    );
}
