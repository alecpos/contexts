'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import useSWR from 'swr';
import { getProfileDataForProviderLookup } from '@/app/utils/database/controller/profiles/profiles';
import { usePathname, useRouter } from 'next/navigation';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

const DynamicInfoTabContent = dynamic(
    () => import('./tab-components/info/info-content'),
    {
        loading: () => <LoadingScreen />,
    },
);
const DynamicOrderTabContent = dynamic(
    () => import('./tab-components/orders/order-content'),
    {
        loading: () => <LoadingScreen />,
    },
);
const DynamicSubscriptionTabContent = dynamic(
    () => import('./tab-components/subscriptions/subscription-content'),
    {
        loading: () => <LoadingScreen />,
    },
);
const DynamicIntakesTabContent = dynamic(
    () => import('./tab-components/intakes/intakes-content'),
    {
        loading: () => <LoadingScreen />,
    },
);
const DynamicClinicalNotesTabContent = dynamic(
    () => import('./tab-components/clinical-notes/clinical-notes-tab'),
    {
        loading: () => <LoadingScreen />,
    },
);
const DynamicInternalNotesTabContent = dynamic(
    () => import('./tab-components/internal-notes/internal-notes-tab'),
    {
        loading: () => <LoadingScreen />,
    },
);
const DynamicInvoiceTabContent = dynamic(
    () => import('./tab-components/invoices/invoice-content'),
    {
        loading: () => <LoadingScreen />,
    },
);

const DynamicDocumentsTabContent = dynamic(
    () => import('./tab-components/documents/documents-content'),
    {
        loading: () => <LoadingScreen />,
    },
);

const DynamicEscalationsTabContent = dynamic(
    () =>
        import('./tab-components/escalations/escalations-allpatients-content'),
    {
        loading: () => <LoadingScreen />,
    },
);

const DynamicMessagesTabContent = dynamic(
    () =>
        import(
            './tab-components/messages/components/messages-allpatients-content'
        ),
    {
        loading: () => <LoadingScreen />,
    },
);

const DynamicPatientHistoryLogsContent = dynamic(
    () => import('./tab-components/patient-history-logs/patient-history-logs'),
    {
        loading: () => <LoadingScreen />,
    },
);

const CustomPrescriptionScriptContent = dynamic(
    () =>
        import(
            './tab-components/custom-prescription-script/custom-prescription-script'
        ),
    {
        loading: () => <LoadingScreen />,
    },
);

const DynamicCallsContent = dynamic(
    () => import('./tab-components/calls/ringcentral-component'),
    {
        loading: () => <LoadingScreen />,
    },
);

interface PatientInfoContainer {
    access_type: BV_AUTH_TYPE | null;
    patient_id: string;
    current_tab_index: number | undefined;
    user_id: string;
}

export default function PatientInformationContainer({
    patient_id,
    access_type,
    current_tab_index,
    user_id,
}: PatientInfoContainer) {
    const {
        data: profile_data,
        isLoading,
        error,
    } = useSWR(`${patient_id}-all-patient-data`, () =>
        getProfileDataForProviderLookup(patient_id),
    );

    const router = useRouter();

    const [activeTab, setActiveTab] = useState(current_tab_index ?? 0);
    const url = usePathname();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        //Setting tab into search params
        router.push(`${url}?tab=${newValue}`);
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!profile_data || !profile_data.data || error) {
        return <>There was an issue, please refresh the page.</>;
    }

    return (
        <>
            <div className="flex flex-col w-full items-center justify-center">
                <div className="flex flex-col self-start">
                    <BioType className="h3">
                        <span className="text-primary">
                            Patient: {profile_data.data.first_name}{' '}
                            {profile_data.data.last_name}
                        </span>
                    </BioType>
                </div>
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        width: '100%',
                    }}
                >
                    <Tabs
                        variant="scrollable"
                        scrollButtons="auto"
                        value={activeTab}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        <Tab label="Info" />
                        <Tab label="Orders" />
                        <Tab label="Subscriptions" />
                        <Tab label="Intakes" />
                        <Tab label="Clinical Notes" />
                        <Tab label="Internal Notes" />
                        <Tab label="Invoices" />
                        <Tab label="Documents" />
                        <Tab label="Escalations" />
                        <Tab label="Messages" />
                        <Tab label="Patient History Logs" />
                        <Tab label="Custom Prescription" />
                        <Tab label="Calls" />
                    </Tabs>
                </Box>
                <CustomTabPanel
                    value={activeTab}
                    index={0}
                    data={profile_data.data}
                    access_type={access_type}
                    user_id={user_id}
                    handleChange={handleChange}
                />
                <CustomTabPanel
                    value={activeTab}
                    index={1}
                    data={profile_data.data}
                    access_type={access_type}
                    user_id={user_id}
                />
                <CustomTabPanel
                    value={activeTab}
                    index={2}
                    data={profile_data.data}
                    access_type={access_type}
                    user_id={user_id}
                />
                <CustomTabPanel
                    value={activeTab}
                    index={3}
                    data={profile_data.data}
                    access_type={access_type}
                    user_id={user_id}
                />
                <CustomTabPanel
                    value={activeTab}
                    index={4}
                    data={profile_data.data}
                    access_type={access_type}
                    user_id={user_id}
                />
                <CustomTabPanel
                    value={activeTab}
                    index={5}
                    data={profile_data.data}
                    access_type={access_type}
                    user_id={user_id}
                />
                <CustomTabPanel
                    value={activeTab}
                    index={6}
                    data={profile_data.data}
                    access_type={access_type}
                    user_id={user_id}
                />
                <CustomTabPanel
                    value={activeTab}
                    index={7}
                    data={profile_data.data}
                    access_type={access_type}
                    user_id={user_id}
                />
                <CustomTabPanel
                    value={activeTab}
                    index={8}
                    data={profile_data.data}
                    access_type={access_type}
                    user_id={user_id}
                />
                <CustomTabPanel
                    value={activeTab}
                    index={9}
                    data={profile_data.data}
                    access_type={access_type}
                    user_id={user_id}
                />
                <CustomTabPanel
                    value={activeTab}
                    index={10}
                    data={profile_data.data}
                    access_type={access_type}
                    user_id={user_id}
                />
                <CustomTabPanel
                    value={activeTab}
                    index={11}
                    data={profile_data.data}
                    access_type={access_type}
                    user_id={user_id}
                />
                <CustomTabPanel
                    value={activeTab}
                    index={12}
                    data={profile_data.data}
                    access_type={access_type}
                    user_id={user_id}
                />
            </div>
        </>
    );
}

interface TabPanelProps {
    index: number;
    value: number;
    data: any;
    access_type: BV_AUTH_TYPE | null;
    user_id: string;
    handleChange?: (event: React.SyntheticEvent, newValue: number) => void;
}
function CustomTabPanel({
    index,
    value,
    data,
    access_type,
    user_id,
    handleChange,
}: TabPanelProps) {
    let content;
    console.log(value);
    switch (value) {
        case 0:
            content = (
                <DynamicInfoTabContent
                    profile_data={data}
                    access_type={access_type}
                    handleChange={handleChange}
                />
            );
            break;
        case 1:
            content = (
                <DynamicOrderTabContent
                    profile_data={data}
                    access_type={access_type}
                />
            );
            break;
        case 2:
            content = (
                <DynamicSubscriptionTabContent
                    profile_data={data}
                    access_type={access_type}
                />
            );
            break;
        case 3:
            content = (
                <DynamicIntakesTabContent
                    profile_data={data}
                    access_type={access_type}
                />
            );
            break;
        case 4:
            content = (
                <DynamicClinicalNotesTabContent
                    profile_data={data}
                    access_type={access_type}
                />
            );
            break;
        case 5:
            content = (
                <DynamicInternalNotesTabContent
                    profile_data={data}
                    access_type={access_type}
                />
            );
            break;
        case 6:
            content = (
                <>
                    <DynamicInvoiceTabContent
                        profile_data={data}
                        access_type={access_type}
                    />
                </>
            );
            break;
        case 7:
            content = (
                <DynamicDocumentsTabContent
                    profile_data={data}
                    access_type={access_type}
                />
            );
            break;
        case 8:
            content = (
                <DynamicEscalationsTabContent
                    profile_data={data}
                    access_type={access_type}
                />
            );
            break;
        case 9:
            content = (
                <DynamicMessagesTabContent
                    profile_data={data}
                    access_type={access_type}
                />
            );
            break;
        case 10:
            content = (
                <DynamicPatientHistoryLogsContent
                    profile_data={data}
                    access_type={access_type}
                />
            );
            break;
        case 11:
            content = (
                <CustomPrescriptionScriptContent
                    profile_data={data}
                    access_type={access_type}
                    user_id={user_id}
                />
            );
            break;
        case 12:
            content = (
                <DynamicCallsContent
                    profile_data={data}
                    access_type={access_type}
                />
            );
            break;
        default:
            content = <div>Default Content</div>;
    }

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            className="flex justify-center w-full"
        >
            {value === index && <>{content}</>}
        </div>
    );
}
