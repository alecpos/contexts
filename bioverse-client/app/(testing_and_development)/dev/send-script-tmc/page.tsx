'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { onlySendTMCScriptToTMC } from '@/app/services/pharmacy-integration/tmc/tmc-actions';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';

export default function DevPageSendingScriptsTMC() {
    const [tmcScript, setTMCScript] = useState<TMCPrescriptionForm>();
    const [textFieldJSON, setTextFieldJSON] = useState<string>('');
    const [resultMessage, setResultMessage] = useState<JSX.Element>(<></>);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [scriptSendResult, setScriptResult] = useState<string>('');

    const parseAndSetScript = () => {
        try {
            const parsed = JSON.parse(textFieldJSON);

            setTMCScript(parsed);
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
            setLoaded(false);
        }
    };

    const sendTheScript = async () => {
        if (tmcScript) {
            const result = await onlySendTMCScriptToTMC(tmcScript);

            if (result) {
                setScriptResult(
                    `Result: ${result.result}, Reason if failure: ${result.reason}`
                );
            }
        }
    };

    return (
        <>
            <div className='flex flex-col justify-center items-center p-10 gap-4'>
                <BioType className='h2medium text-primary'>
                    Send TMC Script
                </BioType>

                <div className='flex flex-row w-full gap-4'>
                    <div className='flex flex-col w-1/4'>
                        <TextField
                            fullWidth
                            value={textFieldJSON}
                            onChange={(e) => setTextFieldJSON(e.target.value)}
                            multiline
                        ></TextField>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <Button
                            variant='contained'
                            onClick={parseAndSetScript}
                            className='py-2 px-8'
                        >
                            Set
                        </Button>
                        {resultMessage}
                    </div>

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
        </>
    );
}
