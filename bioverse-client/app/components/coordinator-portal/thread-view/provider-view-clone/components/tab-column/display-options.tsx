'use client';
import React, { Dispatch, SetStateAction } from 'react';
import MessageDisplay from './message/message-display';
import MacrosDisplay from './macros/macros-display';

interface TabDisplayOptionsProps {
    selected: string;
    patient_data: DBPatientData;
    providerId: string;
    userFirstName: string;
    userLastName: string;
    setTabSelected: React.Dispatch<React.SetStateAction<string>>;
    messageContent: string;
    setMessageContent: Dispatch<SetStateAction<string>>;
    macroDestination: string;
    setMacroDestination: Dispatch<SetStateAction<string>>;
}
const TabDisplayOptions = ({
    selected,
    patient_data,
    providerId,
    userFirstName,
    userLastName,
    setTabSelected,
    messageContent,
    setMessageContent,
    macroDestination,
    setMacroDestination,
}: TabDisplayOptionsProps) => {
    switch (selected) {
        case 'messages':
            return (
                <MessageDisplay
                    patient_data={patient_data}
                    providerId={providerId}
                    userFirstName={userFirstName}
                    userLastName={userLastName}
                    setTabSelected={setTabSelected}
                    messageContent={messageContent}
                    setMessageContent={setMessageContent}
                    setMacroDestination={setMacroDestination}
                />
            );
        case 'macros':
            return (
                <MacrosDisplay
                    setTabSelected={setTabSelected}
                    setMessageContent={setMessageContent}
                    macroDestination={macroDestination}
                />
            );

        default:
            return <></>;
    }
};

export default TabDisplayOptions;
