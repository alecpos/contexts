import {
    createSupabaseServerComponentClient,
    createSupabaseServiceClient,
} from '@/app/utils/clients/supabaseServerClient';
import { NextRequest, NextResponse } from 'next/server';

import jsPDF from 'jspdf';

export async function POST(req: NextRequest) {
    const jsonData = await req.json();

    try {
        // Fetch data from Supabase
        const supabase = createSupabaseServiceClient();
        const { data: patientProfileData, error: patientProfileFetchError } =
            await supabase
                .from('profiles')
                .select(
                    `
        updated_at,
        first_name,
        last_name,
        date_of_birth,
        sex_at_birth,
        address_line1,
        address_line2,
        city,
        state,
        zip,
        phone_number
      `
                )
                .eq('id', jsonData.userId)
                .single();

        const { data: patientOrderDataArray, error: patientOrderFetchError } =
            await supabase
                .from('orders')
                .select(
                    `
          id,
          variant_text,
          subscription_type,
          order_status,
          product_href,
          rx_questionnaire_answers,
          product:products!product_href(
            name
          )
        `
                )
                .eq('customer_uid', jsonData.userId);

        if (patientProfileFetchError) {
            return new NextResponse(
                JSON.stringify({ error: patientProfileFetchError.message }),
                {
                    status: 500, // Internal Server Error
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        if (patientOrderFetchError) {
            return new NextResponse(
                JSON.stringify({ error: patientOrderFetchError.message }),
                {
                    status: 500, // Internal Server Error
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        // Create a new PDF instance
        const doc = new jsPDF();

        // Add profile data to the PDF
        doc.setFontSize(12);
        doc.text('Patient Profile', 10, 10);

        // Function to format the patient profile data
        function formatPatientProfileData(data: {
            updated_at: any;
            first_name: any;
            last_name: any;
            date_of_birth: any;
            sex_at_birth: any;
            address_line1: any;
            address_line2: any;
            city: any;
            state: any;
            zip: any;
            phone_number: any;
        }) {
            const formattedData = {
                ...data,
                Name: `${data.first_name} ${data.last_name}`,
                Address: `${data.address_line1}, ${data.address_line2}, ${data.city}, ${data.state} ${data.zip}`,
                'Last updated': data.updated_at
                    ? new Date(data.updated_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                      })
                    : 'N/A',
                DOB: data.date_of_birth
                    ? new Date(data.date_of_birth).toLocaleDateString('en-US')
                    : 'N/A',
                'Sex at birth': data.sex_at_birth || 'N/A',
                Phone: data.phone_number || 'N/A',
            };
            delete formattedData.first_name;
            delete formattedData.last_name;
            delete formattedData.address_line1;
            delete formattedData.address_line2;
            delete formattedData.city;
            delete formattedData.state;
            delete formattedData.zip;
            delete formattedData.updated_at;
            delete formattedData.date_of_birth;
            delete formattedData.sex_at_birth;
            delete formattedData.phone_number;
            return formattedData;
        }

        // Assuming patientProfileData is an object with the given structure
        if (patientProfileData) {
            const formattedData = formatPatientProfileData(patientProfileData);
            let yPosition = 20; // Starting position for the text
            Object.entries(formattedData).forEach(([key, value]) => {
                // Format the key-value pair with a colon in between
                const formattedText = `${key}: ${value}`;
                doc.text(formattedText, 10, yPosition);
                yPosition += 10; // Adjust the spacing between lines
            });
        } else {
            doc.text('No profile data found', 10, 30);
        }

        // Add health history questionnaire results to the PDF
        doc.addPage();
        doc.setFontSize(12);
        doc.text('Patient Health History Questionnaire Results', 10, 10);

        let yPositionh = 20; // Starting position for the text

        doc.text('No health history questionnaire results found', 10, 30);

        console.log(patientOrderDataArray[0].rx_questionnaire_answers);

        doc.addPage();
        doc.setFontSize(12);
        doc.text('Patient Orders', 10, 10);

        let yPosition = 20; // Starting position for the text
        if (patientOrderDataArray && patientOrderDataArray.length > 0) {
            patientOrderDataArray.forEach((order: any) => {
                // Check if the current yPosition is near the bottom of the page
                if (yPosition > 270) {
                    // Adjust this value based on your page size and content
                    doc.addPage();
                    yPosition = 20; // Reset yPosition for the new page
                }

                // Draw a horizontal line to separate orders
                doc.line(10, yPosition + 5, 200, yPosition + 5);
                yPosition += 10; // Adjust the spacing between lines

                // Display order details
                doc.text(`ID: ${order.id}`, 10, yPosition);
                yPosition += 10;
                doc.text(`Variant: ${order.variant_text}`, 10, yPosition);
                yPosition += 10;
                doc.text(
                    `Subscription Type: ${order.subscription_type}`,
                    10,
                    yPosition
                );
                yPosition += 10;
                doc.text(`Order Status: ${order.order_status}`, 10, yPosition);
                yPosition += 10;
                // Check if the product name text fits on the current page
                const productNameText = `Product: ${order.product.name}`;
                const productNameHeight =
                    doc.getTextDimensions(productNameText).h;
                if (productNameHeight > 270 - yPosition) {
                    // Add a new page if the text doesn't fit
                    doc.addPage();
                    yPosition = 20; // Reset yPosition for the new page
                }
                doc.text(productNameText, 10, yPosition);
                yPosition += 10;

                if (
                    order.rx_questionnaire_answers &&
                    Object.keys(order.rx_questionnaire_answers).length > 0
                ) {
                    Object.keys(order.rx_questionnaire_answers).forEach(
                        (key) => {
                            const questionAnswerPairs =
                                order.rx_questionnaire_answers[key];
                            questionAnswerPairs.forEach(
                                (pair: { question: string; answer: any[] }) => {
                                    // Split the question text into multiple lines if it's too long
                                    const questionLines = doc.splitTextToSize(
                                        'Q: ' + pair.question,
                                        180
                                    ); // Adjust the width as needed
                                    questionLines.forEach(
                                        (line: string | string[]) => {
                                            doc.text(line, 10, yPosition);
                                            yPosition += 10; // Adjust the spacing between lines
                                        }
                                    );

                                    // Ensure answer is a string before splitting
                                    const answerText = Array.isArray(
                                        pair.answer
                                    )
                                        ? pair.answer.join(' ')
                                        : pair.answer;

                                    // Calculate the height of the text
                                    const textHeight =
                                        doc.getTextDimensions(answerText).h;

                                    // Check if the text height is greater than the remaining space on the current page
                                    if (textHeight > 270 - yPosition) {
                                        // Add a new page if the text doesn't fit
                                        doc.addPage();
                                        yPosition = 20; // Reset yPosition for the new page
                                    }

                                    // Print the answer with wrapping
                                    const answerLines = doc.splitTextToSize(
                                        'A: ' + answerText,
                                        180
                                    ); // Adjust the width as needed
                                    answerLines.forEach(
                                        (line: string | string[]) => {
                                            doc.text(line, 10, yPosition);
                                            yPosition += 10; // Adjust the spacing between lines
                                        }
                                    );
                                }
                            );
                        }
                    );
                } else {
                    doc.text(
                        'No RX questionnaire answers found',
                        10,
                        yPosition
                    );
                    yPosition += 10;
                }

                // Add space between orders
                yPosition += 10;
            });
        } else {
            doc.text('No orders data found', 10, 30);
        }

        // Finalize PDF document
        const pdfBytes = doc.output('arraybuffer');

        // Return the PDF as a response for download
        return new NextResponse(pdfBytes, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=patient_data.pdf`,
            },
        });
    } catch (error) {
        // Log the error and return an internal server error response
        console.error('An error occurred while generating the PDF:', error);
        return new NextResponse(
            JSON.stringify({
                error: 'Internal server error: Failed to generate the PDF.',
            }),
            {
                status: 500, // Internal Server Error
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}
