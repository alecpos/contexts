'use server';

import WLReviewsComponent from '@/app/components/intake-v3/pages/wl-reviews-v3';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
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
        st: any;
        psn: any;
        sd: any; //sd is important << as it is the discountable code.
        ub: any; // if coming from unbounce, this will be set to the landing page they're coming from
        /**
         * @Nathan > I wanted to make a simple, but not obvious indicator for the discounts:
         * Therefore 23c == 'Yes, do discount' and anything else is 'No, do not discount'
         */
    };
}

export default async function WLReviews({ params, searchParams }: Props) {
    //Immediately check user session presence
    const user_id = (await readUserSession()).data.session?.user.id!;

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
        }
    }

    return (
        <>
            <WLReviewsComponent
                user_id={user_id}
                product_href={selectedProduct as PRODUCT_HREF}
                url_product_href={params.product as PRODUCT_HREF}
            />
        </>
    );
}
