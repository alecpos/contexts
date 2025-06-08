import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

export interface ClinicalNoteDataKey {
    product: PRODUCT_HREF;
    data: ClinicalNoteTemplateData[];
}

export interface ClinicalNoteTemplateData {
    type: ClinicalNoteTemplateOptionType;
    values: any[];
}

export interface ClinicalNoteTemplate {
    version: number;
    render: ClinicalTemplateOption[];
}

export interface ClinicalTemplateOption {
    type: ClinicalNoteTemplateOptionType;
    default?: boolean;
    title?: string;
    custom?: any;
    setting?: string;
    values: string[];
}

export enum ClinicalNoteTemplateOptionType {
    SELECT = 'select',
    MULTISELECT = 'multi-select',
    DROPDOWN = 'drop-down',
    GENERAL = 'general',
    NOTE = 'note',
}

interface TemplateVersionMap {
    [key: string]: {
        [key: string]: number;
    };
}

export const PRODUCT_TEMPLATE_LATEST_VERSION_MAP: TemplateVersionMap = {
    [PRODUCT_HREF.SEMAGLUTIDE]: {
        intake: 2,
        renewal: 3,
    },
    [PRODUCT_HREF.TIRZEPATIDE]: {
        intake: 2,
        renewal: 3,
    },
    [PRODUCT_HREF.WL_CAPSULE]: {
        intake: 1,
        renewal: 1,
    },
    [PRODUCT_HREF.METFORMIN]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.NAD_INJECTION]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.NAD_NASAL_SPRAY]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.NAD_PATCHES]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.GLUTATIONE_INJECTION]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.B12_INJECTION]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.ED_GLOBAL]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.PEAK_CHEWS]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.RUSH_CHEWS]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.RUSH_MELTS]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.X_CHEWS]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.X_MELTS]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.TADALAFIL]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.SILDENAFIL]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.VIAGRA]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.CIALIS]: {
        intake: 2,
        renewal: 2,
    },
    [PRODUCT_HREF.TRETINOIN]: {
        intake: 1,
        renewal: 1,
    },
    [PRODUCT_HREF.FINASTERIDE_AND_MINOXIDIL]: {
        intake: 1,
        renewal: 1,
    },
    [PRODUCT_HREF.TELMISARTAN]: {
        intake: 1,
        renewal: 1,
    },
    [PRODUCT_HREF.ACARBOSE]: {
        intake: 1,
        renewal: 1,
    },
    [PRODUCT_HREF.CGM_SENSOR]: {
        intake: 1,
        renewal: 1,
    },
    [PRODUCT_HREF.ATORVASTATIN]: {
        intake: 1,
        renewal: 1,
    },
    [PRODUCT_HREF.ZOFRAN]: {
        intake: 1,
        renewal: 1,
    },
};
