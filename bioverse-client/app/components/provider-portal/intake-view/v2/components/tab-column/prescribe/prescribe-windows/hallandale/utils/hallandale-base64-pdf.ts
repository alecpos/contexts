import jsPDF from 'jspdf';

export function convertHallandaleOrderToBase64(
    hallandale_script: HallandaleOrderObject,
    allergy_data: string
) {
    const doc = new jsPDF();

    const hallandale_script_with_allergy = {
        ...hallandale_script,
        patient: {
            ...hallandale_script.patient,
            allergy_data: allergy_data,
        },
    };

    let pdfText = '';

    pdfText += `BIOVERSE Belmar Script 
    
    Submitted By: ${hallandale_script.prescriber.firstName} ${
        hallandale_script.prescriber.lastName
    }
    Signature: This Rx was electronically signed by the prescribing practitioner
         - Yes
    NPI: ${hallandale_script.prescriber.npi}
    Date: ${hallandale_script.rxs[0].dateWritten}

    Patient: ${hallandale_script.patient.firstName} ${
        hallandale_script.patient.lastName
    }
    Shipping Address: 
        ${hallandale_script.shipping.addressLine1}, ${
        hallandale_script.shipping.addressLine2
    }, 
        ${hallandale_script.shipping.city}, ${
        hallandale_script.shipping.state
    }, ${hallandale_script.shipping.zipCode}

    DOB: ${hallandale_script.patient.dateOfBirth}
    Known Allergies: ${allergy_data}

    Shipping Method: ${hallandale_script.shipping.service}
    Ship to: Patient | Bill to: Office

    Medications:
    ${hallandale_script.rxs.map((rx_item) => {
        return `
            Name: ${rx_item.drugName} 
            Sig: ${rx_item.directions}
            Quantity: ${rx_item.quantity}
            Refills: ${rx_item.refills}
            `;
    })}`;
    doc.text(pdfText, 10, 10);

    const scriptbase64pdf = btoa(doc.output());

    return scriptbase64pdf;
}
