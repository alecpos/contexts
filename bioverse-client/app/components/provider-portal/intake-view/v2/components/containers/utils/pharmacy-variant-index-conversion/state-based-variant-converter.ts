import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import {
    EMPOWER_VARIANT_INDEX_ARRAY_SEMAGLTIDE,
    EMPOWER_VARIANT_INDEX_ARRAY_TIRZEPATIDE,
    HALLANDALE_EMPOWER_CONVERSION_MAP,
} from './empower-hallandale-variant-converter';
import { USStates } from '@/app/types/enums/master-enums';

export const STATES_REQUIRING_LOGIC = ['MI'];

export function validateStateForGLP1VariantIndex(
    product_href: PRODUCT_HREF,
    current_variant_index: number,
    state: string
): number {
    //If the state is michigan, we must use empower no matter what.
    if (state === USStates.Michigan || state === USStates.California) {
        if (product_href === PRODUCT_HREF.SEMAGLUTIDE) {
            if (
                EMPOWER_VARIANT_INDEX_ARRAY_SEMAGLTIDE.includes(
                    current_variant_index
                )
            ) {
                return current_variant_index;
            }

            return HALLANDALE_EMPOWER_CONVERSION_MAP.semaglutide[
                current_variant_index as keyof typeof HALLANDALE_EMPOWER_CONVERSION_MAP.semaglutide
            ];
        }

        if (product_href === PRODUCT_HREF.TIRZEPATIDE) {
            if (
                EMPOWER_VARIANT_INDEX_ARRAY_TIRZEPATIDE.includes(
                    current_variant_index
                )
            ) {
                return current_variant_index;
            }

            return HALLANDALE_EMPOWER_CONVERSION_MAP.tirzepatide[
                current_variant_index as keyof typeof HALLANDALE_EMPOWER_CONVERSION_MAP.tirzepatide
            ];
        }
    }

    return current_variant_index;
}
