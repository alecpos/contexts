import { USStates } from '@/app/types/enums/master-enums';
import { PRODUCT_VARIANCE_EQUIVALENCE_MAP } from './ProductVarianceMap';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { APPROVAL_PHARMACY_MAP } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/approval-pharmacy-scripts/approval-pharmacy-product-map';
import {
    BEST_PHARMACY_MATRIX_MAP,
    findVariantPharmacyByState,
} from './BestPharmacyMatrix';

/**
 * @author Nathan Cho
 * Product variant controller is used to consume a product href + variant index and then find the correct variant index for the patient case.
 *
 * There is built - in logic inside of this and a 'best' mapping that is used to find the correct variant-per-case.
 *
 * The pharmacy + variant combination that makes sense per the state the patient is in is the logic implemented on the v1 release of the PVC.
 *
 */
export class ProductVariantController {
    private productHref: PRODUCT_HREF;
    private variantIndex: number;
    private stateOfResidence: USStates;
    private currentEquivalence?: ProductEquivalence | null;

    /**
     * Objective of this controller is to consume various inputs and then find the corresponding variant index which is correct.
     */
    public constructor(
        productHref: PRODUCT_HREF,
        variantIndex: number,
        stateOfResidence: USStates
    ) {
        /**
         * Controller uses product Href + Variant Index to find the equivalence
         */
        this.productHref = productHref;
        this.variantIndex = variantIndex;
        this.currentEquivalence = this.findProductEquivalence(
            this.productHref,
            this.variantIndex
        );

        /**
         * Will use found equivalence + state later to find the correct variant index.
         */
        this.stateOfResidence = stateOfResidence;
    }

    /**
     * Finds and returns the
     * @param productHref product href
     * @param variantIndex variant index
     * @returns
     */
    private findProductEquivalence(
        productHref: string,
        variantIndex: number
    ): ProductEquivalence | null {
        // Get the product groups
        const productGroups = PRODUCT_VARIANCE_EQUIVALENCE_MAP[productHref];
        if (!productGroups) {
            return null;
        }
        // Find the group that contains the variant index
        const matchingGroup = productGroups.find((group) =>
            group.variantIndices.includes(variantIndex)
        );
        // Set the currentEquivalence and return the result
        return matchingGroup?.equivalence ?? null;
    }

    /**
     *
     * @returns dosage of the Equivalence set
     */
    public getEquivalenceDosage(): string {
        return this.currentEquivalence?.dosage ?? '';
    }

    public getConvertedVariantIndex(): {
        variant_index: number | undefined;
        pharmacy: string | undefined;
    } {
        let result_variant_index: number | undefined = undefined;
        let result_pharmacy: string | undefined = undefined;

        //Temporary:
        const wl_product_list = [
            PRODUCT_HREF.SEMAGLUTIDE,
            PRODUCT_HREF.TIRZEPATIDE,
            PRODUCT_HREF.WEIGHT_LOSS,
        ];

        if (!wl_product_list.includes(this.productHref)) {
            let non_wl_pharmacy;

            for (const [pharmacy, products] of Object.entries(
                APPROVAL_PHARMACY_MAP
            )) {
                // Check if the current pharmacy's product list includes the specified product
                if (products.includes(this.productHref as PRODUCT_HREF)) {
                    // If it does, return the pharmacy name
                    non_wl_pharmacy = pharmacy;
                }
            }

            return {
                variant_index: this.variantIndex,
                pharmacy: non_wl_pharmacy,
            };
        }

        const equivalence_code = this.currentEquivalence?.equivalenceCode;

        // console.log('equivalence code: ', equivalence_code);

        /**
         * Below code uses the best pharmacy matrix mapping created to manipulate cogs manually with state search logic.
         */
        const { variantIndex, pharmacy, found } = findVariantPharmacyByState(
            BEST_PHARMACY_MATRIX_MAP,
            equivalence_code,
            this.stateOfResidence
        );

        if (found) {
            return {
                variant_index: variantIndex,
                pharmacy: pharmacy,
            };
        }

        /**
         * TODO: rewrite this matrix logic to be 'cooler'
         */
        if (this.stateOfResidence === USStates.California) {
            if (this.currentEquivalence?.pharmacyMap['boothwyn']) {
            }
            result_variant_index =
                this.currentEquivalence?.pharmacyMap['boothwyn'];
            result_pharmacy = 'boothwyn';
        }

        if (this.currentEquivalence?.cadence === 'biannually') {
            if (this.stateOfResidence === USStates.Michigan) {
                result_variant_index = -1;
            } else {
                if (this.currentEquivalence?.pharmacyMap['hallandale']) {
                    result_variant_index =
                        this.currentEquivalence?.pharmacyMap['hallandale'];
                    result_pharmacy = 'hallandale';
                }
            }
        }

        if (
            !result_variant_index &&
            this.currentEquivalence?.pharmacyMap['hallandale']
        ) {
            if (this.stateOfResidence !== USStates.Michigan) {
                if (this.currentEquivalence?.pharmacyMap['hallandale']) {
                    result_variant_index =
                        this.currentEquivalence?.pharmacyMap['hallandale'];
                    result_pharmacy = 'hallandale';
                }
            } else {
                if (this.currentEquivalence?.pharmacyMap['empower']) {
                    result_variant_index =
                        this.currentEquivalence?.pharmacyMap['empower'];
                    result_pharmacy = 'empower';
                }
            }
        } else if (!result_variant_index) {
            if (this.currentEquivalence?.pharmacyMap['empower']) {
                result_variant_index =
                    this.currentEquivalence?.pharmacyMap['empower'];
                result_pharmacy = 'empower';
            }
        }

        /**
         * If not matched, return the original
         */
        if (result_variant_index === -1) {
            return { variant_index: undefined, pharmacy: undefined };
        }

        return {
            variant_index: result_variant_index,
            pharmacy: result_pharmacy,
        };
    }
}
