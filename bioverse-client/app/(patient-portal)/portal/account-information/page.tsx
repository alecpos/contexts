'use server';

import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { redirect } from 'next/navigation';
import { getLicenseOrSelfieURL } from '@/app/utils/actions/membership/membership-portal-actions';
import { getAccountProfileData } from '@/app/utils/database/controller/profiles/profiles';
import { getSubscriptionHistory } from '@/app/utils/actions/membership/order-history-actions';
import { categorizeSubscriptions } from '@/app/utils/functions/patient-portal/patient-portal-utils';
import { fetchDefaultCardForCustomer } from '@/app/services/stripe/customer';
import PatientPortalClientComponent from '@/app/components/patient-portal/patient-portal-client/patient-portal-client';

interface Props {}

export default async function Page({}: Props) {
    try {
        const { data: activeSession } = await readUserSession();
        if (!activeSession.session) {
            return redirect(
                '/login?originalRef=%2Fportal%2Faccount-information'
            );
        }

        const userId = activeSession.session.user.id;
        const userProvider = activeSession.session.user.app_metadata.provider;

        const accountProfileData = await getAccountProfileData(userId);
        if (!accountProfileData) {
            throw new Error('Account profile data not found');
        }

        const personalData: AccountNameEmailPhoneData = {
            first_name: accountProfileData.first_name,
            last_name: accountProfileData.last_name,
            email: activeSession.session.user.email!, // Email from session data
            phone_number: accountProfileData.phone_number,
            date_of_birth: accountProfileData.date_of_birth,
        };

        const shippingData: ShippingInformation = {
            address_line1: accountProfileData.address_line1,
            address_line2: accountProfileData.address_line2,
            city: accountProfileData.city,
            state: accountProfileData.state,
            zip: accountProfileData.zip,
        };

        const subscriptionData = await getSubscriptionHistory(userId);
        const formattedOrderData = categorizeSubscriptions(subscriptionData);

        const { last4, stripeCustomerId } = await fetchDefaultCardForCustomer(
            userId
        );

        const urlToRetrieveLicenseFrom = `${userId}/${accountProfileData.license_photo_url}`;
        const { data: licenseUrl, error: licenseError } =
            await getLicenseOrSelfieURL(urlToRetrieveLicenseFrom);

        const urlToRetrieveSelfieFrom = `${userId}/${accountProfileData.selfie_photo_url}`;
        const { data: selfieUrl, error: selfieError } =
            await getLicenseOrSelfieURL(urlToRetrieveSelfieFrom);

        const licenseData: LicenseData = {
            license: licenseError ? '' : licenseUrl.signedUrl,
            selfie: selfieError ? '' : selfieUrl.signedUrl,
        };

        return (
            <PatientPortalClientComponent
                userIDProp={userId}
                userProviderProp={userProvider}
                personalDataProp={personalData}
                shippingDataProp={shippingData}
                licenseDataProp={licenseData}
                activeSubscriptions={formattedOrderData.active}
                last4={last4}
                stripeCustomerId={stripeCustomerId}
            />
        );
    } catch (error) {
        console.error(error);
        throw new Error(String(error));
    }
}
