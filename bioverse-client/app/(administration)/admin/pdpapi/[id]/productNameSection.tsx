'use client';
import { Paper } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { fetchProduct } from '../../../../utils/actions/pdp-api/pdp-api';
import { useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';

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
    // 其他属性...
}
interface Product {
    name?: string;
    category?: string;
    type?: string;
    image_ref?: string[];
    chips?: string[];
    seals?: string[];
    benefits_short?: string[];
    benefits_long?: {
        benefits: { icon: string; header: string; description: string }[];
    };
    discountable?: number;
    variants?: string[];
    price?: number[];
    description_short?: string;
    instructions?: string;
    scientific_research?: string;
    citations?: string[];
    hero_review?: string;
    faq_questions?: { question: string; answer: string }[];
    safety_information?: string[];
    description_long?: string;
    href?: string;
    rating?: number;
    filter_metadata?: string[];
    safety_info_bold?: string[];
    safety_bullet?: string[];
    safety_info_link?: string[];
}
interface UpdatedPriceInfo {
    one_time?: any;
    monthly?: any;
    quarterly?: any;
    variant?: string;
    variant_index?: number;
}

interface UpdatedInfo {
    name?: string;
    category?: string;
    type?: string;
    image_ref?: string[];
    chips?: string[];
    seals?: string[];
    benefits_short?: string[];
    benefits_long?: {
        benefits: { icon: string; header: string; description: string }[];
    };
    discountable?: number;
    variants?: string[];
    price?: number[];
    description_short?: string;
    instructions?: string;
    scientific_research?: string;
    citations?: string[];
    hero_review?: string;
    faq_questions?: { question: string; answer: string }[];
    safety_information?: string[];
    description_long?: string;
    href?: string;
    rating?: number;
    filter_metadata?: string[];
    safety_info_bold?: string[];
    safety_bullet?: string[];
    safety_info_link?: string[];
    review_image_ref?: string[];
}

const ProductNameSection = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id') ?? '1';
    const [product, setProduct] = useState<Product | null>(null);
    const [name, setName] = useState('');
    const [type, setType] = useState('consultation');

    const [href, setHref] = useState('');
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [benefitsShort, setBenefitsShort] = useState('');
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
    const [descriptionShort, setDescriptionShort] = useState('');
    const [rating, setRating] = useState('');
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

    const [imageRef, setImageRef] = useState<string[]>([]);
    const [isEditable, setIsEditable] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleImageUpload = async (event: any) => {
        const supabase = createSupabaseBrowserClient();

        const file = event.target.files[0];
        if (!file) {
            console.error('No file selected');
            return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${href}.${fileExt}`;
        const filePath = `product-images/${href}/${fileName}`;

        try {
            let { error, data } = await supabase.storage
                .from('bioverse-images')
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            if (data && data.path) {
                setImageRef((prev) => {
                    if (data && data.path) {
                        return [...prev, data.path];
                    }
                    return prev;
                });
                alert('Image uploaded successfully');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

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
        setSubscriptionBulletsQuaterly((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex
                    ? bullets.map((bullet, bIdx) =>
                          bIdx === bulletIndex ? value : bullet,
                      )
                    : bullets,
            ),
        );

        setVariants((currentVariants) =>
            currentVariants.map((variant, vIdx) => {
                if (vIdx === variantIndex) {
                    const updatedPriceInfo = { ...variant[priceType][0] };
                    updatedPriceInfo.subcription_includes_bullets =
                        updatedPriceInfo.subcription_includes_bullets.map(
                            (bullet: any, bIdx: any) =>
                                bIdx === bulletIndex ? value : bullet,
                        );

                    return {
                        ...variant,
                        [priceType]: [updatedPriceInfo],
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

    const toggleEdit = () => {
        setIsEditable((prevEditable) => !prevEditable);
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
    useEffect(() => {
        if (!id) return;

        setLoading(true);
        fetchProduct(id)
            .then((response) => {
                if (response.data) {
                    setProduct(response.data);
                    setName(response.data.name);
                    setType(response.data.type);
                } else {
                    // Handle the case where there is no data
                    console.error('No data received:', response.error);
                    setError('Failed to load product details.');
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching product:', err);
                setError('Failed to load product details.');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>Product not found.</div>;
    }

    const removeSubscriptionBullet = (variantIndex: any, bulletIndex: any) => {
        setSubscriptionBullets((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex
                    ? bullets.filter((_, bIdx) => bIdx !== bulletIndex)
                    : bullets,
            ),
        );
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

    const handleHrefChange = (event: any) => {
        setHref(event.target.value);
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
    return (
        <section className="mb-10">
            <h1>NAME SECTION</h1>
            <br />
            <label>
                <h3 className="text-cyan-700">Product Name: {product.name}</h3>
                <div className="relative">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        readOnly={!isEditable}
                        className="w-full p-2 border border-gray-300 rounded-md pl-10" // Adjust left padding if necessary
                    />
                    <button
                        onClick={toggleEdit}
                        type="button"
                        className="absolute top-0 right-0 mt-2 mr-2 text-sm text-blue-500 hover:text-blue-700"
                    >
                        {isEditable ? 'Lock' : 'Edit'}
                    </button>
                </div>
            </label>
            <br />
            <label>
                <h3 className="text-cyan-700">Product Rating</h3>
                <span className="text-emerald-500	">
                    Please enter number 1-5 for product rating
                </span>
                <div className="relative">
                    <input
                        type="text"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        placeholder="Rating"
                        className="block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
            </label>
            <br />

            <label>
                <h3 className="text-cyan-700">Product Type</h3>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="block w-full p-2 border border-gray-300 rounded-md"
                >
                    {[
                        'consultation',
                        'cream',
                        'injection',
                        'patch',
                        'pill',
                        'powder',
                        'spray',
                        'test-kit',
                    ].map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                <h3 className="text-cyan-700">Short Description</h3>
                <span className="text-emerald-500	">
                    this goes to collection card and to the top of the PDP page,
                    limited in 125 characters
                </span>
                <textarea
                    rows={10}
                    value={descriptionShort}
                    onChange={(e) => {
                        if (e.target.value.length <= 125) {
                            setDescriptionShort(e.target.value);
                        }
                    }}
                    placeholder="Short Description, limited in 125 characters"
                    className="block w-full p-2 border border-gray-300 rounded-md"
                />
            </label>
            <br />
            <label>
                <h3 className="text-cyan-700"> Short Benefits</h3>
                <span className="text-emerald-500	">
                    This is bullet point on the top of PDP,separated by comma.
                    Example: &ldquo;Energy, Focus, Mood&rdquo;
                </span>
                <textarea
                    rows={10}
                    value={benefitsShort}
                    onChange={(e) => setBenefitsShort(e.target.value)}
                    placeholder="Short Benefits (comma-separated)"
                    className="block w-full p-2 border border-gray-300 rounded-md"
                />
            </label>
            <br />
            {variantForms}

            <br />
            <label>
                <h3 className="text-cyan-700">Href</h3>
                <span className="text-emerald-500	">
                    This means URL for the PDP, we normally put product name as
                    url
                </span>
                <input
                    type="text"
                    value={href}
                    onChange={handleHrefChange}
                    placeholder="Enter product href"
                    className="block w-full p-2 border border-gray-300 rounded-md"
                />
            </label>
            <br />
            {imageRef.map((ref, index) => (
                <img key={index} src={ref} alt="Uploaded" />
            ))}
            <input type="file" onChange={handleImageUpload} />
            <br />
            <label>
                <h3 className="text-cyan-700"> Image URL</h3>
                <span className="text-emerald-500	">
                    No Need to edit this, for display info only
                </span>
                <input
                    type="text"
                    value={imageRef}
                    onChange={handleImageUpload}
                    placeholder="Image URL"
                    className="block w-full p-2 border border-gray-300 rounded-md"
                />
            </label>
        </section>
    );
};

export default ProductNameSection;
