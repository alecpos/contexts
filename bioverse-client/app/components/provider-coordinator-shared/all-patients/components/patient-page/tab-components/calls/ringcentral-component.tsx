'use client';

import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import {
    Button,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { SDK as RC_SDK } from '@ringcentral/sdk';
import WebPhone from "ringcentral-web-phone";

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import OutboundCallSession from 'ringcentral-web-phone/call-session/outbound';


interface CallLogRecord {
    type: string;
    direction: string;
    duration: number;
    startTime: string;
}
interface CallLog {
    records: CallLogRecord[];
}
interface RingCentralComponentProps {
    access_type: BV_AUTH_TYPE | null;
    profile_data: APProfileData;
}

//convert bioverse phone number to ringcentral phone number
const convertBVPhoneNumToRCPhoneNum = (phone_number: string) => {
    // Remove any non-digit characters
    const cleanedNumber = phone_number.replace(/\D/g, '');

    // Check if the number starts with a country code (1 for US)
    const countryCode = cleanedNumber.startsWith('1') ? '' : '1';

    if (cleanedNumber.length !== 10) {
        return null;
    }
    // Format the number as 1XXXXXXXXXX
    return `${countryCode}${cleanedNumber}`;
}

//FOLLOWING THIS: 
//https://github.com/ringcentral/ringcentral-web-phone?tab=readme-ov-file
export default function RingCentralComponent({
    access_type,
    profile_data,
}: RingCentralComponentProps) {

    const [webPhone, setWebPhone] = useState<WebPhone | null>(null);
    const [session, setSession] = useState<OutboundCallSession | null>(null);
    const [callButtonLoading, setCallButtonLoading] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const [callJustEnded, setCallJustEnded] = useState(false);
    const [callLog, setCallLog] = useState<CallLog | null>(null);

    useEffect(() => {

        if (!convertBVPhoneNumToRCPhoneNum(profile_data.phone_number)){
            return;
        }
        const initializeWebPhone = async () => {
            try {
                const res = await fetch('/api/ringcentral/sip-info', { method: 'POST' });
                const { sipInfo } = await res.json();
                // console.log('SIP Info:', sipInfo);

                const webPhone = new WebPhone({sipInfo});
                await webPhone.start();
      
                setWebPhone(webPhone);

                const credentialsResponse =  await fetch('/api/ringcentral/credentials', { method: 'POST' });
                const credentials = await credentialsResponse.json();
                var rcsdk = new RC_SDK({
                    'server':       credentials.server,
                    'clientId':     credentials.clientId,
                    'clientSecret': credentials.clientSecret,
                });
                var platform = rcsdk.platform();
                await platform.login({ 'jwt':  credentials.jwt })
                var queryParams = {
                    phoneNumber: convertBVPhoneNumToRCPhoneNum(profile_data.phone_number),
                }
                var endpoint = `/restapi/v1.0/account/~/extension/~/call-log`
                var resp = await platform.get(endpoint, queryParams)
                var jsonObj = await resp.json()
                setCallLog(jsonObj)

            } catch (error) {
                console.error('Initialization Error:', error);
            }
        };

        initializeWebPhone();
    }, []);

    const FROM_PHONE_NUMBER = '17476668167'; // The phone number connected to ringcentral to make calls from
    const TO_PHONE_NUMBER = convertBVPhoneNumToRCPhoneNum(profile_data.phone_number); // The phone number to call
    if (!TO_PHONE_NUMBER) return <p className='mt-10'>Cannot make calls - Phone number for this patient is not stored correctly in our database</p>

    const makeCall = async () => {
        if (!webPhone) {
            console.error('WebPhone is not initialized');
            alert('WebPhone is not set up correctly, try refreshing the page after 1 minute');
            return;
        }

        setCallButtonLoading(true);
        setCallJustEnded(false);

        try {
            const callSession = await webPhone.call(TO_PHONE_NUMBER, FROM_PHONE_NUMBER);
            setIsCalling(true);

            //this doesn't work - command f "Known issue" here: https://github.com/ringcentral/ringcentral-web-phone?tab=readme-ov-file
            // callSession.on('accepted', () => { 
            //     console.log('Call connected');
            // });

            callSession.on("disposed", () => {
                console.log("Call session disposed");
                setIsCalling(false);
                setCallJustEnded(true);
                setCallButtonLoading(false);
            });

            callSession.on("failed", () => {
                console.log("Call session failed");
                setCallButtonLoading(false);
                setIsCalling(false);
            });

            setSession(callSession);

        } catch (error) {
            console.error('Error making call:', error);
        }
    }

    const hangUp = () => {
        if (session) {
            session.hangup();
            setIsCalling(false);
            setCallJustEnded(true);
            setCallButtonLoading(false);
        }
    }

    function formatTimestamp(isoString: any) {
        const date = new Date(isoString);
      
        const options = {
          year: "numeric" as "numeric",
          month: "long" as "long",
          day: "numeric" as "numeric",
          hour: "2-digit" as "2-digit",
          minute: "2-digit" as "2-digit",
          second: "2-digit" as "2-digit",
          hour12: true, 
        };
      
        return date.toLocaleString("en-US", options);
      }


      const convertSecondsToHMS = (seconds: number): string => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
      
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      };


    return (
      
        <div className='mt-[48px] w-full max-w-[1100px]'>
            <audio id="remoteAudio" autoPlay></audio>
            <div className='flex flex-col md:flex-row w-full justify-center  gap-10'>
                <div className='w-1/2'>
                    <h1 className='text-center'>Call {profile_data.first_name} {profile_data.last_name}</h1>
                    <p className='text-center my-3'>{profile_data.phone_number}</p>

                    {!isCalling && (
                        <div className='mt-10 flex flex-row justify-center w-full'>
                            <Button  
                                variant='contained'
                                onClick={makeCall}
                                className="bg-green-500 text-white w-full "
                                sx={{
                                    maxWidth: '200px',
                                }}
                            >
                                {!callButtonLoading && 'Call'}
                                {callButtonLoading && (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white">|</div>
                                    </div>
                                )}
                            </Button>
                        </div>
                    )}

                    {isCalling && (
                        <>
                            <div className="flex items-center justify-center space-x-5 p-6 bg-blue-100 rounded-lg shadow-md">
                                <div className="animate-spin rounded-full h-12 w-12 border-solid border-t-[5px] border-blue-500"></div>
                                <p className="text-lg font-medium text-blue-600">Calling...</p>
                                <Button  
                                    onClick={hangUp}
                                    variant='contained'
                                    className="bg-red-500 text-white p-2 flex gap-2 ">
                                    <PhoneDisabledIcon />
                                    Hang Up
                                </Button>

                            </div>
                            <p className='text-xs text-blue-600 text-center mt-3'> Increase the volume on your device if you do not hear ringing</p>

                        </>
                    )}

                    {callJustEnded && (
                        <div className="flex items-center justify-center p-6 bg-green-100 rounded-lg shadow-md mt-10">
                            <CheckCircleOutlineIcon className="h-12 w-12 text-green-600" />
                            <p className="ml-4 text-lg font-medium text-green-700">Call Ended</p>
                        </div>
                    )}

                </div>

                <div className="w-1/2">
                    <h1 className='text-center'>Call history</h1>
                    <div className="flex flex-col gap-4 mt-10">
                        {callLog && (
                            <>
                                {callLog.records.length > 0 && (
                                    <>
                                        {callLog.records.map((record: any, index: number) => (
                                            <div
                                                key={index}
                                                className="flex flex-col gap-2 p-4  mx-auto border-solid bg-white shadow-md rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300 max-w-[450px]"
                                            >
                                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                                                Direction:
                                                <span className="text-gray-800 font-semibold ml-1">{record.direction}</span>
                                                </p>
                                            
                                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                                                Duration:
                                                <span className="text-gray-800 font-semibold ml-1">{convertSecondsToHMS(record.duration)}</span>
                                                </p>
                                            
                                                <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">
                                                Start Time:
                                                <span className="text-gray-800 font-semibold ml-1">{formatTimestamp(record.startTime)}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </>
                                )}
                                {callLog.records.length === 0 && (
                                    <p className="text-center text-gray-500">No call history</p>
                                )}
                            </>
                        )}
                        {!callLog && (
                            <p className="text-center text-gray-500">Loading call history...</p>
                        )}

                    </div>
                </div>
    
            </div>
        </div>
    );
}
