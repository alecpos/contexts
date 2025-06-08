type EscalationEmailMessages = {
    cancel: (
        lastNameInitial: string,
        firstName: string,
        dateOfBirth: string
    ) => string;
    escalate: (
        lastNameInitial: string,
        firstName: string,
        dateOfBirth: string
    ) => string;
    new_rx: (
        lastNameInitial: string,
        firstName: string,
        dateOfBirth: string,
        clarification: string
    ) => string;
    late_shipment: (
        lastNameInitial: string,
        firstName: string,
        dateOfBirth: string,
        clarification: string
    ) => string;
};

export const escalation_email_messages: EscalationEmailMessages = {
    cancel: (lastNameInitial, firstName, dateOfBirth) =>
        `Hello, Could you please cancel the order for ${lastNameInitial}, ${firstName}, DOB: ${dateOfBirth}. Thank you`,
    escalate: (lastNameInitial, firstName, dateOfBirth) =>
        `Hello, Could you please look into the order for the pt ${lastNameInitial}, ${firstName}, DOB: ${dateOfBirth}. Thank you.`,
    new_rx: (lastNameInitial, firstName, dateOfBirth, clarification) =>
        `Hello, We have sent a new Rx for this patient because of ${clarification} for ${lastNameInitial}, ${firstName}, DOB: ${dateOfBirth}. Thank you.`,
    late_shipment:(lastNameInitial, firstName, dateOfBirth, clarification) =>
        `Hello, can you please look into the most recent order for ${lastNameInitial}, ${firstName}, DOB: ${dateOfBirth} and ship it as soon as possible? The order is late.`,
};

export function getEscalationMessage(
    type: string,
    lastNameInitial: string,
    firstName: string,
    dateOfBirth: string,
    clarification?: string
): string {
    switch (type) {
        case 'cancel':
            return escalation_email_messages.cancel(
                lastNameInitial,
                firstName,
                dateOfBirth
            );
        case 'escalate':
            return escalation_email_messages.escalate(
                lastNameInitial,
                firstName,
                dateOfBirth
            );
        case 'new_rx':
            return escalation_email_messages.new_rx(
                lastNameInitial,
                firstName,
                dateOfBirth,
                clarification || '*Clarification Message*'
            );
        case 'late_shipment':
            return escalation_email_messages.late_shipment(
                lastNameInitial,
                firstName,
                dateOfBirth,
                clarification || '*Clarification Message*'
            );

        default:
            throw new Error('Invalid escalation type');
    }
}
