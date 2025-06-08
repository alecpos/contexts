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

export default function TMCPatientInputFields({
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
                aria-controls='patient-input-fields-content'
                id='patient-input-fields-header'
            >
                <BioType className='h6'>Patient Information</BioType>
            </AccordionSummary>
            <div
                id='patient-input-fields-content'
                aria-labelledby='patient-input-fields-header'
                className='flex flex-col px-8 py-2'
            >
                <BioType className='label1 text-red-900'>
                    Please do not edit patient information fields unless advised
                </BioType>
                <FormControl fullWidth margin='normal'>
                    <TextField
                        id='patient_first_name'
                        name='patient.first_name'
                        label='First Name'
                        variant='outlined'
                        value={
                            prescriptionForm.prescriptions[0].patient.first_name
                        }
                        onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                    <TextField
                        id='patient_last_name'
                        name='patient.last_name'
                        label='Last Name'
                        variant='outlined'
                        value={
                            prescriptionForm.prescriptions[0].patient.last_name
                        }
                        onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                    <TextField
                        id='patient_dob'
                        name='patient.dob'
                        label='Date of Birth'
                        variant='outlined'
                        value={prescriptionForm.prescriptions[0].patient.dob}
                        onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                    <TextField
                        id='patient_email'
                        name='patient.email'
                        label='Email'
                        variant='outlined'
                        value={prescriptionForm.prescriptions[0].patient.email}
                        onChange={handleInputChange}
                    />
                </FormControl>
                <FormControl fullWidth margin='normal'>
                    <TextField
                        id='patient_phone'
                        name='patient.phone'
                        label='Phone Number'
                        variant='outlined'
                        value={prescriptionForm.prescriptions[0].patient.phone}
                        onChange={handleInputChange}
                    />
                </FormControl>
                {/* <FormControl fullWidth margin='normal'>
          <TextField
            id='patient_ssn'
            name='patient.ssn'
            label='Social Security Number'
            variant='outlined'
            value={prescriptionForm.prescriptions[0].patient.ssn || ''}
            onChange={handleInputChange}
          />
        </FormControl> */}
                <FormControl fullWidth margin='normal'>
                    <InputLabel id='patient_gender'>Sex At Birth</InputLabel>
                    <Select
                        labelId='patient_gender'
                        id='patient_gender'
                        name='patient.gender'
                        label='Sex At Birth'
                        value={prescriptionForm.prescriptions[0].patient.gender}
                        onChange={handleSelectChange}
                    >
                        <MenuItem value='Male'>Male</MenuItem>
                        <MenuItem value='Female'>Female</MenuItem>
                        <MenuItem value='NA'>NA</MenuItem>
                        <MenuItem value='Other'>Other</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin='normal'>
                    <TextField
                        id='patient_allergies'
                        name='patient.allergies'
                        label='Allergies'
                        variant='outlined'
                        value={
                            prescriptionForm.prescriptions[0].patient.allergies
                        }
                        onChange={handleInputChange}
                    />
                </FormControl>
            </div>
        </Accordion>
    );
}
