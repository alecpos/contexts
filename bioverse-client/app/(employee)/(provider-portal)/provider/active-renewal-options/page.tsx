'use server';

import AllPatientsPageContainer from '@/app/components/provider-coordinator-shared/all-patients/components/page-container';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { verifyUserPermission } from '@/app/utils/actions/auth/authorization';
import { redirect } from 'next/navigation';
import ActiveRenewalOptionsComponent from '@/app/components/provider-portal/active-renewal-options/active-renewal-options-component';
import { prodcutMacroMapping } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/post-prescribe-macro-selector/post-prescribe-macro-selector'
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';
import { singleDosingSwapOptionsAndSigs, doubleDosageDosingSwapOptionsAndSigs } from '@/app/components/provider-portal/intake-view/v2/components/intake-response-column/approve-and-prescribe-confirmation-details/dosage-change/dosage-change-quarterly-final-review';
import { getPriceDataRecordWithVariant } from '@/app/utils/database/controller/product_variants/product_variants';
import { ProductVariantController } from '@/app/utils/classes/ProductVariant/ProductVariantController';
import { USStates } from '@/app/types/enums/master-enums';
interface Props {}



export default async function ActiveMacrosPage({}: Props) {
    const role_data = await verifyUserPermission(BV_AUTH_TYPE.ADMIN);

    if (!role_data.access_granted) {
        return redirect('/');
    }


    const singleDosingSwapOptions = singleDosingSwapOptionsAndSigs.map(option => ({
        dosing: option.dosing,
        product_href: option.product_href,
        variant_indexes: option.variant_indexes,
    }));

    //loop through singleDosingSwapOptions and fetch the product variant row name from the product_href and fetch each product variants 

    const productVariants = await Promise.all(singleDosingSwapOptions.map(async (option) => {
        const variantPromises = option.variant_indexes.map(async (variantIndex) => {
            const pvc = new ProductVariantController(
                option.product_href,
                variantIndex,
                'OH' as USStates
            );
            const pvc_result = pvc.getConvertedVariantIndex();
            const new_variant_index = pvc_result.variant_index ?? variantIndex;

            const productVariant = await getPriceDataRecordWithVariant(option.product_href, new_variant_index);
            return productVariant;
        });
        const variants = await Promise.all(variantPromises);
        return {
            dosing: option.dosing,
            product_href: option.product_href,
            variants: variants
        };
    }));

    const doubleDosingProductVariants = await Promise.all(doubleDosageDosingSwapOptionsAndSigs.map(async (option) => {
        const variantPromises = option.variant_indexes.map(async (variantIndex) => {
            const pvc = new ProductVariantController(
                option.product_href,
                variantIndex,
                'OH' as USStates
            );
            const pvc_result = pvc.getConvertedVariantIndex();
            const new_variant_index = pvc_result.variant_index ?? variantIndex;
            const productVariant = await getPriceDataRecordWithVariant(option.product_href, new_variant_index);
            return productVariant;
        });
        const variants = await Promise.all(variantPromises);
        return {
            dosing: option.dosing,
            product_href: option.product_href,
            variants: variants
        };
    }));


    return (
        <>
            <ActiveRenewalOptionsComponent dosingOptions={productVariants} doubleDosingOptions={doubleDosingProductVariants} />
        
        </>
    );
}