import jsPDF from 'jspdf';

export function convertBelmarOrderToBase64(
    belmar_script: BelmarRequestOrder,
    allergy_data: string
) {
    const doc = new jsPDF();

    const belmar_script_with_allergy = {
        ...belmar_script,
        patient: {
            ...belmar_script.patient,
            allergy_data: allergy_data,
        },
    };

    let pdfText = '';

    pdfText += `BIOVERSE Belmar Script 
    
    Submitted By: ${belmar_script.prescriber.firstName} ${
        belmar_script.prescriber.lastName
    }
    Signature: This Rx was electronically signed by the prescribing practitioner
         - Yes
    NPI: ${belmar_script.prescriber.npi}
    Date: ${belmar_script.rxs[0].dateWritten}

    Patient: ${belmar_script.patient.firstName} ${
        belmar_script.patient.lastName
    }
    Shipping Address: 
        ${belmar_script.shipping.addressLine1}, ${
        belmar_script.shipping.addressLine2
    }, 
        ${belmar_script.shipping.city}, ${belmar_script.shipping.state}, ${
        belmar_script.shipping.zipCode
    }

    DOB: ${belmar_script.patient.dateOfBirth}
    Known Allergies: ${allergy_data}

    Shipping Method: ${belmar_script.shipping.service}
    Ship to: Patient | Bill to: Office

    Medications:
    ${belmar_script.rxs.map((rx_item) => {
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
