import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import {
    GLP1_INTAKE_TEMPLATE,
    GLP1_INTAKE_TEMPLATE_V2,
    GLP1_RENEWAL_TEMPLATE,
    GLP1_RENEWAL_TEMPLATE_V2,
    GLP1_RENEWAL_TEMPLATE_V3,
} from './templates/glp-1-templates';
import {
    METFORMIN_TEMPLATE,
    METFORMIN_TEMPLATE_V2,
} from './templates/metformin-templates';
import { B12_TEMPLATE, B12_TEMPLATE_V2 } from './templates/b12-templates';
import { ED_TEMPLATE, ED_TEMPLATE_V2 } from './templates/ed-templates';
import {
    GLUTATHIONE_INJECTION_TEMPLATE,
    GLUTATHIONE_INJECTION_TEMPLATE_V2,
} from './templates/glutathione-injection-templates';
import {
    NAD_INJECTION_TEMPLATE,
    NAD_COMBINED_TEMPLATE_V2,
    NAD_PATCHES_TEMPLATE,
    NAD_NASAL_SPRAY_TEMPLATE,
} from './templates/nad-product-templates';
import {
    WL_CAPSULE_TEMPLATE,
    WL_CAPSULE_TEMPLATE_V2,
} from './templates/wl-capsule-templates';
import { ClinicalNoteTemplate } from './clinical-note-template-latest-versions';
import { SKIN_CARE_TEMPLATE } from './templates/skin-care-templates';
import { MINOXIDIL_FINASTERIDE_TEMPLATE } from './templates/minoxidil-finasteride-templates';
import { TELMISARTAN_TEMPLATE } from './templates/telmisartan-templates';
import { ACARBOSE_TEMPLATE } from './templates/acarbose-templates';
import { CGM_SENSOR_TEMPLATE } from './templates/cgm-sensor-templates';
import { ATORVASTATIN_TEMPLATE } from './templates/atorvastatin-templates';
import { ZOFRAN_TEMPLATE } from './templates/zofran-templates';

/**
 * used to search for templatized products positively.
 */
export const TEMPLATIZED_PRODUCT_LIST = [
    //Templatized notes initial set
    PRODUCT_HREF.SEMAGLUTIDE,
    PRODUCT_HREF.TIRZEPATIDE,
    PRODUCT_HREF.WL_CAPSULE,
    PRODUCT_HREF.METFORMIN,
    PRODUCT_HREF.NAD_INJECTION,
    PRODUCT_HREF.NAD_NASAL_SPRAY,
    PRODUCT_HREF.NAD_PATCHES,
    PRODUCT_HREF.GLUTATIONE_INJECTION,
    PRODUCT_HREF.B12_INJECTION,
    PRODUCT_HREF.TRETINOIN,
    PRODUCT_HREF.FINASTERIDE_AND_MINOXIDIL,
    PRODUCT_HREF.TELMISARTAN,
    PRODUCT_HREF.ACARBOSE,
    PRODUCT_HREF.CGM_SENSOR,
    PRODUCT_HREF.ATORVASTATIN,
    PRODUCT_HREF.ZOFRAN,
    //ED Products:
    PRODUCT_HREF.ED_GLOBAL,
    PRODUCT_HREF.PEAK_CHEWS,
    PRODUCT_HREF.RUSH_CHEWS,
    PRODUCT_HREF.RUSH_MELTS,
    PRODUCT_HREF.X_CHEWS,
    PRODUCT_HREF.X_MELTS,
    PRODUCT_HREF.TADALAFIL,
    PRODUCT_HREF.SILDENAFIL,
    PRODUCT_HREF.VIAGRA,
    PRODUCT_HREF.CIALIS,
];

interface ProductTemplateMap {
    [key: string]: {
        [key: string]: {
            [key: number]: ClinicalNoteTemplate;
        };
    };
}

export const PRODUCT_TEMPLATE_MAPPING: ProductTemplateMap = {
    [PRODUCT_HREF.SEMAGLUTIDE]: {
        intake: {
            1: GLP1_INTAKE_TEMPLATE,
            2: GLP1_INTAKE_TEMPLATE_V2,
        },
        renewal: {
            1: GLP1_RENEWAL_TEMPLATE,
            2: GLP1_RENEWAL_TEMPLATE_V2,
            3: GLP1_RENEWAL_TEMPLATE_V3,
        },
    },
    [PRODUCT_HREF.TIRZEPATIDE]: {
        intake: {
            1: GLP1_INTAKE_TEMPLATE,
            2: GLP1_INTAKE_TEMPLATE_V2,
        },
        renewal: {
            1: GLP1_RENEWAL_TEMPLATE,
            2: GLP1_RENEWAL_TEMPLATE_V2,
            3: GLP1_RENEWAL_TEMPLATE_V3,
        },
    },
    [PRODUCT_HREF.WL_CAPSULE]: {
        intake: {
            1: WL_CAPSULE_TEMPLATE,
            2: WL_CAPSULE_TEMPLATE_V2,
        },
        renewal: {
            1: WL_CAPSULE_TEMPLATE,
            2: WL_CAPSULE_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.METFORMIN]: {
        intake: {
            1: METFORMIN_TEMPLATE,
            2: METFORMIN_TEMPLATE_V2,
        },
        renewal: {
            1: METFORMIN_TEMPLATE,
            2: METFORMIN_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.NAD_INJECTION]: {
        intake: {
            1: NAD_INJECTION_TEMPLATE,
            2: NAD_COMBINED_TEMPLATE_V2,
        },
        renewal: {
            1: NAD_INJECTION_TEMPLATE,
            2: NAD_COMBINED_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.NAD_NASAL_SPRAY]: {
        intake: {
            1: NAD_NASAL_SPRAY_TEMPLATE,
            2: NAD_COMBINED_TEMPLATE_V2,
        },
        renewal: {
            1: NAD_NASAL_SPRAY_TEMPLATE,
            2: NAD_COMBINED_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.NAD_PATCHES]: {
        intake: {
            1: NAD_PATCHES_TEMPLATE,
            2: NAD_COMBINED_TEMPLATE_V2,
        },
        renewal: {
            1: NAD_PATCHES_TEMPLATE,
            2: NAD_COMBINED_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.GLUTATIONE_INJECTION]: {
        intake: {
            1: GLUTATHIONE_INJECTION_TEMPLATE,
            2: GLUTATHIONE_INJECTION_TEMPLATE_V2,
        },
        renewal: {
            1: GLUTATHIONE_INJECTION_TEMPLATE,
            2: GLUTATHIONE_INJECTION_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.B12_INJECTION]: {
        intake: {
            1: B12_TEMPLATE,
            2: B12_TEMPLATE_V2,
        },
        renewal: {
            1: B12_TEMPLATE,
            2: B12_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.ED_GLOBAL]: {
        intake: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
        renewal: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.PEAK_CHEWS]: {
        intake: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
        renewal: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.RUSH_CHEWS]: {
        intake: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
        renewal: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.RUSH_MELTS]: {
        intake: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
        renewal: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.X_CHEWS]: {
        intake: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
        renewal: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.X_MELTS]: {
        intake: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
        renewal: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.TADALAFIL]: {
        intake: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
        renewal: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.SILDENAFIL]: {
        intake: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
        renewal: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.VIAGRA]: {
        intake: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
        renewal: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.CIALIS]: {
        intake: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
        renewal: {
            1: ED_TEMPLATE,
            2: ED_TEMPLATE_V2,
        },
    },
    [PRODUCT_HREF.TRETINOIN]: {
        intake: {
            1: SKIN_CARE_TEMPLATE,
        },
        renewal: {
            1: SKIN_CARE_TEMPLATE,
        },
    },
    [PRODUCT_HREF.FINASTERIDE_AND_MINOXIDIL]: {
        intake: {
            1: MINOXIDIL_FINASTERIDE_TEMPLATE,
        },
        renewal: {
            1: MINOXIDIL_FINASTERIDE_TEMPLATE,
        },
    },
    [PRODUCT_HREF.TELMISARTAN]: {
        intake: {
            1: TELMISARTAN_TEMPLATE,
        },
        renewal: {
            1: TELMISARTAN_TEMPLATE,
        },
    },
    [PRODUCT_HREF.ACARBOSE]: {
        intake: {
            1: ACARBOSE_TEMPLATE,
        },
        renewal: {
            1: ACARBOSE_TEMPLATE,
        },
    },
    [PRODUCT_HREF.CGM_SENSOR]: {
        intake: {
            1: CGM_SENSOR_TEMPLATE,
        },
        renewal: {
            1: CGM_SENSOR_TEMPLATE,
        },
    },
    [PRODUCT_HREF.ATORVASTATIN]: {
        intake: {
            1: ATORVASTATIN_TEMPLATE,
        },
        renewal: {
            1: ATORVASTATIN_TEMPLATE,
        },
    },
    [PRODUCT_HREF.ZOFRAN]: {
        intake: {
            1: ZOFRAN_TEMPLATE,
        },
        renewal: {
            1: ZOFRAN_TEMPLATE,
        },
    },
};
