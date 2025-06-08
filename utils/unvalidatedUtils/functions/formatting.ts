import {
    PRODUCT_HREF,
    PRODUCT_NAME,
} from '@/app/types/global/product-enumerator';
import { SubscriptionCadency } from '@/app/types/renewal-orders/renewal-orders-types';

export function getFormattedCadence(cadence: string | SubscriptionCadency) {
    switch (cadence) {
        case SubscriptionCadency.Monthly:
            return 'Monthly';
        case SubscriptionCadency.Quarterly:
            return 'Quarterly';
        case SubscriptionCadency.Bimonthly:
            return 'Bimonthly';
        case SubscriptionCadency.OneTime:
            return 'One-Time';
        case SubscriptionCadency.Pentamonthly:
            return 'Pentamonthly';
        case SubscriptionCadency.Biannually:
            return 'Biannually';
        case SubscriptionCadency.Annually:
            return 'Annually';
        default:
            return 'Unknown';
    }
}

export function formatDateNonAsync(isoDateString: string | Date) {
    const date = new Date(isoDateString);
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // the hour '0' should be '12'
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${monthNames[monthIndex]} ${day}, ${year}`;
}

export function formatDateFullMonth(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}

export function getProductName(href: string): string {
    const productMap: Record<string, string> = {
        [PRODUCT_HREF.NAD_INJECTION]: PRODUCT_NAME.NAD_INJECTION,
        [PRODUCT_HREF.NAD_NASAL_SPRAY]: PRODUCT_NAME.NAD_NASAL_SPRAY,
        [PRODUCT_HREF.NAD_PATCHES]: PRODUCT_NAME.NAD_PATCHES,
        [PRODUCT_HREF.OZEMPIC]: PRODUCT_NAME.OZEMPIC,
        [PRODUCT_HREF.WEGOVY]: PRODUCT_NAME.WEGOVY,
        [PRODUCT_HREF.TIRZEPATIDE]: PRODUCT_NAME.TIRZEPATIDE,
        [PRODUCT_HREF.CGM_SENSOR]: PRODUCT_NAME.CGM_SENSOR,
        [PRODUCT_HREF.METFORMIN]: PRODUCT_NAME.METFORMIN,
        [PRODUCT_HREF.ACARBOSE]: PRODUCT_NAME.ACARBOSE,
        [PRODUCT_HREF.TELMISARTAN]: PRODUCT_NAME.TELMISARTAN,
        [PRODUCT_HREF.ATORVASTATIN]: PRODUCT_NAME.ATORVASTATIN,
        [PRODUCT_HREF.RAPAMYCIN]: PRODUCT_NAME.RAPAMYCIN,
        [PRODUCT_HREF.B12_INJECTION]: PRODUCT_NAME.B12_INJECTION,
        [PRODUCT_HREF.B12_MIC_INJECTION]: PRODUCT_NAME.B12_MIC_INJECTION,
        [PRODUCT_HREF.GLUTATIONE_INJECTION]: PRODUCT_NAME.GLUTATIONE_INJECTION,
        [PRODUCT_HREF.GLUTATHIONE_NASAL_SPRAY]:
            PRODUCT_NAME.GLUTATHIONE_NASAL_SPRAY,
        [PRODUCT_HREF.GLUTATHIONE_PATCHES]: PRODUCT_NAME.GLUTATHIONE_PATCHES,
        [PRODUCT_HREF.LOW_DOSE_NALTREXONE]: PRODUCT_NAME.LOW_DOSE_NALTREXONE,
        [PRODUCT_HREF.FINASTERIDE_AND_MINOXIDIL]:
            PRODUCT_NAME.FINASTERIDE_AND_MINOXIDIL,
        [PRODUCT_HREF.TADALAFIL_DAILY]: PRODUCT_NAME.TADALAFIL_DAILY,
        [PRODUCT_HREF.TADALAFIL_AS_NEEDED]: PRODUCT_NAME.TADALAFIL_AS_NEEDED,
        [PRODUCT_HREF.NAD_FACE_CREAM]: PRODUCT_NAME.NAD_FACE_CREAM,
        [PRODUCT_HREF.TRETINOIN]: PRODUCT_NAME.TRETINOIN,
        [PRODUCT_HREF.MOUNJARO]: PRODUCT_NAME.MOUNJARO,
        [PRODUCT_HREF.SEMAGLUTIDE]: PRODUCT_NAME.SEMAGLUTIDE,
        [PRODUCT_HREF.ZEPBOUND]: PRODUCT_NAME.ZEPBOUND,
        [PRODUCT_HREF.WEIGHT_LOSS]: PRODUCT_NAME.WEIGHT_LOSS,
        [PRODUCT_HREF.OZEMPIC_TEST]: PRODUCT_NAME.OZEMPIC_TEST,
    };

    const productName = productMap[href];

    if (!productName) {
        return 'Unknown';
    }
    return productName;
}
