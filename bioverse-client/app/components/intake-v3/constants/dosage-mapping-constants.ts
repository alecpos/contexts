import {
    SEMAGLUTIDE_PRODUCT_HREF,
    TIRZEPATIDE_PRODUCT_HREF,
} from '@/app/services/tracking/constants';
import { ProductMappings } from '@/app/types/intake/intake-flow-types';

export const ozempicMappings: ProductMappings = {
    [SEMAGLUTIDE_PRODUCT_HREF]: {
        '0.25': {
            higher_dosage: 0.5,
            regular_dosage: 0.25,
        },
        '0.5': {
            higher_dosage: 1.25,
            regular_dosage: 0.5,
        },
        '1': {
            higher_dosage: 1.25,
            regular_dosage: 1.25,
        },
        '2': {
            higher_dosage: 2.5,
            regular_dosage: 2.5,
        },
    },
    [TIRZEPATIDE_PRODUCT_HREF]: {
        '0.25': {
            higher_dosage: 5,
            regular_dosage: 2.5,
        },
        '0.5': {
            higher_dosage: 7.5,
            regular_dosage: 5,
        },
        '1': {
            higher_dosage: 7.5,
            regular_dosage: 5,
        },
        '2': {
            higher_dosage: 10,
            regular_dosage: 7.5,
        },
    },
};

export const rybelsusMappings: ProductMappings = {
    [SEMAGLUTIDE_PRODUCT_HREF]: {
        '3': {
            higher_dosage: 0.25,
            regular_dosage: 0.25,
        },
        '7': {
            higher_dosage: 0.25,
            regular_dosage: 0.25,
        },
        '14': {
            higher_dosage: 0.5,
            regular_dosage: 0.5,
        },
    },
    [TIRZEPATIDE_PRODUCT_HREF]: {
        '3': {
            higher_dosage: 2.5,
            regular_dosage: 2.5,
        },
        '7': {
            higher_dosage: 2.5,
            regular_dosage: 2.5,
        },
        '14': {
            higher_dosage: 5,
            regular_dosage: 5,
        },
    },
};

export const saxendaMappings: ProductMappings = {
    [SEMAGLUTIDE_PRODUCT_HREF]: {
        '0.6': {
            higher_dosage: 0.25,
            regular_dosage: 0.25,
        },
        '1.2': {
            higher_dosage: 0.25,
            regular_dosage: 0.25,
        },
        '1.8': {
            higher_dosage: 0.25,
            regular_dosage: 0.25,
        },
        '2.4': {
            higher_dosage: 0.5,
            regular_dosage: 0.25,
        },
        '3.0': {
            higher_dosage: 1.25,
            regular_dosage: 1.25,
        },
    },
    [TIRZEPATIDE_PRODUCT_HREF]: {
        '0.6': {
            higher_dosage: 2.5,
            regular_dosage: 2.5,
        },
        '1.2': {
            higher_dosage: 2.5,
            regular_dosage: 2.5,
        },
        '1.8': {
            higher_dosage: 2.5,
            regular_dosage: 2.5,
        },
        '2.4': {
            higher_dosage: 5,
            regular_dosage: 2.5,
        },
        '3.0': {
            higher_dosage: 7.5,
            regular_dosage: 5,
        },
    },
};

export const trulicityMappings: ProductMappings = {
    [SEMAGLUTIDE_PRODUCT_HREF]: {
        '0.75': {
            higher_dosage: 0.5,
            regular_dosage: 0.25,
        },
        '1.5': {
            higher_dosage: 1.25,
            regular_dosage: 0.5,
        },
        '3': {
            higher_dosage: 1.25,
            regular_dosage: 1.25,
        },
        '4.5': {
            higher_dosage: 1.25,
            regular_dosage: 1.25,
        },
    },
    [TIRZEPATIDE_PRODUCT_HREF]: {
        '0.75': {
            higher_dosage: 5,
            regular_dosage: 2.5,
        },
        '1.5': {
            higher_dosage: 5,
            regular_dosage: 2.5,
        },
        '3': {
            higher_dosage: 7.5,
            regular_dosage: 5,
        },
        '4.5': {
            higher_dosage: 7.5,
            regular_dosage: 5,
        },
    },
};

export const victozaMappings: ProductMappings = {
    [SEMAGLUTIDE_PRODUCT_HREF]: {
        '0.6': {
            higher_dosage: 0.5,
            regular_dosage: 0.25,
        },
        '1.2': {
            higher_dosage: 0.5,
            regular_dosage: 0.25,
        },
        '1.8': {
            higher_dosage: 1.25,
            regular_dosage: 0.5,
        },
    },
    [TIRZEPATIDE_PRODUCT_HREF]: {
        '0.6': {
            higher_dosage: 5,
            regular_dosage: 2.5,
        },
        '1.2': {
            higher_dosage: 5,
            regular_dosage: 2.5,
        },
        '1.8': {
            higher_dosage: 7.5,
            regular_dosage: 5,
        },
    },
};

export const mounjaroMappings: ProductMappings = {
    [SEMAGLUTIDE_PRODUCT_HREF]: {
        '2.5': {
            higher_dosage: 0.5,
            regular_dosage: 0.25,
        },
        '5': {
            higher_dosage: 1.25,
            regular_dosage: 0.5,
        },
        '7.5': {
            higher_dosage: 2.5,
            regular_dosage: 1.25,
        },
        '10': {
            higher_dosage: 2.5,
            regular_dosage: 1.25,
        },
        '12.5': {
            higher_dosage: 2.5,
            regular_dosage: 2.5,
        },
    },
    [TIRZEPATIDE_PRODUCT_HREF]: {
        '2.5': {
            higher_dosage: 5,
            regular_dosage: 2.5,
        },
        '5': {
            higher_dosage: 7.5,
            regular_dosage: 5,
        },
        '7.5': {
            higher_dosage: 10,
            regular_dosage: 7.5,
        },
        '10': {
            higher_dosage: 12.5,
            regular_dosage: 10,
        },
        '12.5': {
            higher_dosage: 12.5,
            regular_dosage: 12.5,
        },
    },
};

export const zepboundMappings: ProductMappings = {
    [SEMAGLUTIDE_PRODUCT_HREF]: {
        '2.5': {
            higher_dosage: 0.5,
            regular_dosage: 0.25,
        },
        '5': {
            higher_dosage: 1.25,
            regular_dosage: 0.5,
        },
        '7.5': {
            higher_dosage: 2.5,
            regular_dosage: 1.25,
        },
        '10': {
            higher_dosage: 2.5,
            regular_dosage: 1.25,
        },
        '12.5': {
            higher_dosage: 2.5,
            regular_dosage: 2.5,
        },
        '15': {
            higher_dosage: 2.5,
            regular_dosage: 2.5,
        },
    },
    [TIRZEPATIDE_PRODUCT_HREF]: {
        '2.5': {
            higher_dosage: 5,
            regular_dosage: 2.5,
        },
        '5': {
            higher_dosage: 7.5,
            regular_dosage: 5,
        },
        '7.5': {
            higher_dosage: 10,
            regular_dosage: 7.5,
        },
        '10': {
            higher_dosage: 12.5,
            regular_dosage: 10,
        },
        '12.5': {
            higher_dosage: 12.5,
            regular_dosage: 12.5,
        },
        '15': {
            higher_dosage: 12.5,
            regular_dosage: 12.5,
        },
    },
};

export const tirzepatideMappings: ProductMappings = {
    [SEMAGLUTIDE_PRODUCT_HREF]: {
        '2.5': {
            higher_dosage: 0.5,
            regular_dosage: 0.25,
        },
        '5': {
            higher_dosage: 1.25,
            regular_dosage: 0.5,
        },
        '7.5': {
            higher_dosage: 1.25,
            regular_dosage: 1.25,
        },
        '10': {
            higher_dosage: 2.5,
            regular_dosage: 1.25,
        },
        '12.5': {
            higher_dosage: 2.5,
            regular_dosage: 2.5,
        },
        '15': {
            higher_dosage: 2.5,
            regular_dosage: 2.5,
        },
    },
    [TIRZEPATIDE_PRODUCT_HREF]: {
        '2.5': {
            higher_dosage: 5,
            regular_dosage: 2.5,
        },
        '5': {
            higher_dosage: 7.5,
            regular_dosage: 5,
        },
        '7.5': {
            higher_dosage: 10,
            regular_dosage: 7.5,
        },
        '10': {
            higher_dosage: 12.5,
            regular_dosage: 10,
        },
        '12.5': {
            higher_dosage: 12.5,
            regular_dosage: 12.5,
        },
        '15': {
            higher_dosage: 12.5,
            regular_dosage: 12.5,
        },
    },
};

export const semaglutideMappings: ProductMappings = {
    [SEMAGLUTIDE_PRODUCT_HREF]: {
        '0.25': {
            higher_dosage: 0.5,
            regular_dosage: 0.25,
        },
        '0.5': {
            higher_dosage: 1.25,
            regular_dosage: 0.5,
        },
        '1.25': {
            higher_dosage: 1.25,
            regular_dosage: 1.25,
        },
        '1.75': {
            higher_dosage: 2.5,
            regular_dosage: 1.25,
        },
        '2.5': {
            higher_dosage: 2.5,
            regular_dosage: 2.5,
        },
    },
    [TIRZEPATIDE_PRODUCT_HREF]: {
        '0.25': {
            higher_dosage: 5,
            regular_dosage: 2.5,
        },
        '0.5': {
            higher_dosage: 7.5,
            regular_dosage: 5,
        },
        '1.25': {
            higher_dosage: 7.5,
            regular_dosage: 5,
        },
        '1.75': {
            higher_dosage: 7.5,
            regular_dosage: 5,
        },
        '2.5': {
            higher_dosage: 10,
            regular_dosage: 7.5,
        },
    },
};

export const wegovyMappings: ProductMappings = {
    [SEMAGLUTIDE_PRODUCT_HREF]: {
        '0.25': {
            higher_dosage: 0.5,
            regular_dosage: 0.25,
        },
        '0.5': {
            higher_dosage: 1.25,
            regular_dosage: 0.5,
        },
        '1': {
            higher_dosage: 1.25,
            regular_dosage: 1,
        },
        '1.7': {
            higher_dosage: 2.5,
            regular_dosage: 2.5,
        },
        '2.4': {
            higher_dosage: 2.5,
            regular_dosage: 2.5,
        },
    },
    [TIRZEPATIDE_PRODUCT_HREF]: {
        '0.25': {
            higher_dosage: 5,
            regular_dosage: 2.5,
        },
        '0.5': {
            higher_dosage: 7.5,
            regular_dosage: 5,
        },
        '1': {
            higher_dosage: 7.5,
            regular_dosage: 5,
        },
        '1.7': {
            higher_dosage: 10,
            regular_dosage: 7.5,
        },
        '2.4': {
            higher_dosage: 10,
            regular_dosage: 7.5,
        },
    },
};
