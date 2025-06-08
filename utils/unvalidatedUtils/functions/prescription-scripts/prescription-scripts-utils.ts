import { ECHEVERRY_PRESCRIBER_OBJECT } from '@/app/components/provider-portal/intake-view/v2/components/tab-column/prescribe/prescribe-windows/empower/utils/empower-static-objects';

/**
 * Updates the script to have the most recent written date.
 * @param oldScript
 * @param newClientOrderId
 * @returns
 */
export function updatePrescriptionScript(
    oldScript: EmpowerPrescriptionOrder,
    newClientOrderId: string,
): EmpowerPrescriptionOrder {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const newDate = `${year}-${month}-${day}`;

    try {
        oldScript.newRxs.forEach((rx: EmpowerNewRx) => {
            // Update the writtenDate
            rx.prescriber = ECHEVERRY_PRESCRIBER_OBJECT;
            rx.medication.writtenDate = newDate;
        });
        if (newClientOrderId) {
            oldScript.clientOrderId = newClientOrderId;
        }
        return oldScript;
    } catch (error) {
        console.error('Error updating prescription script', oldScript, error);
    }
    return oldScript;
}

export function updatePrescriptionProvider(
    oldScript: EmpowerPrescriptionOrder,
): EmpowerPrescriptionOrder {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const newDate = `${year}-${month}-${day}`;
    try {
        oldScript.newRxs.forEach((rx: EmpowerNewRx) => {
            // Update the writtenDate
            rx.prescriber = ECHEVERRY_PRESCRIBER_OBJECT;
            rx.medication.writtenDate = newDate;
        });

        return oldScript;
    } catch (error) {
        console.error('Error updating prescription script', oldScript, error);
    }
    return oldScript;
}
