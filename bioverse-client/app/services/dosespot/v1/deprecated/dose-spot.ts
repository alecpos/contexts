// import { createHash } from 'crypto';

// export function generateDoseSpotUrlM1(clinicId: string, userId: string) {
//   // const clinicKey = process.env.NEXT_PUBLIC_supabase_anon_key!;
//   const clinicKey = 'TS5R4AHRKRNP6443KQSLKAF9UCRFEA4S';

//   // const clinicId = '143600'
//   // const userId = '299334'
//   // const randomString = generateRandomAlphanumeric();
//   const randomString = 'NTMwNTRCOUABCTlFOUYwQjg3NDI5OTJB';

//   const appendedString = randomString + clinicKey;

//   const hash1 = createHash('sha512').update(appendedString, 'utf8').digest();

//   let base64String1 = hash1.toString('base64');

//   base64String1 = base64String1.replace(/==$/, '');

//   const encryptedClinicId = randomString + base64String1;

//   const encryptedClinicIdEncoded = encodeURIComponent(encryptedClinicId);

//   const first22Chars = randomString.substring(0, 22);
//   const userIdAndPhrase = userId + first22Chars;
//   const stringToHash = userIdAndPhrase + clinicKey;
//   const hash2 = createHash('sha512').update(stringToHash, 'utf8').digest();
//   let base64String2 = hash2.toString('base64');
//   base64String2 = base64String2.replace(/==$/, '');

//   const encryptedUserId = base64String2;

//   const encryptedUserIdEncoded = encodeURIComponent(base64String2);

//   const url1 = `http://my.staging.dosespot.com/LoginSingleSignOn.aspx?&SingleSignOnClinicId=${clinicId}&SingleSignOnUserId=${userId}&SingleSignOnPhraseLength=32&SingleSignOnCode=${encryptedClinicIdEncoded}&SingleSignOnUserIdVerify=${encryptedUserIdEncoded}&RefillsErrors=1`;
//   const url = `http://my.staging.dosespot.com/LoginSingleSignOn.aspx?&SingleSignOnClinicId=${clinicId}&SingleSignOnUserId=${userId}&PatientId=21579643&SingleSignOnPhraseLength=32&SingleSignOnCode=${encryptedClinicIdEncoded}&SingleSignOnUserIdVerify=${encryptedUserIdEncoded}`;
//   21579643;

//   console.log(url);

//   return {
//     url: url,
//     encryptedClinicId: encryptedClinicId,
//     encryptedClinicIdEncoded: encryptedClinicIdEncoded,
//     encryptedUserId: encryptedUserId,
//     encryptedUserIdEncoded: encryptedUserIdEncoded,
//   };
// }

// // function generateRandomAlphanumeric(): string {
// //   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
// //   let result = '';
// //   const charactersLength = characters.length;
// //   for (let i = 0; i < 32; i++) {
// //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
// //   }
// //   return result;
// // }
