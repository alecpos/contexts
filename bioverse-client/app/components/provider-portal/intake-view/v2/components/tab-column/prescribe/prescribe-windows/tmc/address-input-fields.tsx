import {
    Accordion,
    AccordionSummary,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material';
import { ChangeEvent } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface Props {
    prescriptionForm: TMCPrescriptionForm;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleSelectChange: (event: SelectChangeEvent) => void;
}

export default function TMCAddressInputFields({
    prescriptionForm,
    handleInputChange,
    handleSelectChange,
}: Props) {
    return (
        <Accordion
            sx={{
                '& .MuiAccordionSummary-content': {
                    margin: 0, // Remove vertical margins
                },
                '& .MuiAccordionDetails-root': {
                    padding: 0, // Remove padding
                },
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='address-input-fields-content'
                id='address-input-fields-header'
            >
                <BioType className='h6'>Address Information</BioType>
            </AccordionSummary>
            <div
                id='address-input-fields-content'
                aria-labelledby='address-input-fields-header'
                className='flex flex-col px-8 py-2'
            >
                <BioType className='label1 text-red-900'>
                    Please do not edit patient address fields unless advised
                </BioType>
                <FormControl fullWidth margin='normal'>
                    <TextField
                        id='shipping_street'
                        name='shipping_address.shipping_street'
                        label='Address Line 1'
                        variant='outlined'
                        value={
                            prescriptionForm.prescriptions[0].shipping_address
                                .shipping_street
                        }
                        onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                    <TextField
                        id='shipping_address_line2'
                        name='shipping_address.shipping_address_line2'
                        label='Address Line  2'
                        variant='outlined'
                        value={
                            prescriptionForm.prescriptions[0].shipping_address
                                .shipping_address_line2 || ''
                        }
                        onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                    <TextField
                        id='shipping_city'
                        name='shipping_address.shipping_city'
                        label='City'
                        variant='outlined'
                        value={
                            prescriptionForm.prescriptions[0].shipping_address
                                .shipping_city
                        }
                        onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                    <TextField
                        id='shipping_state'
                        name='shipping_address.shipping_state'
                        label='State'
                        variant='outlined'
                        value={
                            prescriptionForm.prescriptions[0].shipping_address
                                .shipping_state
                        }
                        onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                    <TextField
                        id='shipping_postal_code'
                        name='shipping_address.shipping_postal_code'
                        label='Postal Code'
                        variant='outlined'
                        value={
                            prescriptionForm.prescriptions[0].shipping_address
                                .shipping_postal_code
                        }
                        onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                    <TextField
                        id='shipping_country'
                        name='shipping_address.shipping_country'
                        label='Country'
                        variant='outlined'
                        value={
                            prescriptionForm.prescriptions[0].shipping_address
                                .shipping_country
                        }
                        onChange={handleInputChange}
                    />
                </FormControl>
            </div>
        </Accordion>
    );
}
