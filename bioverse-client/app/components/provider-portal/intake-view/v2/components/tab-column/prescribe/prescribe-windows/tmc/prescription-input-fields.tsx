import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useState,
} from 'react';
import { TMCMedicationList } from './utils/tmc-medication-ids';

interface Props {
    prescriptionForm: TMCPrescriptionForm;
    selectedItem: string;
    setSelectedItem: (event: SelectChangeEvent) => void;
    handleNestedInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
    handleNestedSelectChange: (event: SelectChangeEvent) => void;
    addSecondaryItem: () => void;
    setPrescriptionForm: Dispatch<SetStateAction<TMCPrescriptionForm>>;
}

export default function TMCPrescriptionInputFields({
    prescriptionForm,
    handleInputChange,
    handleNestedSelectChange,
    handleNestedInputChange,
    addSecondaryItem,
    setPrescriptionForm,
    selectedItem,
    setSelectedItem,
}: Props) {
    const [orderHasSecondItem, setOrderHasSecondItem] = useState<boolean>(
        prescriptionForm.prescriptions[0].prescription_items.length > 1
    );

    useEffect(() => {
        setOrderHasSecondItem(
            prescriptionForm.prescriptions[0].prescription_items.length > 1
        );
    }, [prescriptionForm]);

    const copySigneteur = () => {
        // Create a deep copy of the current prescriptionForm state
        const updatedPrescriptionForm = JSON.parse(
            JSON.stringify(prescriptionForm)
        );

        // Update the Sig of the second item to match the first item
        if (
            updatedPrescriptionForm.prescriptions[0].prescription_items.length >
            1
        ) {
            updatedPrescriptionForm.prescriptions[0].prescription_items[1].Sig =
                updatedPrescriptionForm.prescriptions[0].prescription_items[0].Sig;
        }

        // Update the state with the new object
        setPrescriptionForm(updatedPrescriptionForm);
    };
    return (
        <div className='flex flex-col px-8 py-2'>
            {/**
             * @Author Nathan Cho
             * Commented as the NPI number will now load Dr. Echeverry's NPI automatically.
             */}
            {/* <FormControl fullWidth margin='normal'>
                <TextField
                    id='physician_npi'
                    name='physician_npi'
                    label='Physician NPI'
                    variant='outlined'
                    value={prescriptionForm.prescriptions[0].physician_npi}
                    onChange={handleInputChange}
                />
            </FormControl> */}
            <FormControl fullWidth margin='normal'>
                <InputLabel id='medication'>Medication</InputLabel>
                <Select
                    id='prescription_item_id'
                    name='prescription_items[0].Id'
                    label='Medication'
                    variant='outlined'
                    value={
                        prescriptionForm.prescriptions[0].prescription_items[0]
                            .Id
                    }
                    onChange={setSelectedItem}
                >
                    {TMCMedicationList.map((medication) => (
                        <MenuItem key={medication.id} value={medication.id}>
                            {`${medication.name} ${medication.strength} ${medication.size}`}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/**
             * @author Nathan Cho
             * Removed the button to add secondary item since we don't give the option to do that to the providers anymore.
             */}
            {/* {!orderHasSecondItem ? (
                // <div className='flex p-2'>
                //     <Button variant='outlined' onClick={addSecondaryItem}>
                //         Add Second Item
                //     </Button>
                // </div>
                <></>
            ) : (
                <>
                    <FormControl fullWidth margin='normal'>
                        <InputLabel id='secondary_item'>
                            Secondary Item
                        </InputLabel>
                        <Select
                            id='prescription_item_id'
                            name='prescription_items[1].Id'
                            label='Secondary Item'
                            variant='outlined'
                            disabled
                            value={
                                prescriptionForm.prescriptions[0]
                                    .prescription_items[1]
                                    ? prescriptionForm.prescriptions[0]
                                          .prescription_items[1].Id
                                    : ''
                            }
                            onChange={handleNestedSelectChange}
                        >
                            {TMCSecondaryItemList.map((product) => (
                                <MenuItem key={product.id} value={product.id}>
                                    {`${product.name}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </>
            )} */}

            <FormControl fullWidth margin='normal'>
                <TextField
                    id='patient_allergies'
                    name='patient.allergies'
                    label='Patient Allergies'
                    variant='outlined'
                    value={prescriptionForm.prescriptions[0].patient.allergies}
                    onChange={handleInputChange}
                />
            </FormControl>
            {/* <FormControl fullWidth margin='normal'>
                <TextField
                    id='prescription_quantity'
                    name='prescription_items[0].Quantity'
                    label='Quantity of Medication'
                    variant='outlined'
                    disabled
                    type='number'
                    value={
                        prescriptionForm.prescriptions[0].prescription_items[0]
                            .Quantity
                    }
                    onChange={handleNestedInputChange}
                />
            </FormControl> */}
            {/* {orderHasSecondItem && (
                <FormControl fullWidth margin='normal'>
                    <TextField
                        id='prescription_quantity'
                        name='prescription_items[1].Quantity'
                        label='Quantity of Secondary Item'
                        variant='outlined'
                        disabled
                        type='number'
                        value={
                            prescriptionForm.prescriptions[0]
                                .prescription_items[1]
                                ? prescriptionForm.prescriptions[0]
                                      .prescription_items[1].Quantity
                                : '0'
                        }
                        onChange={handleNestedInputChange}
                    />
                </FormControl>
            )} */}
            {/* <FormControl fullWidth margin="normal">
                <TextField
                    id="original_refills"
                    name="prescription_items[0].NoOfOriginalRefills"
                    label="Number of Refills"
                    variant="outlined"
                    type="number"
                    value={
                        prescriptionForm.prescriptions[0].prescription_items[0]
                            .NoOfOriginalRefills
                    }
                    onChange={handleNestedInputChange}
                />
            </FormControl> */}
            {/* <FormControl fullWidth margin="normal">
                <TextField
                    id="remaining_refills"
                    name="prescription_items[0].NoOfRefillRemaining"
                    label="Refills Remaining"
                    variant="outlined"
                    type="number"
                    value={
                        prescriptionForm.prescriptions[0].prescription_items[0]
                            .NoOfRefillRemaining
                    }
                    onChange={handleNestedInputChange}
                />
            </FormControl> */}
            {/* <FormControl fullWidth margin='normal'>
                <TextField
                    id='sig'
                    name='prescription_items[0].Sig'
                    label='Sig'
                    multiline
                    variant='outlined'
                    disabled
                    value={
                        prescriptionForm.prescriptions[0].prescription_items[0]
                            .Sig
                    }
                    onChange={handleNestedInputChange}
                />
            </FormControl> */}

            {/**
             * @Author Nathan Cho
             * Commented due to change in interface - we do not allow the provider to modify the sig at all anymore.
             */}
            {/* {orderHasSecondItem && (
                <div className='flex flex-row gap-2 items-center'>
                    <div className='h-[50%] flex justify-center items-center'>
                        <Button variant='contained' onClick={copySigneteur}>
                            Copy
                        </Button>
                    </div>

                    <FormControl fullWidth margin='normal'>
                        <TextField
                            id='sig'
                            name='prescription_items[1].Sig'
                            label='Signeteur on Secondary Item'
                            variant='outlined'
                            value={
                                prescriptionForm.prescriptions[0]
                                    .prescription_items[1].Sig
                            }
                            onChange={handleNestedInputChange}
                        />
                    </FormControl>
                </div>
            )} */}
        </div>
    );
}
