'use client';

import { WEIGHT_LOSS_PRODUCT_HREF } from './constants/constants';

export function getIntakeURLParams(
    url: any,
    searchParams: any
): {
    product_href: string;
    variant_index: string;
    subscription_cadence: string;
    discountable: boolean;
    is_weight_loss: boolean;
} {
    const product_name_from_url = url.product;

    const is_weight_loss = WEIGHT_LOSS_PRODUCT_HREF.includes(
        product_name_from_url
    );

    return {
        product_href: product_name_from_url,
        variant_index: searchParams.get('pvn'),
        subscription_cadence: searchParams.get('st'),
        discountable: searchParams.get('sd') === '23c',
        is_weight_loss: is_weight_loss,
    };
}
