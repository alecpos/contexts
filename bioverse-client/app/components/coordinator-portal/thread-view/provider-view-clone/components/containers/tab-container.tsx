'use client';
import { Paper } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import TabsDisplay from '../tab-column/tabs-display';
import DisplayOptions from '../tab-column/display-options';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { getUserName } from '@/app/utils/database/controller/profiles/profiles';

interface TabColumnProps {
    patient_data: DBPatientData;
    tabSelected: string;
    setTabSelected: React.Dispatch<React.SetStateAction<string>>;
    macroDestination: string;
    setMacroDestination: Dispatch<SetStateAction<string>>;
    messageContent: string;
    setMessageContent: Dispatch<SetStateAction<string>>;
}
export default function TabColumn({
    patient_data,
    tabSelected,
    setTabSelected,
    macroDestination,
    setMacroDestination,
    messageContent,
    setMessageContent,
}: TabColumnProps) {
    const [providerId, setProviderId] = useState<string>('');

    const [userFirstName, setUserFirstName] = useState<string>('');
    const [userLastName, setUserLastName] = useState<string>('');

    useEffect(() => {
        (async () => {
            const user_id = (await readUserSession()).data.session?.user.id;
            const { first_name, last_name } = await getUserName(user_id!);

            setUserFirstName(first_name);
            setUserLastName(last_name);
            setProviderId(user_id!);
        })();
    }, []);

    return (
        <div className={`flex flex-col w-full gap-2 h-full`}>
            <TabsDisplay
                tabSelected={tabSelected}
                setTabSelected={setTabSelected}
            />

            <div className='flex flex-col flex-grow min-h-0 relative'>
                <div className='flex-grow overflow-y-auto'>
                    <DisplayOptions
                        selected={tabSelected}
                        patient_data={patient_data}
                        providerId={providerId}
                        userFirstName={userFirstName}
                        userLastName={userLastName}
                        messageContent={messageContent}
                        setMessageContent={setMessageContent}
                        setTabSelected={setTabSelected}
                        macroDestination={macroDestination}
                        setMacroDestination={setMacroDestination}
                    />
                </div>
            </div>
        </div>
    );
}
