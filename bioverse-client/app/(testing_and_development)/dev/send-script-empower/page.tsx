'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { onlySendScriptToEmpower } from '@/app/services/pharmacy-integration/empower/send-script';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { empowerManualSearch } from './empower-script-search';

export default function DevPageSendingScriptsEmpower() {
    const [empowerScript, setEmpowerScript] = useState<
        EmpowerPrescriptionOrder | any
    >();
    const [textFieldJSON, setTextFieldJSON] = useState<string>('');
    const [searchFieldJSON, setSearchFieldJSON] = useState<string>('');
    const [resultMessage, setResultMessage] = useState<JSX.Element>(<></>);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [scriptSendResult, setScriptResult] = useState<string>('');

    const parseAndSetScript = () => {
        try {
            const parsed = JSON.parse(JSON.stringify(textFieldJSON));
            setEmpowerScript(parsed);
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
        if (empowerScript) {
            const result = await onlySendScriptToEmpower(empowerScript);

            if (result) {
                setScriptResult(
                    `Result: ${result.result}, Reason if failure: ${result.reason}`
                );

                console.log(result.json);
            }
        }
    };

    const searchOrderForDS = async () => {
        const result = await empowerManualSearch(searchFieldJSON);
        console.log(result);
    };

    return (
        <>
            <div className='flex flex-col justify-center items-center p-10 gap-4'>
                <BioType className='h2medium text-primary'>
                    Send Empower Script
                </BioType>

                <BioType className='itd-body'>
                    Instructions: Search order nunmber for the script you are
                    looking for. If it is tracked, then it will be shown in the
                    console.
                </BioType>

                <div className='flex flex-row w-full justify-start'>
                    <div className='flex flex-col w-1/6 gap-2'>
                        <BioType className='it-h1'>Search Order #</BioType>
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
