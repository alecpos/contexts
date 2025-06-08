// 'use server'
// import { generateDoseSpotUrlM1 } from "./dose-spot";

// export async function createDoseSpotToken(clinicId: string, userId: string) {
//     const url = 'https://my.staging.dosespot.com/webapi/token';

//     const {url: doseSpotUrl, encryptedClinicId, encryptedClinicIdEncoded, encryptedUserId, encryptedUserIdEncoded} = generateDoseSpotUrlM1(clinicId, userId);

//     // Prepare the Basic Auth header
//     const credentials = btoa(`${clinicId}:${encryptedClinicId}`);
//     const basicAuthHeader = `Basic ${credentials}`;

//     // Prepare the body
//     const body = new URLSearchParams({
//       grant_type: 'password',
//       Username: userId,
//       Password: encryptedUserId
//     });

//     // Set up the request options
//     const options = {
//       method: 'POST',
//       headers: {
//         'Authorization': basicAuthHeader,
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: body
//     };

//     try {
//       const response = await fetch(url, options);
//       if (response.ok) {
//         const data = await response.json();
//         console.log('Token received:', data);
//         // Handle the received token as needed
//         return data; // Contains the access token and other details
//       } else {
//         // Handle HTTP errors
//         console.error('Failed to fetch token:', response.statusText);
//         return null;
//       }
//     } catch (error) {
//       // Handle network errors
//       console.error('Error fetching token:', error);
//       return null;
//     }
//   }
