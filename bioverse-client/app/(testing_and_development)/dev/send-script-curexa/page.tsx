'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { sendManualCurexaScript } from '@/app/services/pharmacy-integration/curexa/curexa-actions';
import { onlySendTMCScriptToTMC } from '@/app/services/pharmacy-integration/tmc/tmc-actions';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import {
    curexaManualSearch,
    mimicCurexaSendingScriptAcceptingDSStatusData,
} from './curexa-script-functions';

export default function DevPageSendingScriptsTMC() {
    const [curexaScript, setCurexaScript] =
        useState<DoseSpotStatusPrescriptionData>();
    const [searchFieldJSON, setSearchFieldJSON] = useState<string>('');
    const [textFieldJSON, setTextFieldJSON] = useState<string>('');
    const [resultMessage, setResultMessage] = useState<JSX.Element>(<></>);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [scriptSendResult, setScriptResult] = useState<string>('');

    const parseAndSetScript = () => {
        setResultMessage(<></>);
        setScriptResult('');
        setLoaded(false);

        try {
            const jsonData = JSON.parse(textFieldJSON);

            const statusUpdateData: DoseSpotStatusPrescriptionData = {
                patient_id: jsonData.Data.PatientId,
                clinic_id: jsonData.Data.ClinicId,
                clinician_id: jsonData.Data.ClinicianId,
                agent_id: jsonData.Data.AgentId,
                prescription_id: jsonData.Data.PrescriptionId,
                related_rx_request_queue_item_id:
                    jsonData.Data.RelatedRxRequestQueueItemId,
                prescription_status: jsonData.Data.PrescriptionStatus,
                status_date_time: jsonData.Data.StatusDateTime,
                status_details: jsonData.Data.StatusDetails,
                // Add any additional fields as needed
            };

            setCurexaScript(statusUpdateData);
            setResultMessage(
                <>
                    <BioType className='body1 text-green-500'>Success</BioType>
                </>
            );
            setLoaded(true);
        } catch (error) {
            setResultMessage(
                <>
                    <BioType className='body1 text-red-500'>Failure</BioType>
                </>
            );
            console.log(error);
            setLoaded(false);
        }
    };

    const sendTheScript = async () => {
        if (curexaScript) {
            const result = await mimicCurexaSendingScriptAcceptingDSStatusData(
                JSON.stringify(curexaScript)
            );

            if (result) {
                setScriptResult(
                    `Result: ${result.result} | Reason if failure: ${result.reason}`
                );
            }
        }
    };

    const searchOrderForDS = async () => {
        const result = await curexaManualSearch(searchFieldJSON);
        console.log(result);
    };

    return (
        <>
            <div className='flex flex-col justify-center items-center p-10 gap-4'>
                <BioType className='h2medium text-primary'>
                    Send Curexa Script
                </BioType>

                <BioType className='it-body'>
                    Instructions: Paste DoseSpot Status 13 notification for
                    Curexa Order Patient. Use the search to find console logs of
                    the status notifications. The order_status of the patient
                    must be in Payment-Completed
                </BioType>

                <div className='flex flex-row w-full justify-start'>
                    <div className='flex flex-col w-1/6 gap-2'>
                        <BioType className='it-h1'>Search DoseSpot ID</BioType>
                        <TextField
                            fullWidth
                            value={searchFieldJSON}
                            onChange={(e) => setSearchFieldJSON(e.target.value)}
                            multiline
                        ></TextField>
                        <Button
                            size='small'
                            variant='outlined'
                            onClick={searchOrderForDS}
                            className='py-2 px-8'
                        >
                            Search
                        </Button>
                    </div>
                </div>

                <div className='flex flex-row w-full gap-4'>
                    <div className='flex flex-col w-[75%] gap-2'>
                        <BioType className='it-h1'>Script:</BioType>

                        <div className='flex flex-row gap-2'>
                            <TextField
                                fullWidth
                                value={textFieldJSON}
                                onChange={(e) =>
                                    setTextFieldJSON(e.target.value)
                                }
                                multiline
                            ></TextField>
                            <div className='flex flex-col'>
                                <Button
                                    variant='contained'
                                    onClick={parseAndSetScript}
                                    className='py-2 px-8'
                                >
                                    Set
                                </Button>
                                {resultMessage}
                                {loaded && (
                                    <div>
                                        <Button
                                            variant='contained'
                                            color='success'
                                            onClick={sendTheScript}
                                            className='py-2 px-8'
                                        >
                                            Send script
                                        </Button>
                                        <BioType className='body1'>
                                            {scriptSendResult}
                                        </BioType>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
