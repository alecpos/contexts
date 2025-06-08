// import { createSupabaseServerComponentClient } from "@/app/utils/clients/supabaseServerClient";
// import { NextRequest, NextResponse } from "next/server";
// import puppeteer from "puppeteer";
// import { generateProfileSectionHTML } from "./_pdf-generation/profile-data-pdf";
// import { generateOrdersSectionHTML } from "./_pdf-generation/order-data-pdf";

// export async function POST(req: NextRequest) {
//   const jsonData = await req.json();

//   try {
//     // Fetch data from Supabase
//     const supabase = createSupabaseServerComponentClient();
//     const { data: patientProfileData, error: patientProfileFetchError } =
//       await supabase
//         .from("profiles")
//         .select(
//           `
//         updated_at,
//         health_history_response,
//         first_name,
//         last_name,
//         date_of_birth,
//         sex_at_birth,
//         address_line1,
//         address_line2,
//         city,
//         state,
//         zip,
//         phone_number
//       `
//         )
//         .eq("id", jsonData.userId);

//     const { data: patientOrderDataArray, error: patientOrderFetchError } =
//       await supabase
//         .from("orders")
//         .select(
//           `
//           id,
//           variant_text,
//           subscription_type,
//           order_status,
//           product_href,
//           rx_questionnaire_answers,
//           product:products!product_href(
//             name
//           )
//         `
//         )
//         .eq("customer_uid", jsonData.userId);

//     if (patientProfileFetchError) {
//       return new NextResponse(
//         JSON.stringify({ error: patientProfileFetchError.message }),
//         {
//           status: 500, // Internal Server Error
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     }

//     if (patientOrderFetchError) {
//       return new NextResponse(
//         JSON.stringify({ error: patientOrderFetchError.message }),
//         {
//           status: 500, // Internal Server Error
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//     }

//     const parsedData = patientProfileData;

//     // Define the order of the fields and their display names
//     const fieldOrder = [
//       { key: "updated_at", display: "Last updated" },
//       { key: "first_name", display: "Name" },
//       { key: "last_name", display: "" },
//       { key: "date_of_birth", display: "DOB" },
//       { key: "sex_at_birth", display: "Sex at birth" },
//       { key: "address", display: "Address" },
//       { key: "health_history_response", display: "Health History Response" },
//     ];

//     const profileSectionHTML = generateProfileSectionHTML(
//       patientProfileData,
//       fieldOrder
//     );

//     const ordersSectionHTML = generateOrdersSectionHTML(patientOrderDataArray);
//     // Create an HTML string with the data formatted as key-value pairs
//     let htmlContent = `
//   <style>
//   @media print {
//     @page :left {
//       margin-top:  0cm; /* Adjust this value as needed */
//     }
//     @page :right {
//       margin-top:  1cm; /* Adjust this value as needed */
//     }
//   }
//     body {
//       font-family: Arial, sans-serif;
//       margin:   0.5in; /* Industry-standard margin */
//     }
//     h1 {
//       text-align: center;
//       margin-bottom:   1em;
//     }
//     table {
//       width:   100%;
//       border-collapse: collapse;
//     }
//     th, td {
//       padding:   0.5em;
//       border:   1px solid black;
//     }
//   </style>
//   <h1>Customer Request PHI Data</h1>
//   <table>
//     ${profileSectionHTML}
//   </table>
// `;

//     htmlContent += `
// <style>
//   @media print {
//     .pageBreak {
//       page-break-after: always;
//     }
//   }
// </style>
// <div class="pageBreak"></div>
// <h2>Orders</h2>
// <table>
//   ${ordersSectionHTML}
// </table>
// `;
//     // Launch a new browser instance
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Set up the page content with the formatted HTML string
//     await page.setContent(htmlContent);

//     const pdfBuffer = await page.pdf({});

//     // Close the browser
//     await browser.close();

//     // Return the PDF as a response
//     return new NextResponse(pdfBuffer, {
//       status: 200, // OK
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": "attachment; filename=customers-data.pdf",
//       },
//     });
//   } catch (error) {
//     // Log the error and return an internal server error response
//     console.error("An error occurred while generating the PDF:", error);
//     return new NextResponse(
//       JSON.stringify({
//         error: "Internal server error: Failed to generate the PDF.",
//       }),
//       {
//         status: 500, // Internal Server Error
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }
// }
