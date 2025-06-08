'use server';

import WL_Capsule_Cadence_Selection_Component from '@/app/components/intake-v3/pages/wl-capsule-cadence-selection';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import {
    getOrderForProduct,
    getIncompleteGlobalWLOrderPostHrefSwap,
    updateOrder,
} from '@/app/utils/database/controller/orders/orders-api';
import { redirect } from 'next/navigation';

interface Props {
    params: {
        product: string;
    };
    searchParams: {
        pvn: any;
    };
}

export default async function WL_Capsule_Cadence_Selection_Page({
    params,
    searchParams,
}: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;
    let order_id: number = 0;

    let selectedProduct = params.product; //this will be redefined below if the user is coming from the global wl funnel
    //the params.product won't work for finding pricing data if the user is coming from the global wl funnel:
    if (params.product === 'weight-loss') {
        const originalOrder = await getOrderForProduct(params.product, user_id); //try to find a weight-loss order for the user

        if (!originalOrder) {
            //if you can't find it, then maybe it the product_href was already swapped with their selected product
            const globalWLOrder = await getIncompleteGlobalWLOrderPostHrefSwap(
                user_id
            ); //try to find a sem/tirz/metf order for the user
            if (!globalWLOrder?.product_href) {
                console.error('No order found for global weight loss funnel');
                redirect('/');
            }
            //in case they chose one medication then went back in the flow and switched to another:
            if (
                globalWLOrder.product_href !==
                globalWLOrder.metadata['selected_product']
            ) {
                const selectedProductHref =
                    globalWLOrder.metadata.selected_product;
                await updateOrder(globalWLOrder.id, {
                    product_href: selectedProductHref,
                });
            }
            selectedProduct = globalWLOrder?.product_href;

            order_id = globalWLOrder.id;
        } else {
            //if you can find a weight-loss order, then swap the product_href with the selected product
            if (
                originalOrder.product_href !==
                originalOrder.metadata['selected_product']
            ) {
                const selectedProductHref =
                    originalOrder.metadata.selected_product;
                await updateOrder(originalOrder.id, {
                    product_href: selectedProductHref,
                });
            }
            selectedProduct = originalOrder.metadata.selected_product;
            order_id = originalOrder.id;
        }
    }

    return <WL_Capsule_Cadence_Selection_Component order_id={order_id} />;
}
