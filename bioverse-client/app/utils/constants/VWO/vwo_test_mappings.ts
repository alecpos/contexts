import {
    INTAKE_ROUTE,
    INTAKE_ROUTE_V3,
} from '@/app/components/intake-v2/types/intake-enumerators';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';

export interface VWO_ACTIVE_ROUTE_MAP {
    //This key is the VWO test ID
    [key: string]: {
        //Product Href to ensure the right funnel is affected
        [key: string]: {
            //the target route to replace
            [key: string]: {
                replacement_route: string;
            };
        };
    };
}

export const VWO_ACTIVE_TEST_ROUTE_MAPPING: VWO_ACTIVE_ROUTE_MAP = {
    'global-no-6': {
        [PRODUCT_HREF.WEIGHT_LOSS]: {
            [INTAKE_ROUTE_V3.WEIGHT_LOSS_SUPPLY]: {
                replacement_route: INTAKE_ROUTE_V3.WEIGHT_LOSS_SUPPLY_NO_6,
            },
        },
    },
};

export interface VWO_REVERSIONS {
    //VWO route
    [key: string]: {
        //Original
        original: string;
    };
}

export const VWO_REVERSION_MAPPING: VWO_REVERSIONS = {
    [INTAKE_ROUTE_V3.WEIGHT_LOSS_SUPPLY_NO_6]: {
        original: INTAKE_ROUTE_V3.WEIGHT_LOSS_SUPPLY,
    },
};
