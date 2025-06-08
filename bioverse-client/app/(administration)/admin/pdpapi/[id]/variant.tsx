'use client';
import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import {
    fetchProduct,
    updateProduct,
    updateProductPrice,
} from '../../../../utils/actions/pdp-api/pdp-api';
import { useSearchParams } from 'next/navigation';

type PriceType = 'one_time' | 'monthly' | 'quarterly';

interface PriceInfo {
    marketPrice: string;
    checkoutPrice: string;
    originalPrice: string;
    subcription_subtext: string;
    subcription_includes_bullets: string[];
}

interface Variant {
    variant: string;
    one_time: PriceInfo[];
    monthly: PriceInfo[];
    quarterly: PriceInfo[];
}

interface UpdatedPriceInfo {
    one_time?: any;
    monthly?: any;
    quarterly?: any;
    variant?: string;
    variant_index?: number;
}

const Variant = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id') ?? '1';
    const [variants, setVariants] = useState([
        {
            variant: '',
            one_time: [
                {
                    marketPrice: '',
                    checkoutPrice: '',
                    originalPrice: '',
                    subcription_subtext: '',
                    subcription_includes_bullets: [''],
                },
            ],
            monthly: [
                {
                    marketPrice: '',
                    checkoutPrice: '',
                    originalPrice: '',
                    subcription_subtext: '',
                    subcription_includes_bullets: [''],
                },
            ],
            quarterly: [
                {
                    marketPrice: '',
                    checkoutPrice: '',
                    originalPrice: '',
                    subcription_subtext: '',
                    subcription_includes_bullets: [''],
                },
            ],
            variant_index: '',
        },
    ]);

    const [oneTimePrice, setOneTimePrice] = useState({
        marketPrice: '',
        checkoutPrice: '',
        originalPrice: '',
        subcription_subtext: null,
        subcription_includes_bullets: '',
    });
    const [subscriptionBullets, setSubscriptionBullets] = useState([['']]);
    const [monthlyPrice, setMonthlyPrice] = useState({
        marketPrice: '',
        checkoutPrice: '',
        originalPrice: '',
        subcription_subtext: null,
        subcription_includes_bullets: '',
    });
    const [quarterlyPrice, setQuarterlyPrice] = useState({
        marketPrice: '',
        checkoutPrice: '',
        originalPrice: '',
        subcription_subtext: null,
        subcription_includes_bullets: '',
    });
    const [subscriptionBulletsMonthly, setSubscriptionBulletsMonthly] =
        useState([['']]);
    const [subscriptionBulletsQuaterly, setSubscriptionBulletsQuaterly] =
        useState([['']]);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

    const handleSubscriptionBulletChange = (
        variantIndex: any,
        priceType: 'one_time' | 'monthly' | 'quarterly',
        bulletIndex: any,
        value: any,
    ) => {
        setSubscriptionBullets((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex
                    ? bullets.map((bullet, bIdx) =>
                          bIdx === bulletIndex ? value : bullet,
                      )
                    : bullets,
            ),
        );

        // 同时更新variants数组中的对应数据
        setVariants((currentVariants) =>
            currentVariants.map((variant, vIdx) => {
                if (vIdx === variantIndex) {
                    const updatedPriceInfo =
                        variant[priceType] && variant[priceType].length > 0
                            ? {
                                  ...(variant[
                                      priceType as keyof Variant
                                  ][0] as PriceInfo),
                              }
                            : { subcription_includes_bullets: [] }; // 提供一个默认值

                    if (
                        Array.isArray(
                            updatedPriceInfo.subcription_includes_bullets,
                        )
                    ) {
                        updatedPriceInfo.subcription_includes_bullets =
                            updatedPriceInfo.subcription_includes_bullets.map(
                                (bullet: any, bIdx: any) =>
                                    bIdx === bulletIndex ? value : bullet,
                            );
                    }

                    return {
                        ...variant,
                        [priceType]: [updatedPriceInfo],
                    };
                }
                return variant;
            }),
        );
    };

    const handleSubscriptionBulletChangeQuaterly = (
        variantIndex: any,
        priceType: 'one_time' | 'monthly' | 'quarterly',
        bulletIndex: any,
        value: any,
    ) => {
        // 更新用于UI显示的subscriptionBullets
        setSubscriptionBulletsQuaterly((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex
                    ? bullets.map((bullet, bIdx) =>
                          bIdx === bulletIndex ? value : bullet,
                      )
                    : bullets,
            ),
        );

        // 同时更新variants数组中的对应数据
        setVariants((currentVariants) =>
            currentVariants.map((variant, vIdx) => {
                if (vIdx === variantIndex) {
                    const updatedPriceInfo = { ...variant[priceType][0] }; // 假设只有一个价格层级
                    updatedPriceInfo.subcription_includes_bullets =
                        updatedPriceInfo.subcription_includes_bullets.map(
                            (bullet: any, bIdx: any) =>
                                bIdx === bulletIndex ? value : bullet,
                        );

                    return {
                        ...variant,
                        [priceType]: [updatedPriceInfo], // 更新对应价格类型的子弹点数据
                    };
                }
                return variant;
            }),
        );
    };

    const handleSubscriptionBulletChangeMonthly = (
        variantIndex: any,
        priceType: 'one_time' | 'monthly' | 'quarterly',
        bulletIndex: any,
        value: any,
    ) => {
        // 更新用于UI显示的subscriptionBullets
        setSubscriptionBulletsMonthly((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex
                    ? bullets.map((bullet, bIdx) =>
                          bIdx === bulletIndex ? value : bullet,
                      )
                    : bullets,
            ),
        );

        // 同时更新variants数组中的对应数据
        setVariants((currentVariants) =>
            currentVariants.map((variant, vIdx) => {
                if (vIdx === variantIndex) {
                    const updatedPriceInfo = { ...variant[priceType][0] }; // 假设只有一个价格层级
                    updatedPriceInfo.subcription_includes_bullets =
                        updatedPriceInfo.subcription_includes_bullets.map(
                            (bullet: any, bIdx: any) =>
                                bIdx === bulletIndex ? value : bullet,
                        );

                    return {
                        ...variant,
                        [priceType]: [updatedPriceInfo], // 更新对应价格类型的子弹点数据
                    };
                }
                return variant;
            }),
        );
    };
    const addSubscriptionBullet = (variantIndex: any, priceType: PriceType) => {
        setSubscriptionBullets((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex ? [...bullets, ''] : bullets,
            ),
        );

        // 更新 variants 数组
        setVariants((currentVariants) =>
            currentVariants.map((variant, vIdx) => {
                if (vIdx === variantIndex) {
                    // 确保 priceType 有效并且数组中有元素
                    if (variant[priceType] && variant[priceType].length > 0) {
                        const updatedPriceInfo = {
                            ...(variant[priceType][0] as PriceInfo), // 使用类型断言
                            subcription_includes_bullets: [
                                ...variant[priceType][0]
                                    .subcription_includes_bullets,
                                '', // 添加一个空字符串作为新的子弹点
                            ],
                        };

                        return {
                            ...variant,
                            [priceType]: [updatedPriceInfo],
                        };
                    }
                }
                return variant;
            }),
        );
    };

    const addSubscriptionBulletMonthly = (
        variantIndex: any,
        priceType: PriceType,
    ) => {
        setSubscriptionBulletsMonthly((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex ? [...bullets, ''] : bullets,
            ),
        );

        // 如果需要，还可以在这里更新 variants 数组
        setVariants((currentVariants) =>
            currentVariants.map((variant, vIdx) => {
                if (vIdx === variantIndex) {
                    const updatedPriceInfo = { ...variant[priceType][0] };
                    updatedPriceInfo.subcription_includes_bullets = [
                        ...updatedPriceInfo.subcription_includes_bullets,
                        '', // 添加一个空字符串作为新的子弹点
                    ];

                    return {
                        ...variant,
                        [priceType]: [updatedPriceInfo],
                    };
                }
                return variant;
            }),
        );
    };

    const addSubscriptionBulletQuaterly = (
        variantIndex: any,
        priceType: PriceType,
    ) => {
        setSubscriptionBulletsQuaterly((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex ? [...bullets, ''] : bullets,
            ),
        );

        // 如果需要，还可以在这里更新 variants 数组
        setVariants((currentVariants) =>
            currentVariants.map((variant, vIdx) => {
                if (vIdx === variantIndex) {
                    const updatedPriceInfo = { ...variant[priceType][0] };
                    updatedPriceInfo.subcription_includes_bullets = [
                        ...updatedPriceInfo.subcription_includes_bullets,
                        '', // 添加一个空字符串作为新的子弹点
                    ];

                    return {
                        ...variant,
                        [priceType]: [updatedPriceInfo],
                    };
                }
                return variant;
            }),
        );
    };

    const removeSubscriptionBulletMonthly = (index: any) => {
        setSubscriptionBulletsMonthly(
            subscriptionBulletsMonthly.filter((_, i) => i !== index),
        );
    };

    const removeSubscriptionBulletQuarterly = (index: any) => {
        setSubscriptionBulletsQuaterly(
            subscriptionBulletsQuaterly.filter((_, i) => i !== index),
        );
    };

    const addVariant = () => {
        const newIndex = variants.length;

        const newOneTimePrice = {
            ...oneTimePrice,
            subcription_subtext: oneTimePrice.subcription_subtext || '', // Ensure it's a string
            subcription_includes_bullets: Array.isArray(
                oneTimePrice.subcription_includes_bullets,
            )
                ? oneTimePrice.subcription_includes_bullets
                : [oneTimePrice.subcription_includes_bullets], // Ensure it's an array
        };

        const newMonthlyPrice = {
            ...monthlyPrice,
            subcription_subtext: monthlyPrice.subcription_subtext || '',
            subcription_includes_bullets: Array.isArray(
                monthlyPrice.subcription_includes_bullets,
            )
                ? monthlyPrice.subcription_includes_bullets
                : [monthlyPrice.subcription_includes_bullets],
        };

        const newQuarterlyPrice = {
            ...quarterlyPrice,
            subcription_subtext: quarterlyPrice.subcription_subtext || '',
            subcription_includes_bullets: Array.isArray(
                quarterlyPrice.subcription_includes_bullets,
            )
                ? quarterlyPrice.subcription_includes_bullets
                : [quarterlyPrice.subcription_includes_bullets],
        };

        setVariants([
            ...variants,
            {
                variant: '',
                one_time: [newOneTimePrice],
                monthly: [newMonthlyPrice],
                quarterly: [newQuarterlyPrice],
                variant_index: newIndex.toString(),
            },
        ]);
        setSelectedVariantIndex(newIndex);
        setSubscriptionBullets([...subscriptionBullets, ['']]);
        setSubscriptionBulletsMonthly([...subscriptionBulletsMonthly, ['']]);
        setSubscriptionBulletsQuaterly([...subscriptionBulletsQuaterly, ['']]);
    };

    const removeVariant = (index: any) => {
        const updatedVariants = variants.filter((_, i) => i !== index);
        setVariants(updatedVariants);

        if (selectedVariantIndex === index) {
            setSelectedVariantIndex(updatedVariants.length > 0 ? 0 : -1); // Set to -1 if no variants are left
        } else if (selectedVariantIndex > index) {
            setSelectedVariantIndex(selectedVariantIndex - 1);
        }
    };

    const handleVariantChange = (
        variantIndex: number,
        field: string,
        value: any,

        priceField: string | null = null,
        priceIndex: number | null = null,
    ) => {
        setVariants((currentVariants) => {
            return currentVariants.map((variant, idx) => {
                if (idx === variantIndex) {
                    if (
                        priceField !== null &&
                        variant[priceField as keyof typeof variant]
                    ) {
                        const updatedPrice = (
                            variant[priceField as keyof typeof variant] as any[]
                        ).map((price, pIdx) => {
                            if (pIdx === priceIndex) {
                                return { ...price, [field]: value };
                            }
                            return price;
                        });
                        return { ...variant, [priceField]: updatedPrice };
                    } else {
                        return { ...variant, [field]: value };
                    }
                }
                return variant;
            });
        });
    };

    const removeSubscriptionBullet = (variantIndex: any, bulletIndex: any) => {
        setSubscriptionBullets((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex
                    ? bullets.filter((_, bIdx) => bIdx !== bulletIndex)
                    : bullets,
            ),
        );
    };

    //   await handlePriceUpdate();

    const handlePriceUpdate = async () => {
        let updatedPriceInfo: UpdatedPriceInfo[] = variants.map(
            (variant, index) => {
                // Function to format bullet points
                const formatBulletPoints = (bullets: any) => {
                    // Ensure bullets is an array and filter out empty strings
                    return (Array.isArray(bullets) ? bullets : [])
                        .filter((b) => b.trim() !== '')
                        .map((b) => `[bio-bullet-item]${b}[/bio-bullet-item]`)
                        .join(' ');
                };

                // Process one-time pricing
                let one_time =
                    variant.one_time && variant.one_time.length > 0
                        ? [
                              {
                                  marketPrice: parseFloat(
                                      variant.one_time[0].marketPrice,
                                  ),
                                  checkoutPrice: parseFloat(
                                      variant.one_time[0].checkoutPrice,
                                  ),
                                  originalPrice: parseFloat(
                                      variant.one_time[0].originalPrice,
                                  ),
                                  subcription_includes_bullets:
                                      formatBulletPoints(
                                          variant.one_time[0]
                                              .subcription_includes_bullets,
                                      ),
                              },
                          ]
                        : null;

                // Process monthly pricing
                let monthly =
                    variant.monthly && variant.monthly.length > 0
                        ? [
                              {
                                  marketPrice: parseFloat(
                                      variant.monthly[0].marketPrice,
                                  ),
                                  checkoutPrice: parseFloat(
                                      variant.monthly[0].checkoutPrice,
                                  ),
                                  originalPrice: parseFloat(
                                      variant.monthly[0].originalPrice,
                                  ),
                                  subcription_includes_bullets:
                                      formatBulletPoints(
                                          variant.monthly[0]
                                              .subcription_includes_bullets,
                                      ),
                              },
                          ]
                        : null;

                // Process quarterly pricing
                let quarterly =
                    variant.quarterly && variant.quarterly.length > 0
                        ? [
                              {
                                  marketPrice: parseFloat(
                                      variant.quarterly[0].marketPrice,
                                  ),
                                  checkoutPrice: parseFloat(
                                      variant.quarterly[0].checkoutPrice,
                                  ),
                                  originalPrice: parseFloat(
                                      variant.quarterly[0].originalPrice,
                                  ),
                                  subcription_includes_bullets:
                                      formatBulletPoints(
                                          variant.quarterly[0]
                                              .subcription_includes_bullets,
                                      ),
                              },
                          ]
                        : null;

                return {
                    one_time,
                    monthly,
                    quarterly,
                    variant: variant.variant,
                    variant_index: index,
                };
            },
        );

        for (let priceInfo of updatedPriceInfo) {
            const response = await updateProductPrice(id, priceInfo);

            if (!response) {
                console.error('No response from updateProductPrice');
                continue;
            }

            if (response.error) {
                console.error('Update price error:', response.error);
            } else {
                console.log('Update price success:', response.data);
            }
        }
    };

    const variantForms = variants.map((variant, index) => (
        <div key={index} className="mb-4">
            <Paper className="p-10">
                <div>
                    <br />
                    <h3 className="text-cyan-700"> Variant #{index + 1}</h3>
                    <input
                        type="text"
                        value={variant.variant}
                        onChange={(e) =>
                            handleVariantChange(
                                index,
                                'variant',
                                e.target.value,
                            )
                        }
                        placeholder="Variant Name"
                        className="block w-full p-2 border border-gray-300 rounded-md"
                    />
                    <br />

                    <h3 className="text-cyan-700">One Time Martket price</h3>
                    <span className="text-emerald-500	">
                        This is the cross-out one time price in PDP
                    </span>
                    <input
                        type="text"
                        value={
                            variant.one_time && variant.one_time.length > 0
                                ? variant.one_time[0].marketPrice
                                : ''
                        }
                        onChange={(e) =>
                            variant.one_time &&
                            handleVariantChange(index, 'one_time', [
                                {
                                    ...variant.one_time[0],
                                    marketPrice: parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder="One Time Market Price"
                        className="block w-full p-2 border border-gray-300 rounded-md"
                    />
                    <br />

                    <h3 className="text-cyan-700">One Time Checkout price</h3>
                    <span className="text-emerald-500	">
                        This is the one time price for check-out, should be the
                        same as Original price
                    </span>
                    <input
                        type="text"
                        value={
                            variant.one_time && variant.one_time.length > 0
                                ? variant.one_time[0].checkoutPrice
                                : ''
                        }
                        onChange={(e) =>
                            variant.one_time &&
                            handleVariantChange(index, 'one_time', [
                                {
                                    ...variant.one_time[0],
                                    checkoutPrice: parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder="One Time Checkout Price"
                        className="block w-full p-2 border border-gray-300 rounded-md"
                    />
                    <br />

                    <h3 className="text-cyan-700">One Time Original price</h3>
                    <span className="text-emerald-500	">
                        This is &ldquo;OUR&rdquo; one time price in PDP{' '}
                    </span>
                    <input
                        type="text"
                        value={
                            variant.one_time[0] && variant.one_time.length > 0
                                ? variant.one_time[0].originalPrice
                                : ''
                        }
                        onChange={(e) =>
                            variant.one_time &&
                            handleVariantChange(index, 'one_time', [
                                {
                                    ...variant.one_time[0],
                                    originalPrice: parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder="One Time Original Price"
                        className="block w-full p-2 border border-gray-300 rounded-md"
                    />
                    <div>
                        <br />
                        <h3 className="text-cyan-700">One Time Bullets</h3>
                        {subscriptionBullets[index].map(
                            (bullet, bulletIndex) => (
                                <div
                                    key={bulletIndex}
                                    className="flex items-center space-x-2"
                                >
                                    <textarea
                                        rows={4}
                                        value={bullet}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 222) {
                                                handleSubscriptionBulletChange(
                                                    index, // 这里使用 index 作为 variantIndex
                                                    'one_time',
                                                    bulletIndex,
                                                    e.target.value,
                                                );
                                            }
                                        }}
                                        placeholder={`Bullet Point ${
                                            bulletIndex + 1
                                        }, limited in 222 characters`}
                                        className="block w-full p-2 border border-gray-300 rounded-md"
                                    />
                                    {subscriptionBullets[index].length > 1 && ( // 只有当有多个子弹点时显示移除按钮
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeSubscriptionBullet(
                                                    index,
                                                    bulletIndex,
                                                )
                                            } // 这里使用 index 和 bulletIndex
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ),
                        )}
                        <button
                            type="button"
                            onClick={() =>
                                addSubscriptionBullet(index, 'one_time')
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Add
                        </button>
                    </div>
                </div>
                <div>
                    <br />
                    <h3 className="text-cyan-700">Monthly Market price</h3>
                    <span className="text-emerald-500	">
                        This is the cross-out Monthly price in PDP
                    </span>
                    <input
                        type="text"
                        value={
                            variant.monthly && variant.monthly.length > 0
                                ? variant.monthly[0].marketPrice
                                : ''
                        }
                        onChange={(e) =>
                            variant.monthly &&
                            handleVariantChange(index, 'monthly', [
                                {
                                    ...variant.monthly[0],
                                    marketPrice: parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder="Monthly Market Price"
                        className="block w-full p-2 border border-gray-300 rounded-md"
                    />
                    <br />
                    <h3 className="text-cyan-700">Monthly Checkout price</h3>
                    <span className="text-emerald-500	">
                        This is the Monthly price for check-out, should be the
                        same as Original price
                    </span>
                    <input
                        type="text"
                        value={
                            variant.monthly && variant.monthly.length > 0
                                ? variant.monthly[0].checkoutPrice
                                : ''
                        }
                        onChange={(e) =>
                            variant.monthly &&
                            handleVariantChange(index, 'monthly', [
                                {
                                    ...variant.monthly[0],
                                    checkoutPrice: parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder="Monthly Checkout Price"
                        className="block w-full p-2 border border-gray-300 rounded-md"
                    />
                    <br />
                    <h3 className="text-cyan-700">Monthly Original price</h3>
                    <span className="text-emerald-500	">
                        This is &ldquo;OUR&rdquo; Monthly price in PDP{' '}
                    </span>
                    <input
                        type="text"
                        value={
                            variant.monthly[0] && variant.monthly.length > 0
                                ? variant.monthly[0].originalPrice
                                : ''
                        }
                        onChange={(e) =>
                            variant.monthly &&
                            handleVariantChange(index, 'monthly', [
                                {
                                    ...variant.monthly[0],
                                    originalPrice: parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder="Monthly Original Price"
                        className="block w-full p-2 border border-gray-300 rounded-md"
                    />
                    <br />
                    <div>
                        <h3 className="text-cyan-700">Monthly Bullets</h3>
                        {subscriptionBulletsMonthly[index].map(
                            (bullet, bulletIndex) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                >
                                    <textarea
                                        rows={4}
                                        value={bullet}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 222) {
                                                handleSubscriptionBulletChangeMonthly(
                                                    index,
                                                    'monthly',
                                                    bulletIndex,
                                                    e.target.value,
                                                );
                                            }
                                        }}
                                        placeholder={`Monthly Bullet Point ${
                                            index + 1
                                        }, limited in 222 characters`}
                                        className="block w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            ),
                        )}
                        <button
                            type="button"
                            onClick={() =>
                                addSubscriptionBulletMonthly(index, 'monthly')
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                removeSubscriptionBulletMonthly(index)
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                </div>
                <div>
                    <br />

                    <h3 className="text-cyan-700">Quarterly Market Price</h3>
                    <span className="text-emerald-500	">
                        This is the cross-out Quarterly price in PDP{' '}
                    </span>
                    <input
                        type="text"
                        value={
                            variant.quarterly && variant.quarterly.length > 0
                                ? variant.quarterly[0].marketPrice
                                : ''
                        }
                        onChange={(e) =>
                            variant.quarterly &&
                            handleVariantChange(index, 'quarterly', [
                                {
                                    ...variant.quarterly[0],
                                    marketPrice: parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder="QuarterlyMarket Price"
                        className="block w-full p-2 border border-gray-300 rounded-md"
                    />
                    <br />

                    <h3 className="text-cyan-700">Quarterly Checkout Price</h3>
                    <span className="text-emerald-500	">
                        This is the Monthly price for check-out, should be the
                        same as Original price
                    </span>
                    <input
                        type="text"
                        value={
                            variant.quarterly && variant.quarterly.length > 0
                                ? variant.quarterly[0].checkoutPrice
                                : ''
                        }
                        onChange={(e) =>
                            variant.quarterly &&
                            handleVariantChange(index, 'quarterly', [
                                {
                                    ...variant.quarterly[0],
                                    checkoutPrice: parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder="Quarterly Checkout Price"
                        className="block w-full p-2 border border-gray-300 rounded-md"
                    />
                    <br />

                    <h3 className="text-cyan-700">Quarterly Original Price</h3>
                    <span className="text-emerald-500	">
                        This is &ldquo;OUR&rdquo; Quarterly price in PDP
                    </span>
                    <input
                        type="text"
                        value={
                            variant.quarterly[0] && variant.quarterly.length > 0
                                ? variant.quarterly[0].originalPrice
                                : ''
                        }
                        onChange={(e) =>
                            variant.quarterly &&
                            handleVariantChange(index, 'quarterly', [
                                {
                                    ...variant.quarterly[0],
                                    originalPrice: parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder="Quarterly Original Price"
                        className="block w-full p-2 border border-gray-300 rounded-md"
                    />
                    <div>
                        <br />
                        <h3 className="text-cyan-700">Quarterly Bullets</h3>
                        {subscriptionBulletsQuaterly[index].map(
                            (bullet, bulletIndex) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                >
                                    <textarea
                                        rows={4}
                                        value={bullet}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 222) {
                                                handleSubscriptionBulletChangeQuaterly(
                                                    index,
                                                    'quarterly',
                                                    bulletIndex,
                                                    e.target.value,
                                                );
                                            }
                                        }}
                                        placeholder={`Quaterly Bullet Point ${
                                            index + 1
                                        }, limited in 222 characters`}
                                        className="block w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            ),
                        )}{' '}
                        <button
                            type="button"
                            onClick={() =>
                                addSubscriptionBulletQuaterly(
                                    index,
                                    'quarterly',
                                )
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                removeSubscriptionBulletQuarterly(index)
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            Remove
                        </button>
                        <br />
                        <br />
                    </div>
                    <button
                        type="button"
                        onClick={addVariant}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Add Variant
                    </button>
                    <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Remove Variant
                    </button>
                </div>
            </Paper>
        </div>
    ));
    return <div></div>;
};
