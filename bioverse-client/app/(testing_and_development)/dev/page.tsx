'use client';

import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { devScript } from './devscripts';

export default function DevPage() {
    const [val, setVal] = useState<string>('');
    const [response, setResponse] = useState<string>('');

    const getSnacks = async () => {
        const res = await devScript();
        console.log(res);
    };

    return (
        <main className='flex justify-center flex-col items-center w-[100vw]'>
            <div className='flex flex-col justify-center items-center mt-10 w-full'>
                <TextField
                    value={val}
                    onChange={(e) => {
                        setVal(e.target.value);
                    }}
                />
                <Button onClick={getSnacks}>
                    Press for snacks (in server haha)
                </Button>

                <div className='w-[800px]'>
                    <BioType className='itd-body'>{response}</BioType>
                </div>
            </div>
        </main>
    );
}
