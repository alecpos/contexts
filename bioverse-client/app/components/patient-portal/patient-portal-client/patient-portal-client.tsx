'use client';
import AccountInformationDisplay from '@/app/components/patient-portal/account-information/personal-information/account-information-display';
import ProtectedHealthInformationDownload from '@/app/components/patient-portal/account-information/phi-download-component';
import PrescriberInformationDisplay from '@/app/components/patient-portal/account-information/prescriberinformation';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SubscriptionListItem } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import { CircularProgress } from '@mui/material';

interface Props {
    userIDProp: string;
    userProviderProp: string | undefined;
    personalDataProp: AccountNameEmailPhoneData | undefined;
    licenseDataProp: LicenseData;
    shippingDataProp: ShippingInformation;
    activeSubscriptions: SubscriptionListItem[];
    last4: string;
    stripeCustomerId: string;
}

export default function PatientPortalClientComponent({
    userIDProp,
    userProviderProp,
    personalDataProp,
    licenseDataProp,
    shippingDataProp,
    activeSubscriptions,
    last4,
    stripeCustomerId,
}: Props) {
    const [personalData, setPersonalData] =
        useState<AccountNameEmailPhoneData>();
    const [shippingData, setShippingData] = useState<ShippingInformation>();
    const [licenseData, setLicenseData] =
        useState<LicenseData>(licenseDataProp);
    const [userProvider, setUserProvider] = useState<string>();
    const [userID, setUserID] = useState<string>();
    const [loading, setLoading] = useState(true); // Add loading state

    const router = useRouter();
    const path = usePathname();

    useEffect(() => {
        setUserID(userIDProp);

        if (userProviderProp) {
            setUserProvider(userProviderProp);
        }

        if (personalDataProp) {
            setPersonalData(personalDataProp);
        }

        if (shippingDataProp) {
            setShippingData(shippingDataProp);
        }

        // Assuming all data is fetched here, set loading to false
        setLoading(false);
    }, [userIDProp, userProviderProp, personalDataProp, shippingDataProp]);

    // Conditionally render based on loading state
    if (loading) {
        return <div className='h-screen w-full bg-[#f9f9f9]'></div>;
    }

    return (
        <>
            <div className='flex justify-center'>
                <div className='sm:min-w-[700px] max-w-[800px]'>
                    <AccountInformationDisplay
                        userProvider={userProvider}
                        personalData={personalData}
                        licenseData={licenseData}
                        userID={userID}
                        setPersonalData={setPersonalData}
                        activeSubscriptions={activeSubscriptions}
                        last4={last4}
                        stripeCustomerId={stripeCustomerId}
                    />
                </div>
            </div>
        </>
    );
}
