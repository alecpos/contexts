import { VWO_TEST_QUESTIONNAIRES_VERSION_MAPPINGS } from '@/app/components/intake-v2/constants/route-constants';
import { AB_TESTS_IDS } from '@/app/components/intake-v2/types/intake-enumerators';
import { USStates } from '@/app/types/enums/master-enums';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { OrderType } from '@/app/types/orders/order-types';

export const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ??
        process?.env?.NEXT_PUBLIC_VERCEL_URL ??
        'http://localhost:3000';
    url = url.includes('http') ? url : `https://${url}`;
    // Remove trailing slashes using replace
    url = url.replace(/\/+$/, '');
    return url;
};

export function convertStripePriceToDollars(unitAmount: number) {
    if (typeof unitAmount !== 'number') {
        throw new Error('Unit amount must be a number');
    }
    return (unitAmount / 100).toFixed(2); // Convert cents to dollars and format to 2 decimal places
}

export function formatDateToMMDDYYYY(date: Date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

export function formatDateToMMDDYYYYFacebook(date: Date) {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
}

export function formatPhoneNumberToNumericString(phoneNumber: string) {
    return phoneNumber.replace(/\D/g, '');
}

export function extractRenewalOrderId(renewal_order_id: string) {
    const [firstPart, secondPart] = renewal_order_id.split('-').map(Number);
    return [firstPart, secondPart];
}

export function getOrderTypeFromOrderId(order_id: string) {
    if (order_id.includes('-')) {
        return OrderType.RenewalOrder;
    }
    return OrderType.Order;
}

export function getActiveVWOTestIDForQuestionnaire(
    vwo_test_ids: string[],
    product_href: PRODUCT_HREF,
) {
    // Filter test IDs that exist in the mapping for the given product

    const matchedTestIds = vwo_test_ids.filter(
        (test_id) =>
            VWO_TEST_QUESTIONNAIRES_VERSION_MAPPINGS[
                product_href as PRODUCT_HREF
            ]?.[test_id as AB_TESTS_IDS] !== undefined,
    );

    if (matchedTestIds.length >= 1) {
        return matchedTestIds[0] as AB_TESTS_IDS;
    } else {
        return null;
    }
}

export function getVersionForActiveVWOTestID(
    vwo_test_id: AB_TESTS_IDS,
    product_href: PRODUCT_HREF,
) {
    const version =
        VWO_TEST_QUESTIONNAIRES_VERSION_MAPPINGS[product_href]?.[vwo_test_id];

    return version;
}

// Returns an array of the strings in arr1 that exist in arr2 sorted
export function getCommonStringsSorted(
    arr1: string[],
    arr2: string[],
): string[] {
    const set2 = new Set(arr2);
    return arr1.filter((str) => set2.has(str)).sort();
}
