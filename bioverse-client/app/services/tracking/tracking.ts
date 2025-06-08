'use client';

import { trackGoogleLeadEvent, trackGooglePurchaseEvent } from './google';
import { trackMetaLead, trackMetaPurchase } from './meta';

export const trackPurchaseEvent = async (
    payload_meta: any,
    payload_google: any,
    values: any = {},
) => {
    // trackMetaPurchase(payload_meta, values);
    trackGooglePurchaseEvent(payload_google, values);
};

export const trackLeadEvent = async (payload_meta: any, values: any) => {
    // trackMetaLead(payload_meta, values);
    trackGoogleLeadEvent(values);
};
