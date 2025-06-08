import { searchHallandaleItemCatalogByCode } from '@/app/services/pharmacy-integration/hallandale/hallandale-catalog';
import { OrderType } from '@/app/types/orders/order-types';
import { convertEmpowerOrderToHallandaleVariant } from '../../../components/provider-portal/intake-view/v2/components/containers/utils/pharmacy-variant-index-conversion/empower-hallandale-variant-converter';
import { getHallandaleCatalogObject } from '@/app/services/pharmacy-integration/hallandale/hallandale-variant-product-script-data';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { getPatientInformationById } from '../../actions/provider/patient-overview';
import { fetchOrderData } from '../../database/controller/orders/orders-api';
import { getResendCount } from '../../database/controller/order_data_audit/order_data_audit_api';

export function generateHallandaleScript(
    patientData: DBPatientData,
    orderData: DBOrderData,
    addressData: AddressInterface,
    orderType: OrderType,
    variant_index: number,
    custom_order_id?: string
):
    | { script: HallandaleOrderObject; sigs: string[]; displayName: string }
    | undefined {
    custom_order_id = custom_order_id ?? orderData.id;
    let hallandaleScript: HallandaleOrderObject = {
        general: {
            referenceId: custom_order_id,
        },
        // prescriber: {
        //     npi: '1689995771',
        //     lastName: 'Echeverry',
        //     firstName: 'German',
        //     licenseState: 'FL',
        //     licenseNumber: 'ME138578',
        // },
        prescriber: {
            npi: '1013986835',
            lastName: 'Desai',
            firstName: 'Bobby',
            licenseState: 'FL',
            licenseNumber: 'ME80459',
        },
        practice: {
            id: parseInt(process.env.NEXT_PUBLIC_HALLANDALE_PRACTICE_ID!),
        },
        patient: {
            lastName: patientData.last_name,
            firstName: patientData.first_name,
            gender: parseHallandaleGender(patientData.sex_at_birth),
            dateOfBirth: patientData.date_of_birth,
            address1: addressData.address_line1,
            address2: addressData.address_line2,
            city: addressData.city,
            state: addressData.state,
            zip: addressData.zip,
            phoneHome: patientData.phone_number,
            email: patientData.email,
        },
        billing: {
            payorType: 'doc',
        },
        shipping: {
            recipientType: 'patient',
            recipientFirstName: patientData.first_name,
            recipientLastName: patientData.last_name,
            recipientPhone: patientData.phone_number,
            recipientEmail: patientData.email,
            addressLine1: addressData.address_line1,
            addressLine2: addressData.address_line2,
            city: addressData.city,
            state: addressData.state,
            zipCode: addressData.zip,
            country: 'US',
            service: 6230,
        },
        rxs: [],
    };

    const sigs_list: string[] = [];

    const HALLANDALE_CATALOG_ITEM = getHallandaleCatalogObject(
        orderData.product_href as PRODUCT_HREF,
        variant_index
    );

    if (HALLANDALE_CATALOG_ITEM) {
        const newRxsList = HALLANDALE_CATALOG_ITEM.array.map((rx_item: any) => {
            const rx_catalog_data = searchHallandaleItemCatalogByCode(
                rx_item.catalogItemCode
            );

            sigs_list.push(rx_item.sigText);

            return {
                rxType: 'new',
                drugName: rx_catalog_data.product_name,
                drugStrength: rx_catalog_data.product_strength,
                drugForm: rx_catalog_data.product_form,
                lfProductID: rx_catalog_data.product_code,
                quantity: rx_item.quantity,
                directions: rx_item.sigText,
                refills: 0,
                dateWritten: getCurrentDate(),
                daysSupply: rx_item.daysSupply,
                internalSigDisplay: rx_item.internalDisplaySigText,
            };
        });

        hallandaleScript = {
            ...hallandaleScript,
            rxs: newRxsList,
        };

        return {
            script: hallandaleScript,
            sigs: sigs_list,
            displayName: HALLANDALE_CATALOG_ITEM.selectDisplayName,
        };
    } else {
        return undefined;
    }
}

export async function generateHallandaleScriptAsync(
    patientId: string,
    orderId: string,
    override?: ScriptOverrideObject,
    resend?: boolean
): Promise<
    | { script: HallandaleOrderObject; sigs: string[]; displayName: string }
    | undefined
> {
    const { type: orderType, data: orderData } = await fetchOrderData(orderId);
    const { data: patientData, error } = await getPatientInformationById(
        patientId
    );

    if (error) {
        throw new Error(error.message);
    }

    const resendCount = await getResendCount(
        parseInt(orderId),
        orderType === OrderType.Order ? undefined : orderData.renewal_order_id
    );

    const addressLineTwo =
        orderType === OrderType.Order
            ? orderData.address_line2
            : orderData.order.address_line2;

    let hallandaleScript: HallandaleOrderObject = {
        general: {
            referenceId: `${
                orderType === OrderType.Order
                    ? orderData.id
                    : orderData.renewal_order_id
            }${resend ? 'R'.repeat(resendCount + 1) : ''}`,
        },
        prescriber: {
            npi: '1013986835',
            lastName: 'Desai',
            firstName: 'Bobby',
            licenseState: 'FL',
            licenseNumber: 'ME80459',
        },
        practice: {
            id: parseInt(process.env.NEXT_PUBLIC_HALLANDALE_PRACTICE_ID!),
        },
        patient: {
            lastName: patientData.last_name,
            firstName: patientData.first_name,
            gender: parseHallandaleGender(patientData.sex_at_birth),
            dateOfBirth: patientData.date_of_birth,
            address1:
                orderType === OrderType.Order
                    ? orderData.address_line1
                    : orderData.order.address_line1,
            address2: addressLineTwo === '' ? null : addressLineTwo,
            city:
                orderType === OrderType.Order
                    ? orderData.city
                    : orderData.order.city,
            state:
                orderType === OrderType.Order
                    ? orderData.state
                    : orderData.order.state,
            zip:
                orderType === OrderType.Order
                    ? orderData.zip
                    : orderData.order.zip,
            phoneHome: patientData.phone_number,
            email: patientData.email,
        },
        billing: {
            payorType: 'doc',
        },
        shipping: {
            recipientType: 'patient',
            recipientFirstName: patientData.first_name,
            recipientLastName: patientData.last_name,
            recipientPhone: patientData.phone_number,
            recipientEmail: patientData.email,
            addressLine1:
                orderType === OrderType.Order
                    ? orderData.address_line1
                    : orderData.order.address_line1,
            addressLine2: addressLineTwo === '' ? null : addressLineTwo,
            city:
                orderType === OrderType.Order
                    ? orderData.city
                    : orderData.order.city,
            state:
                orderType === OrderType.Order
                    ? orderData.state
                    : orderData.order.state,
            zipCode:
                orderType === OrderType.Order
                    ? orderData.zip
                    : orderData.order.zip,
            country: 'US',
            service: 6230,
        },
        rxs: [],
    };

    const sigs_list: string[] = [];

    const HALLANDALE_CATALOG_ITEM = getHallandaleCatalogObject(
        orderData.product_href as PRODUCT_HREF,
        orderData.variant_index
    );

    if (HALLANDALE_CATALOG_ITEM) {
        const newRxsList = HALLANDALE_CATALOG_ITEM.array.map((rx_item: any) => {
            const rx_catalog_data = searchHallandaleItemCatalogByCode(
                rx_item.catalogItemCode
            );

            sigs_list.push(rx_item.sigText);

            return {
                rxType: 'new',
                drugName: rx_catalog_data.product_name,
                drugStrength: rx_catalog_data.product_strength,
                drugForm: rx_catalog_data.product_form,
                lfProductID: rx_catalog_data.product_code,
                quantity: rx_item.quantity,
                directions: rx_item.sigText,
                refills: 0,
                dateWritten: getCurrentDate(),
                daysSupply: rx_item.daysSupply,
                internalSigDisplay: rx_item.internalDisplaySigText,
            };
        });

        hallandaleScript = {
            ...hallandaleScript,
            rxs: newRxsList,
        };

        return {
            script: hallandaleScript,
            sigs: sigs_list,
            displayName: HALLANDALE_CATALOG_ITEM.selectDisplayName,
        };
    } else {
        return undefined;
    }
}

function parseHallandaleGender(sex_at_birth: string): 'm' | 'f' | 'u' {
    switch (sex_at_birth) {
        case 'Male':
            return 'm';
        case 'Female':
            return 'f';
        default:
            return 'u';
    }
}

function getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}



export async function sendMoreNeedlesHallandale(
    patientData: APProfileData,
    orderData: OrderTabOrder,
    custom_order_id?: string
):
    Promise<boolean> {
        custom_order_id = custom_order_id ?? orderData.id;
        let hallandaleScript: HallandaleOrderObject = {
            general: {
                referenceId: custom_order_id,
            },
            // prescriber: {
            //     npi: '1689995771',
            //     lastName: 'Echeverry',
            //     firstName: 'German',
            //     licenseState: 'FL',
            //     licenseNumber: 'ME138578',
            // },
            prescriber: {
                npi: '1013986835',
                lastName: 'Desai',
                firstName: 'Bobby',
                licenseState: 'FL',
                licenseNumber: 'ME80459',
            },
            practice: {
                id: parseInt(process.env.NEXT_PUBLIC_HALLANDALE_PRACTICE_ID!),
            },
            patient: {
                lastName: patientData.last_name,
                firstName: patientData.first_name,
                gender: parseHallandaleGender(patientData.sex_at_birth),
                dateOfBirth: patientData.date_of_birth,
                address1: orderData.address_line1,
                address2: orderData.address_line2,
                city: orderData.city,
                state: orderData.state,
                zip: orderData.zip,
                phoneHome: patientData.phone_number,
                email: patientData.email,
            },
            billing: {
                payorType: 'doc',
            },
            shipping: {
                recipientType: 'patient',
                recipientFirstName: patientData.first_name,
                recipientLastName: patientData.last_name,
                recipientPhone: patientData.phone_number,
                recipientEmail: patientData.email,
                addressLine1: orderData.address_line1,
                addressLine2: orderData.address_line2,
                city: orderData.city,
                state: orderData.state,
                zipCode: orderData.zip,
                country: 'US',
                service: 6230,
            },
            rxs: [],
        };
    
    
        const needleRx: HallandaleNewRxObject =  {
                rxType: 'new',
                drugName: 'GLP-1 Inj Kit',
                drugStrength: 'Insulin Syringe 30G 5/16" 1 mL (#10), Alcohol Pads (#30)',
                drugForm: 'Supplies',
                lfProductID: 7963303,
                quantity: 2,
                directions: "Additional Syringes for GLP-1 Patient",
                refills: 0,
                dateWritten: getCurrentDate(),
                daysSupply: 90,
                internalSigDisplay: ["Additional Syringes for GLP-1 Patient"],
        } 
            
        hallandaleScript = {
            ...hallandaleScript,
            document: { pdfBase64: '' },
            rxs: [needleRx],
        } as HallandaleOrderObject;


        console.log("SCRIPTR!1", hallandaleScript)

        const url = process.env.HALLANDALE_API_URL!;
        const username = process.env.HALLANDALE_API_USERNAME!;
        const password = process.env.HALLANDALE_API_PASSWORD!;
        const headers = new Headers({
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + btoa(`${username}:${password}`),
            'X-Vendor-ID': process.env.HALLANDALE_X_VENDOR_ID!,
            'X-Location-ID': process.env.HALLANDALE_X_LOCATION_ID!,
            'X-API-Network-ID': process.env.HALLANDALE_X_API_NETWORK_ID!,
        });

        hallandaleScript.general!.referenceId = orderData.id + "N";

        const hallandaleScriptObj = {
            message: { id: orderData.id + "N", sentTime: new Date().toISOString() },
            order: hallandaleScript,
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(hallandaleScriptObj),
        });

        if (response.status !== 200) {
            console.log("ERROR SENDING SCRIPT", response)
            return false;
        }

        console.log("RESPONSE", response)

        return true;
    }
    




