'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { onlySendScriptToEmpower } from '@/app/services/pharmacy-integration/empower/send-script';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { getURL } from '@/app/utils/functions/utils';
import { sendManualHallandaleScript } from '@/app/services/pharmacy-integration/hallandale/manual-hallandale-send-script';

export default function DevPageSendingScriptsHallandale() {
    const [hallandaleScript, setHallandaleScript] =
        useState<HallandaleScriptJSON>();
    const [textFieldJSON, setTextFieldJSON] = useState<string>('');
    const [searchFieldJSON, setSearchFieldJSON] = useState<string>('');
    const [resultMessage, setResultMessage] = useState<JSX.Element>(<></>);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [scriptSendResult, setScriptResult] = useState<string>('');

    const parseAndSetScript = () => {
        try {
            const parsed = JSON.parse(textFieldJSON);
            setHallandaleScript(parsed);
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
            console.log(error);
        }
    };

    const sendTheScript = async () => {
        if (hallandaleScript) {
            console.log(hallandaleScript);
            const result = await sendManualHallandaleScript(hallandaleScript);

            if (result) {
                setScriptResult(
                    `Result: ${result.status}, Reason if failure: ${result.response_content}`
                );

                console.log(result);
            }
        }
    };

    return (
        <>
            <div className='flex flex-col justify-center items-center p-10 gap-4'>
                <BioType className='h2medium text-primary'>
                    Send Hallandale Script
                </BioType>

                <BioType className='itd-body'>
                    Description: This will send the hallandale script directly
                    to hallandale and no nothing else. If you need to overwrite
                    scripts inside of the database, please do so manually. This
                    is full manual - meaning that there are no side effects or
                    database changes that occur due to this.
                </BioType>

                <div className='flex flex-row w-full justify-start'>
                    <div className='flex flex-col w-1/6 gap-2'>
                        Placeholder for Hallandale Script Search
                    </div>
                </div>

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
