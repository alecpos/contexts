import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

export const WEGOVY_PRODUCT_HREF = 'wegovy';
export const ACARBOSE_PRODUCT_HREF = 'acarbose';
export const TELMISARTAN_PRODUCT_HREF = 'telmisartan';
export const METFORMIN_PRODUCT_HREF = 'metformin';
export const OZEMPIC_PRODUCT_HREF = 'ozempic';
export const TIRZEPATIDE_PRODUCT_HREF = 'tirzepatide';
export const FINASTERINE_AND_MINOXIDIL_SPRAY_PRODUCT_HREF =
    'finasterine-and-minoxidil-spray';
export const NAD_FACE_CREAM_PRODUCT_HREF = 'nad-face-cream';
export const ATORVASTATIN_PRODUCT_HREF = 'atorvastatin';
export const RAPAMYCIN_PRODUCT_HREF = 'rapamycin';
export const ANTI_AGING_CREAM_PRODUCT_HREF = 'tretinoin';
export const MOUNJARO_PRODUCT_HREF = 'mounjaro';
export const NAD_INJECTION_PRODUCT_HREF = 'nad-injection';
export const CGM_SENSOR_PRODUCT_HREF = 'cgm-sensor';
export const GLUTATHIONE_INJECTION_PRODUCT_HREF = 'glutathione-injection';
export const LOW_DOSE_NALTREXONE_PRODUCT_HREF = 'low-dose-naltrexone';
export const B12_MIC_INJECTION_PRODUCT_HREF = 'b12-mic-injection';
export const SEMAGLUTIDE_PRODUCT_HREF = 'semaglutide';
export const TADALAFIL_AS_NEEDED_PRODUCT_HREF = 'tadalafil-as-needed';
export const TADALAFIL_DAILY_PRODUCT_HREF = 'tadalafil-daily';
export const GLUTATHIONE_NASAL_SPRAY_PRODUCT_HREF = 'glutathione-nasal-spray';
export const NAD_PATCHES_PRODUCT_HREF = 'nad-patches';
export const GLUTATHIONE_PATCHES_PRODUCT_HREF = 'glutathione-patches';
export const B12_INJECTION_PRODUCT_HREF = 'b12-injection';
export const NAD_NASAL_SPRAY_PRODUCT_HREF = 'nad-nasal-spray';
export const GLP1_PRODUCT_HREF = 'glp1';
export const COMBINED_WEIGHTLOSS_PRODUCT_HREF = 'weight-loss';

export const ALL_PRODUCT_HREFS = [
    WEGOVY_PRODUCT_HREF,
    ACARBOSE_PRODUCT_HREF,
    TELMISARTAN_PRODUCT_HREF,
    METFORMIN_PRODUCT_HREF,
    OZEMPIC_PRODUCT_HREF,
    TIRZEPATIDE_PRODUCT_HREF,
    FINASTERINE_AND_MINOXIDIL_SPRAY_PRODUCT_HREF,
    NAD_FACE_CREAM_PRODUCT_HREF,
    ATORVASTATIN_PRODUCT_HREF,
    RAPAMYCIN_PRODUCT_HREF,
    ANTI_AGING_CREAM_PRODUCT_HREF,
    MOUNJARO_PRODUCT_HREF,
    NAD_INJECTION_PRODUCT_HREF,
    CGM_SENSOR_PRODUCT_HREF,
    GLUTATHIONE_INJECTION_PRODUCT_HREF,
    LOW_DOSE_NALTREXONE_PRODUCT_HREF,
    B12_MIC_INJECTION_PRODUCT_HREF,
    SEMAGLUTIDE_PRODUCT_HREF,
    TADALAFIL_AS_NEEDED_PRODUCT_HREF,
    TADALAFIL_DAILY_PRODUCT_HREF,
    GLUTATHIONE_NASAL_SPRAY_PRODUCT_HREF,
    NAD_PATCHES_PRODUCT_HREF,
    GLUTATHIONE_PATCHES_PRODUCT_HREF,
    B12_INJECTION_PRODUCT_HREF,
    NAD_NASAL_SPRAY_PRODUCT_HREF,
    PRODUCT_HREF.WL_CAPSULE,
];

export const NON_WL_PRODUCT_HREFS = [
    ACARBOSE_PRODUCT_HREF,
    TELMISARTAN_PRODUCT_HREF,
    FINASTERINE_AND_MINOXIDIL_SPRAY_PRODUCT_HREF,
    NAD_FACE_CREAM_PRODUCT_HREF,
    ATORVASTATIN_PRODUCT_HREF,
    RAPAMYCIN_PRODUCT_HREF,
    ANTI_AGING_CREAM_PRODUCT_HREF,
    NAD_INJECTION_PRODUCT_HREF,
    CGM_SENSOR_PRODUCT_HREF,
    GLUTATHIONE_INJECTION_PRODUCT_HREF,
    LOW_DOSE_NALTREXONE_PRODUCT_HREF,
    B12_MIC_INJECTION_PRODUCT_HREF,
    TADALAFIL_AS_NEEDED_PRODUCT_HREF,
    TADALAFIL_DAILY_PRODUCT_HREF,
    GLUTATHIONE_NASAL_SPRAY_PRODUCT_HREF,
    NAD_PATCHES_PRODUCT_HREF,
    GLUTATHIONE_PATCHES_PRODUCT_HREF,
    B12_INJECTION_PRODUCT_HREF,
    NAD_NASAL_SPRAY_PRODUCT_HREF,
];

export const SEMAGLUTIDE_NAME = 'Compounded Semaglutide';
export const TIRZEPATIDE_NAME = 'Compounded Tirzepatide';
export const WEGOVY_NAME = 'Wegovy® (Semaglutide)';
export const OZEMPIC_ANSWER_NAME = 'Ozempic® (Semaglutide)';

export const GOOGLE_TAG_ID = 'AW-11451984329';

export const GoogleTagMappings = {
    [WEGOVY_PRODUCT_HREF]: (subscriptionType: string) => {
        return WEGOVY_SUBSCRIPTION.destination;
    },
    [ACARBOSE_PRODUCT_HREF]: (subscriptionType: string) => {
        return ACARBOSE_SUBSCRIPTION.destination;
    },
    [TELMISARTAN_PRODUCT_HREF]: (subscriptionType: string) => {
        return TELMISARTAN_SUBSCRIPTION.destination;
    },
    [METFORMIN_PRODUCT_HREF]: (subscriptionType: string) => {
        return METFORMIN_SUBSCRIPTION.destination;
    },
    [OZEMPIC_PRODUCT_HREF]: (subscriptionType: string) => {
        return OZEMPIC_SUBSCRIPTION.destination;
    },
    [TIRZEPATIDE_PRODUCT_HREF]: (subscriptionType: string) => {
        return TIRZEPATIDE_SUBSCRIPTION.destination;
    },
    [FINASTERINE_AND_MINOXIDIL_SPRAY_PRODUCT_HREF]: (
        subscriptionType: string,
    ) => {
        return FINASTERINE_MINOXIDIL_SPRAY_SUBSCRIPTION.destination;
    },
    [NAD_FACE_CREAM_PRODUCT_HREF]: (subscriptionType: string) => {
        if (subscriptionType === 'one_time') {
            return NAD_FACE_CREAM_ONE_TIME.destination;
        }
        return NAD_FACE_CREAM_SUBSCRIPTION.destination;
    },
    [ATORVASTATIN_PRODUCT_HREF]: (subscriptionType: string) => {
        // TODO: Add one_time here
        return ATORVASTATIN_SUBSCRIPTION.destination;
    },
    [RAPAMYCIN_PRODUCT_HREF]: (subscriptionType: string) => {
        return RAPAMYCIN_SUBSCRIPTION.destination;
    },
    [ANTI_AGING_CREAM_PRODUCT_HREF]: (subscriptionType: string) => {
        if (subscriptionType === 'one_time') {
            return TRETINOIN_ONE_TIME.destination;
        }
        return TRETINOIN_SUBSCRIPTION.destination;
    },
    [MOUNJARO_PRODUCT_HREF]: (subscriptionType: string) => {
        return MOUNJARO_SUBSCRIPTION.destination;
    },
    [NAD_INJECTION_PRODUCT_HREF]: (subscriptionType: string) => {
        if (subscriptionType === 'one_time') {
            return NAD_INJECTION_ONE_TIME.destination;
        }
        return NAD_INJECTION_SUBSCRIPTION.destination;
    },
    [CGM_SENSOR_PRODUCT_HREF]: (subscriptionType: string) => {
        if (subscriptionType === 'one_time') {
            return CGM_SENSOR_ONE_TIME.destination;
        }
        return CGM_SENSOR_SUBSCRIPTION.destination;
    },
    [GLUTATHIONE_INJECTION_PRODUCT_HREF]: (subscriptionType: string) => {
        if (subscriptionType === 'one_time') {
            return GLUTATHIONE_INJECTION_ONE_TIME.destination;
        }
        return GLUTATHIONE_INJECTION_SUBSCRIPTION.destination;
    },
    [LOW_DOSE_NALTREXONE_PRODUCT_HREF]: (subscriptionType: string) => {
        return LOW_DOSE_NALTREXONE_SUBSCRIPTION.destination;
    },
    [B12_MIC_INJECTION_PRODUCT_HREF]: (subscriptionType: string) => {
        return B12_MIC_INJECTION_SUBSCRIPTION.destination;
    },
    [SEMAGLUTIDE_PRODUCT_HREF]: (subscriptionType: string) => {
        return SEMAGLUTIDE_SUBSCRIPTION.destination;
    },
    [TADALAFIL_AS_NEEDED_PRODUCT_HREF]: (subscriptionType: string) => {
        return TADALAFIL_AS_NEEDED_SUBSCRIPTION.destination;
    },
    [TADALAFIL_DAILY_PRODUCT_HREF]: (subscriptionType: string) => {
        return TADALAFIL_DAILY_SUBSCRIPTION.destination;
    },
    [GLUTATHIONE_NASAL_SPRAY_PRODUCT_HREF]: (subscriptionType: string) => {
        if (subscriptionType === 'one_time') {
            return GLUTATHIONE_NASAL_SPRAY_ONE_TIME.destination;
        }
        return GLUTATHIONE_NASAL_SPRAY_SUBSCRIPTION.destination;
    },
    [NAD_PATCHES_PRODUCT_HREF]: (subscriptionType: string) => {
        if (subscriptionType === 'one_time') {
            return NAD_PATCHES_ONE_TIME.destination;
        }
        return NAD_PATCHES_SUBSCRIPTION.destination;
    },
    [GLUTATHIONE_PATCHES_PRODUCT_HREF]: (subscriptionType: string) => {
        if (subscriptionType === 'one_time') {
            return GLUTATHIONE_PATCHES_ONE_TIME.destination;
        }
        return GLUTATHIONE_PATCHES_SUBSCRIPTION.destination;
    },
    [B12_INJECTION_PRODUCT_HREF]: (subscriptionType: string) => {
        return B12_INJECTION_SUBSCRIPTION.destination;
    },
    [NAD_NASAL_SPRAY_PRODUCT_HREF]: (subscriptionType: string) => {
        return NAD_NASAL_SPRAY_SUBSCRIPTION.destination;
    },
};

const productCodeToHref = {
    wvy: WEGOVY_PRODUCT_HREF,
    acrb: ACARBOSE_PRODUCT_HREF,
    tlmi: TELMISARTAN_PRODUCT_HREF,
    mfrn: METFORMIN_PRODUCT_HREF,
    ozpc: OZEMPIC_PRODUCT_HREF,
    trzp: TIRZEPATIDE_PRODUCT_HREF,
    fmsp: FINASTERINE_AND_MINOXIDIL_SPRAY_PRODUCT_HREF,
    ncrm: NAD_FACE_CREAM_PRODUCT_HREF,
    atva: ATORVASTATIN_PRODUCT_HREF,
    rapm: RAPAMYCIN_PRODUCT_HREF,
    'fc-crm': ANTI_AGING_CREAM_PRODUCT_HREF,
    mjro: MOUNJARO_PRODUCT_HREF,
    ninj: NAD_INJECTION_PRODUCT_HREF,
    cgms: CGM_SENSOR_PRODUCT_HREF,
    glti: GLUTATHIONE_INJECTION_PRODUCT_HREF,
    ldnp: LOW_DOSE_NALTREXONE_PRODUCT_HREF,
    bminj: B12_MIC_INJECTION_PRODUCT_HREF,
    smgl: SEMAGLUTIDE_PRODUCT_HREF,
    tdfilan: TADALAFIL_AS_NEEDED_PRODUCT_HREF,
    tdfildp: TADALAFIL_DAILY_PRODUCT_HREF,
    glunsp: GLUTATHIONE_NASAL_SPRAY_PRODUCT_HREF,
    ndpp: NAD_PATCHES_PRODUCT_HREF,
    glpp: GLUTATHIONE_PATCHES_PRODUCT_HREF,
    binj: B12_INJECTION_PRODUCT_HREF,
    nnsp: NAD_NASAL_SPRAY_PRODUCT_HREF,
};

export const mapCodeToProduct = (code: string) => {
    return productCodeToHref[code as keyof typeof productCodeToHref] || '???';
};

export const mapCadencyToCode = (cadency: string) => {
    switch (cadency) {
        case 'one_time':
            return 'ot';
        case 'monthly':
            return 'my';
        case 'quarterly':
            return 'qy';
        default:
            return 'unknown';
    }
};

export const mapProductToCode = (product_href: string) => {
    switch (product_href) {
        case WEGOVY_PRODUCT_HREF:
            return 'wvy';
        case ACARBOSE_PRODUCT_HREF:
            return 'acrb';
        case TELMISARTAN_PRODUCT_HREF:
            return 'tlmi';
        case METFORMIN_PRODUCT_HREF:
            return 'mfrn';
        case OZEMPIC_PRODUCT_HREF:
            return 'ozpc';
        case TIRZEPATIDE_PRODUCT_HREF:
            return 'trzp';
        case FINASTERINE_AND_MINOXIDIL_SPRAY_PRODUCT_HREF:
            return 'fmsp';
        case NAD_FACE_CREAM_PRODUCT_HREF:
            return 'ncrm';
        case ATORVASTATIN_PRODUCT_HREF:
            return 'atva';
        case RAPAMYCIN_PRODUCT_HREF:
            return 'rapm';
        case ANTI_AGING_CREAM_PRODUCT_HREF:
            return 'fc-crm';
        case MOUNJARO_PRODUCT_HREF:
            return 'mjro';
        case NAD_INJECTION_PRODUCT_HREF:
            return 'ninj';
        case CGM_SENSOR_PRODUCT_HREF:
            return 'cgms';
        case GLUTATHIONE_INJECTION_PRODUCT_HREF:
            return 'glti';
        case LOW_DOSE_NALTREXONE_PRODUCT_HREF:
            return 'ldnp';
        case B12_MIC_INJECTION_PRODUCT_HREF:
            return 'bminj';
        case SEMAGLUTIDE_PRODUCT_HREF:
            return 'smgl';
        case TADALAFIL_AS_NEEDED_PRODUCT_HREF:
            return 'tdfilan';
        case TADALAFIL_DAILY_PRODUCT_HREF:
            return 'tdfildp';
        case GLUTATHIONE_NASAL_SPRAY_PRODUCT_HREF:
            return 'glunsp';
        case NAD_PATCHES_PRODUCT_HREF:
            return 'ndpp';
        case GLUTATHIONE_PATCHES_PRODUCT_HREF:
            return 'glpp';
        case B12_INJECTION_PRODUCT_HREF:
            return 'binj';
        case NAD_NASAL_SPRAY_PRODUCT_HREF:
            return 'nnsp';
        default:
            return '???';
    }
};

export const WEGOVY_SUBSCRIPTION = {
    event_name: 'wegovy_subscription',
    destination: 'hmoxCJmanpcZEMnT3dQq',
};
export const ACARBOSE_SUBSCRIPTION = {
    event_name: 'acarbose_subscription',
    destination: 'oJsUCJKNppcZEMnT3dQq',
};
export const TELMISARTAN_SUBSCRIPTION = {
    event_name: 'telmisartan_subscription',
    destination: 'N-6GCJWNppcZEMnT3dQq',
};
export const METFORMIN_SUBSCRIPTION = {
    event_name: 'metformin_subscription',
    destination: 'rjFjCJiNppcZEMnT3dQq',
};
export const OZEMPIC_SUBSCRIPTION = {
    event_name: 'ozempic_subscription',
    destination: 'HhfGCJuNppcZEMnT3dQq',
};
export const TIRZEPATIDE_SUBSCRIPTION = {
    event_name: 'tirzepatide_subscription',
    destination: 'SJHDCJ6NppcZEMnT3dQq',
};
export const FINASTERINE_MINOXIDIL_SPRAY_SUBSCRIPTION = {
    event_name: 'finasterine_minoxidil_spray_subscription',
    destination: 'COV2CKGNppcZEMnT3dQq',
};
export const NAD_FACE_CREAM_ONE_TIME = {
    event_name: 'nad_face_cream_one_time',
    destination: 'IwkuCKSNppcZEMnT3dQq',
};
export const NAD_FACE_CREAM_SUBSCRIPTION = {
    event_name: 'nad_face_cream_subscription',
    destination: 'HFa-CKeNppcZEMnT3dQq',
};
export const ATORVASTATIN_SUBSCRIPTION = {
    event_name: 'atorvastatin_subscription',
    destination: 'gI9MCKqNppcZEMnT3dQq',
};
export const RAPAMYCIN_SUBSCRIPTION = {
    event_name: 'rapamycin_subscription',
    destination: 'NxTcCK2NppcZEMnT3dQq',
};
export const TRETINOIN_SUBSCRIPTION = {
    event_name: 'tretinoin_subscription',
    destination: 'lIhMCKiOppcZEMnT3dQq',
};
export const TRETINOIN_ONE_TIME = {
    event_name: 'tretinoin_one_time',
    destination: 'n8YpCKuOppcZEMnT3dQq',
};
export const MOUNJARO_SUBSCRIPTION = {
    event_name: 'mounjaro_subscription',
    destination: 'Q9kECK6OppcZEMnT3dQq',
};
export const NAD_INJECTION_ONE_TIME = {
    event_name: 'nad_injection_one_time',
    destination: 'x9GGCLGOppcZEMnT3dQq',
};
export const NAD_INJECTION_SUBSCRIPTION = {
    event_name: 'nad_injection_subscription',
    destination: 'HtuFCLSOppcZEMnT3dQq',
};
export const CGM_SENSOR_ONE_TIME = {
    event_name: 'cgm_sensor_one_time',
    destination: 'SmmsCLqOppcZEMnT3dQq',
};
export const CGM_SENSOR_SUBSCRIPTION = {
    event_name: 'cgm_sensor_subscription',
    destination: 'X71PCLeOppcZEMnT3dQq',
};
export const GLUTATHIONE_INJECTION_ONE_TIME = {
    event_name: 'glutathione_injection_one_time',
    destination: 'ELcgCL2OppcZEMnT3dQq',
};
export const GLUTATHIONE_INJECTION_SUBSCRIPTION = {
    event_name: 'glutathione_injection_subscription',
    destination: '5OoVCMCOppcZEMnT3dQq',
};
export const LOW_DOSE_NALTREXONE_SUBSCRIPTION = {
    event_name: 'low_dose_naltrexone_subscription',
    destination: 'nb7qCMOOppcZEMnT3dQq',
};
export const B12_MIC_INJECTION_SUBSCRIPTION = {
    event_name: 'b12_mic_injection_subscription',
    destination: 'vj6dCMaOppcZEMnT3dQq',
};
export const SEMAGLUTIDE_SUBSCRIPTION = {
    event_name: 'semaglutide_subscription',
    destination: 'TEN8CMmOppcZEMnT3dQq',
};
export const TADALAFIL_AS_NEEDED_SUBSCRIPTION = {
    event_name: 'tadalafil_as_needed_subscription',
    destination: 'bM93CMyOppcZEMnT3dQq',
};
export const TADALAFIL_DAILY_SUBSCRIPTION = {
    event_name: 'tadalafil_daily_subscription',
    destination: 'aMTSCM-OppcZEMnT3dQq',
};
export const GLUTATHIONE_NASAL_SPRAY_ONE_TIME = {
    event_name: 'glutathione_nasal_spray_one_time',
    destination: 'JIEaCNKOppcZEMnT3dQq',
};
export const GLUTATHIONE_NASAL_SPRAY_SUBSCRIPTION = {
    event_name: 'glutathione_nasal_spray_subscription',
    destination: 'kpurCNWOppcZEMnT3dQq',
};
export const NAD_PATCHES_ONE_TIME = {
    event_name: 'nad_patches_one_time',
    destination: 'H-gQCNiOppcZEMnT3dQq',
};
export const NAD_PATCHES_SUBSCRIPTION = {
    event_name: 'nad_patches_subscription',
    destination: 'pqRaCNuOppcZEMnT3dQq',
};
export const GLUTATHIONE_PATCHES_ONE_TIME = {
    event_name: 'glutathione_patches_one_time',
    destination: 'EBkICN6OppcZEMnT3dQq',
};
export const GLUTATHIONE_PATCHES_SUBSCRIPTION = {
    event_name: 'glutathione_patches_subscription',
    destination: 'nwAQCOGOppcZEMnT3dQq',
};
export const B12_INJECTION_SUBSCRIPTION = {
    event_name: 'b12_injection_subscription',
    destination: 'IdqfCOSOppcZEMnT3dQq',
};
export const NAD_NASAL_SPRAY_SUBSCRIPTION = {
    event_name: 'nad_nasal_spray_subscription',
    destination: 'u3GPCOeOppcZEMnT3dQq',
};
