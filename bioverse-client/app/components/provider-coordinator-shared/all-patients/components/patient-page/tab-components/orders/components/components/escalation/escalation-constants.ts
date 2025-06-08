type EscalationEmailMessages = {
    cancel: (
        lastNameInitial: string,
        firstName: string,
        dateOfBirth: string,
        clarification: string
    ) => string;
    escalate: (
        lastNameInitial: string,
        firstName: string,
        dateOfBirth: string,
        clarification: string
    ) => string;
    new_rx: (
        lastNameInitial: string,
        firstName: string,
        dateOfBirth: string,
        clarification: string
    ) => string;
};

export const escalation_email_messages: EscalationEmailMessages = {
    cancel: (lastNameInitial, firstName, dateOfBirth, clarification) =>
        `Hi, Could you please cancel the order for ${lastNameInitial}, ${firstName}, DOB: ${dateOfBirth}. ${clarification}${
            clarification.length > 0 ? '.' : ''
        } Thank you`,
    escalate: (lastNameInitial, firstName, dateOfBirth, clarification) =>
        `Hi, Could you please look into the order for the pt ${lastNameInitial}, ${firstName}, DOB: ${dateOfBirth}. ${clarification}${
            clarification.length > 0 ? '.' : ''
        } Thank you.`,
    new_rx: (lastNameInitial, firstName, dateOfBirth, clarification) =>
        `Hi, We have sent a new Rx for this patient because of ${clarification} for ${lastNameInitial}, ${firstName}, DOB: ${dateOfBirth}. Thank you.`,
};

export function getEscalationMessage(
    type: string,
    lastNameInitial: string,
    firstName: string,
    dateOfBirth: string,
    clarification: string
): string {
    switch (type) {
        case 'cancel':
            return escalation_email_messages.cancel(
                lastNameInitial,
                firstName,
                dateOfBirth,
                clarification
            );
        case 'escalate':
            return escalation_email_messages.escalate(
                lastNameInitial,
                firstName,
                dateOfBirth,
                clarification
            );
        case 'new_rx':
            return escalation_email_messages.new_rx(
                lastNameInitial,
                firstName,
                dateOfBirth,
                clarification || '*Clarification Message*'
            );

        default:
            throw new Error('Invalid escalation type');
    }
}
