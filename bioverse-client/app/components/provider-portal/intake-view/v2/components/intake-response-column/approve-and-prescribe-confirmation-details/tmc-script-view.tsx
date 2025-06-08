import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    findMedicationById,
    findSecondaryItemById,
} from '../../tab-column/prescribe/prescribe-windows/tmc/utils/tmc-medication-ids';
import { SetStateAction, useEffect, useState } from 'react';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { Button } from '@mui/material';
import { USStates } from '@/app/types/enums/master-enums';

interface ConfirmationWindowProps {
    script: TMCPrescriptionForm;
    setScriptMetadata: (
        value: SetStateAction<
            | {
                  script: any;
                  sigList: string[] | null;
              }
            | undefined
        >,
    ) => void;
    product_href: string;
    orderData: DBOrderData;
}

export default function TmcConfirmationView({
    script,
    setScriptMetadata,
    product_href,
    orderData,
}: ConfirmationWindowProps) {
    const [syringeType, setSyringeType] = useState<string>('standard');

    const setB12QuantityAndSyringeType = (type: string) => {
        setSyringeType(type);
    };

    useEffect(() => {
        if (product_href === PRODUCT_HREF.B12_INJECTION) {
            const medication_object = findMedicationById('01t36000003zHJ1AAM');

            const itemId =
                syringeType === 'standard'
                    ? '01tDn0000002CERIA2'
                    : '01t36000005sZ6vAAE';

            const sig = medication_object!.sig;

            setScriptMetadata({
                script: addSecondaryItemWithSpecification(
                    script,
                    itemId,
                    (orderData.subscription_type === 'monthly' ? 1 : 3) * 10,
                    sig,
                ),
                sigList: [],
            });
        }
    }, [syringeType]);

    const addSecondaryItemWithSpecification = (
        prescriptionForm: TMCPrescriptionForm,
        id: string,
        quantity: number = 1,
        sig: string,
    ): TMCPrescriptionForm => {
        const updatedPrescriptionForm = JSON.parse(
            JSON.stringify(prescriptionForm),
        );
        // Check if there is an item at index [1] and remove it if it exists
        if (
            updatedPrescriptionForm.prescriptions[0].prescription_items.length >
            1
        ) {
            updatedPrescriptionForm.prescriptions[0].prescription_items.splice(
                1,
                1,
            );
        }

        // Add a new item to the prescription_items array of the first prescription
        updatedPrescriptionForm.prescriptions[0].prescription_items.push({
            Id: id,
            Quantity: String(quantity),
            NoOfOriginalRefills: '0',
            NoOfRefillRemaining: '0',
            Sig: sig,
        });

        return updatedPrescriptionForm;
    };

    if (orderData.state === USStates.NorthCarolina) {
        return (
            <BioType className="itd-body">
                We cannot ship TMC products to North Carolina. Please forward to
                coordinator.
            </BioType>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <BioType className="itd-body">
                Please confirm the below medications and sig&apos;s
            </BioType>
            <BioType className="it-body text-red-400">
                To change dosing, please inform coordinators.
            </BioType>

            {product_href === PRODUCT_HREF.B12_INJECTION && (
                <div className="flex flex-col gap-2">
                    <BioType className="itd-body">
                        Select Syringe/Needle type
                    </BioType>
                    <div className="flex flex-row gap-2">
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setB12QuantityAndSyringeType('standard');
                            }}
                            sx={{
                                backgroundColor:
                                    syringeType === 'standard'
                                        ? 'rgba(40, 106, 162, 0.1)'
                                        : syringeType === 'female'
                                        ? '#FFFFFF'
                                        : 'white',
                                borderColor:
                                    syringeType === 'standard'
                                        ? 'rgba(40, 106, 162, 1)'
                                        : '#BDBDBD',
                                color:
                                    syringeType === 'standard'
                                        ? 'primary'
                                        : '#C0C0C0',
                            }}
                        >
                            Regular Needle
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setB12QuantityAndSyringeType('female');
                            }}
                            sx={{
                                backgroundColor:
                                    syringeType === 'female'
                                        ? 'rgba(40, 106, 162, 0.1)'
                                        : syringeType === 'standard'
                                        ? '#FFFFFF'
                                        : 'white',
                                borderColor:
                                    syringeType === 'female'
                                        ? 'rgba(40, 106, 162, 1)'
                                        : '#BDBDBD',
                                color:
                                    syringeType === 'female'
                                        ? 'primary'
                                        : '#C0C0C0',
                            }}
                        >
                            Female Needle (Thin)
                        </Button>
                    </div>
                </div>
            )}

            {script.prescriptions[0].prescription_items.map(
                (prescription_item) => {
                    const medication_object = findMedicationById(
                        prescription_item.Id,
                    );

                    let secondary_item_object;

                    if (!medication_object) {
                        secondary_item_object = findSecondaryItemById(
                            prescription_item.Id,
                        );
                    }

                    return (
                        <div
                            className="flex flex-col"
                            key={prescription_item.Id}
                        >
                            <BioType className="itd-subtitle">
                                {medication_object
                                    ? medication_object?.name
                                    : secondary_item_object?.name}
                            </BioType>
                            <BioType className="itd-body">
                                {prescription_item.Sig}
                            </BioType>
                        </div>
                    );
                },
            )}
        </div>
    );
}
