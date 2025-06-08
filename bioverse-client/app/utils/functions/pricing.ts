import {
    CGM_SENSOR_PRODUCT_HREF,
    SEMAGLUTIDE_PRODUCT_HREF,
} from '@/app/services/tracking/constants';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { ProductVariantRecord } from '../database/controller/product_variants/product_variants';

export const constructPricingStructure = (
    productData: any,
    priceData: ProductVariantRecord[],
    shouldDiscount: boolean,
) => {
    // Construct { full_price, subscribesave_price, coupon_price, total_price }
    const subscriptionType = productData['subscriptionType'];
    const variant = productData['variant'];
    const productName = productData['productName'];
    const product = priceData[variant].price_data;

    if (productName === CGM_SENSOR_PRODUCT_HREF) {
        if (subscriptionType === 'monthly') {
            const total_price = 195 - (shouldDiscount ? 20 : 0);
            return {
                item_price: '238.00',
                subscribe_save_price: '43.00',
                total_price: total_price.toFixed(2),
                ...(shouldDiscount && {
                    coupon_price: parseFloat(
                        product.discount_price.discount_amount,
                    ).toFixed(2),
                }),
            };
        }
    }

    let res: any = {};
    var full_price = parseFloat(product.product_price);
    res['item_price'] = full_price;

    // Determine if should apply Subscribe + Save (aka only monthly products)
    if (subscriptionType !== 'quarterly' && subscriptionType !== 'one_time') {
        // Apply Subscribe & Save

        const oneTimePriceRecord = priceData.find(
            (record) => record.cadence === 'one_time',
        );

        if (oneTimePriceRecord) {
            const one_time_price = parseFloat(
                oneTimePriceRecord.price_data.product_price,
            );

            const subscribe_save_price = product.product_price - one_time_price;
            res['subscribe_save_price'] = Math.abs(subscribe_save_price);
        }
    }

    // Determine coupon savings
    // Dont apply coupon savings if it's one-time
    if (
        (subscriptionType !== 'one_time' && shouldDiscount) ||
        isWeightlossProduct(productData.productName)
    ) {
        const coupon_price = parseFloat(product.discount_price.discount_amount);
        res['coupon_price'] = coupon_price;
    }

    const total =
        full_price -
        (res['subscribe_save_price'] ?? 0) -
        (res['coupon_price'] ?? 0);
    res['total_price'] = total;

    return Object.keys(res).reduce((acc: any, key: any) => {
        // Convert each value to a string with two decimal places and then to a number
        acc[key] = res[key].toFixed(2);
        return acc;
    }, {});
};

export const isVialProduct = (product_href: string) => {
    if (
        product_href === 'ozempic' ||
        product_href === 'nad-injection' ||
        product_href === 'semaglutide' ||
        product_href === 'wegovy' ||
        product_href === 'tirzepatide' ||
        product_href === 'mounjaro' ||
        product_href === 'b12-injection' ||
        product_href === 'glutathione-injection'
    ) {
        return true;
    }
    return false;
};

export const isAdvertisedProduct = (product_href: string) => {
    // TODO: Remove glutathione here
    if (
        product_href === SEMAGLUTIDE_PRODUCT_HREF
        // ||
        // product_href === 'tirzepatide' ||
        // product_href === 'nad_injection'
    ) {
        return true;
    }
    return false;
};

export const isWeightlossProduct = (product_href: string) => {
    // TODO: Remove glutathione here
    if (
        product_href === 'ozempic' ||
        product_href === 'semaglutide' ||
        product_href === 'wegovy' ||
        product_href === 'tirzepatide' ||
        product_href === 'mounjaro' ||
        product_href === PRODUCT_HREF.WEIGHT_LOSS
    ) {
        return true;
    }
    return false;
};

export const isGLP1Product = (product_href: string) => {
    // TODO: Remove glutathione here
    if (
        product_href === PRODUCT_HREF.OZEMPIC ||
        product_href === PRODUCT_HREF.SEMAGLUTIDE ||
        product_href === PRODUCT_HREF.WEGOVY ||
        product_href === PRODUCT_HREF.TIRZEPATIDE ||
        product_href === PRODUCT_HREF.MOUNJARO
    ) {
        return true;
    }
    return false;
};

export const constructPricingStructureV2 = (
    product_data: {
        product_href: string;
        variant: number;
        subscriptionType: string;
        discountable: boolean;
    },
    priceData: ProductVariantRecord[],
    shouldDiscount: boolean,
) => {
    // Construct { full_price, subscribesave_price, coupon_price, total_price }
    const subscriptionType = product_data['subscriptionType'];
    const productName = product_data['product_href'];

    const variantRecord = priceData.find(
        (record) => record.variant_index == product_data.variant,
    );

    const product = variantRecord?.price_data;

    // if (productName === PRODUCT_HREF.CGM_SENSOR) {
    //     if (subscriptionType === 'monthly') {
    //         const total_price = 119 - (shouldDiscount ? 20 : 0);
    //         return {
    //             item_price: '119.00',
    //             subscribe_save_price: '43.00',
    //             total_price: total_price.toFixed(2),
    //             ...(shouldDiscount && {
    //                 coupon_price: parseFloat(
    //                     product.discount_price.discount_amount
    //                 ).toFixed(2),
    //             }),
    //             discountApplied: true,
    //         };
    //     }
    // }

    let res: any = {
        discountApplied: false,
    };

    var full_price = parseFloat(product.product_price);

    res['item_price'] = full_price;

    // Determine if should apply Subscribe + Save (aka only monthly products)
    if (subscriptionType !== 'quarterly' && subscriptionType !== 'one_time' && subscriptionType !== 'annually') {
        // Apply Subscribe & Save

        const oneTimeRecord = priceData.find(
            (record) => record.cadence === 'one_time',
        );

        if (oneTimeRecord) {
            const one_time_price = parseFloat(
                oneTimeRecord.price_data.product_price,
            );

            const subscribe_save_price = product.product_price - one_time_price;
            res['subscribe_save_price'] = Math.abs(subscribe_save_price);
            res.discountApplied = true;
        }
    }

    // Determine coupon savings
    // Dont apply coupon savings if it's one-time
    if (
        (subscriptionType !== 'one_time' && shouldDiscount) ||
        isWeightlossProduct(product_data.product_href)
    ) {
        const coupon_price = parseFloat(product.discount_price.discount_amount);
        res['coupon_price'] = coupon_price;
        res.discountApplied = true;
    }

    const total =
        full_price -
        (res['subscribe_save_price'] ?? 0) -
        (((shouldDiscount || isWeightlossProduct(product_data.product_href)) &&
            res['coupon_price']) ??
            0);
    res['total_price'] = total;

    return Object.keys(res).reduce((acc: any, key: any) => {
        // Convert each value to a string with two decimal places and then to a number
        if (key === 'discountApplied') {
            return acc;
        }
        acc[key] = res[key].toFixed(2);
        return acc;
    }, {});
};
