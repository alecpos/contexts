import { MacroParameters } from './macros-types';

export function replaceParameters(
    patient_data: DBPatientData,
    providerName: string,
    content: string,
    credentials: string,
    product_href?: string,
    order_id?: string | number
) {
    if (patient_data.address_line1) {
        let deliveryAddress =
            patient_data.address_line1 +
            ', ' +
            patient_data.city +
            ', ' +
            patient_data.state +
            ' ' +
            patient_data.zip;

        content = content.replace(
            MacroParameters.DeliverAddress,
            deliveryAddress
        );
    }

    content = content.replace(
        MacroParameters.PatientName,
        patient_data.first_name
    );

    if (product_href) {
        content = content.replace(
            new RegExp(MacroParameters.ProductHref, 'g'),
            product_href
        );
    }

    if (order_id) {
        content = content.replace(MacroParameters.OrderId, String(order_id));
    }

    content = content.replace(MacroParameters.ProviderName, providerName);

    let signature = '<br/>' + providerName + ', ' + credentials;
    content = content.replace(MacroParameters.Signature, signature);
    return content;
}

export function replaceParametersAutomaticSend(
    patient_data: DBPatientData,
    content: string,
    providerName: string,
    subscriptionRenewalDate: string,
    credentials: string
) {
    content = content.replace(
        MacroParameters.PatientName,
        patient_data.first_name
    );

    content = content.replace(MacroParameters.ProviderName, providerName);

    if (content.includes(MacroParameters.SubscriptionRenewalDate)) {
        content = content.replace(
            new RegExp(MacroParameters.SubscriptionRenewalDate, 'g'),
            subscriptionRenewalDate
        );
    }

    let signature = '<br/>' + providerName + ', ' + credentials;
    content = content.replace(MacroParameters.Signature, signature);
    return content;
}

export function replaceCoordinatorParameters(
    patient_data: DBPatientData,
    userFirstName: string,
    userLastName: string,
    content: string
) {
    if (patient_data.address_line1) {
        let deliveryAddress =
            patient_data.address_line1 +
            ', ' +
            patient_data.city +
            ', ' +
            patient_data.state +
            ' ' +
            patient_data.zip;

        content = content.replace(
            MacroParameters.DeliverAddress,
            deliveryAddress
        );
    }

    content = content.replace(
        MacroParameters.PatientName,
        patient_data.first_name
    );

    content = content.replace(MacroParameters.CoordinatorName, userFirstName);

    let signature = '<br/>' + userFirstName + ' ' + userLastName;
    content = content.replace(MacroParameters.Signature, signature);
    return content;
}
