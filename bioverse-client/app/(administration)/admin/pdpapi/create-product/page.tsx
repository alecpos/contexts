'use client';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Paper } from '@mui/material';

import React, { useState } from 'react';
import {
    createProduct,
    createProductPrice,
} from '../../../../utils/actions/pdp-api/pdp-api';

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
    variant_index: string;
    subscriptionBullets: string[];
    subscriptionBulletsMonthly: string[];
    subscriptionBulletsQuaterly: string[];
}
type PriceFieldKeys = 'one_time' | 'monthly' | 'quarterly';

const CreateProductPage = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('prescriptions');
    const [type, setType] = useState('consultation');
    const [imageRef, setImageRef] = useState<string[]>([]);
    const [review_image_ref, setReview_image_ref] = useState<string[]>([]);
    const [chips, setChips] = useState('New,BestSeller,GMOFree');
    const [seals, setSeals] = useState([
        'seal-lab-tested',
        'seal-certified-pharmacist',
    ]);
    const [benefitsShort, setBenefitsShort] = useState(['']);
    const [benefitsLong, setBenefitsLong] = useState({
        benefits: [
            {
                icon: 'placeholder.png',
                header: '',
                description: '',
            },
        ],
    });
    const [price, setPrice] = useState('');
    const [descriptionShort, setDescriptionShort] = useState('');
    const [instructions, setInstructions] = useState('');
    const [scientificResearch, setScientificResearch] = useState(['']);
    const [citations, setCitations] = useState(['']);
    // const [heroReview, setHeroReview] = useState("");
    const [faqQuestions, setFaqQuestions] = useState([
        { question: '', answer: '' },
    ]);
    const [safetyBullets, setSafetyBullets] = useState<string[]>([]);
    const [safetyInformation, setSafetyInformation] = useState(['']);
    const [descriptionLong, setDescriptionLong] = useState(['']);
    const [href, setHref] = useState('');
    const [availableFilters, setAvailableFilters] = useState([
        'Energy and Cognitive Function',
        'Autoimmune Support',
        'Heart Health and Blood Pressure',
        'NAD+ Support',
        'GSH Support',
        // 'Erectile dysfunction',
        'Health Monitoring',
        // 'Hair loss',
        'Skincare',
    ]);

    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [rating, setRating] = useState('');
    const [safetyInfoLink, setSafetyInfoLink] = useState('');
    const [safetyInfoText, setSafetyInfoText] = useState('');
    const [safetyInfoBoldText, setSafetyInfoBoldText] = useState('');
    const [oneTimePrice, setOneTimePrice] = useState([
        {
            marketPrice: '',
            checkoutPrice: '',
            originalPrice: '',
            subcription_subtext: null,
            subcription_includes_bullets: '',
        },
    ]);
    const [subscriptionBullets, setSubscriptionBullets] = useState([['']]);
    const [subscriptionBulletsMonthly, setSubscriptionBulletsMonthly] =
        useState([['']]);
    const [subscriptionBulletsQuaterly, setSubscriptionBulletsQuaterly] =
        useState([['']]);

    const [monthlyPrice, setMonthlyPrice] = useState([
        {
            marketPrice: '',
            checkoutPrice: '',
            originalPrice: '',
            subcription_subtext: null,
            subcription_includes_bullets: '',
        },
    ]);
    const [quarterlyPrice, setQuarterlyPrice] = useState([
        {
            marketPrice: '',
            checkoutPrice: '',
            originalPrice: '',
            subcription_subtext: null,
            subcription_includes_bullets: '',
        },
    ]);
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
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const addBenefitShort = () => {
        setBenefitsShort([...benefitsShort, '']);
    };

    const removeBenefitShort = (index: any) => {
        setBenefitsShort(benefitsShort.filter((_, i) => i !== index));
    };

    const handleBenefitShortChange = (value: any, index: any) => {
        const updatedBenefits = benefitsShort.map((benefit, i) =>
            i === index ? value : benefit
        );
        setBenefitsShort(updatedBenefits);
    };

    const addParagraph = () => {
        setDescriptionLong([...descriptionLong, '']);
    };

    const removeParagraph = (index: any) => {
        setDescriptionLong(descriptionLong.filter((_, i) => i !== index));
    };

    const handleParagraphChange = (value: any, index: any) => {
        const newParagraphs = [...descriptionLong];
        newParagraphs[index] = value;
        setDescriptionLong(newParagraphs);
    };

    const addResearchParagraph = () => {
        setScientificResearch([...scientificResearch, '']);
    };

    const removeResearchParagraph = (index: any) => {
        setScientificResearch(scientificResearch.filter((_, i) => i !== index));
    };

    const handleResearchParagraphChange = (value: any, index: any) => {
        const newParagraphs = [...scientificResearch];
        newParagraphs[index] = value;
        setScientificResearch(newParagraphs);
    };

    const addSafetyInformationParagraph = () => {
        setSafetyInformation([...safetyInformation, '']);
    };

    const removeSafetyInformationParagraph = (index: any) => {
        setSafetyInformation(safetyInformation.filter((_, i) => i !== index));
    };

    const handleSafetyInformationParagraphChange = (value: any, index: any) => {
        const newParagraphs = [...safetyInformation];
        newParagraphs[index] = value;
        setSafetyInformation(newParagraphs);
    };

    const handleFilterDelete = (filterToRemove: any) => {
        setSelectedFilters(
            selectedFilters.filter((filter) => filter !== filterToRemove)
        );
    };

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

    const handleReviewImageUpload = async (event: any) => {
        const supabase = createSupabaseBrowserClient();

        const file = event.target.files[0];
        if (!file) {
            console.error('No file selected');
            return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `review-${href}.${fileExt}`;
        const filePath = `product-images/${href}/${fileName}`;

        try {
            let { error, data } = await supabase.storage
                .from('bioverse-images')
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            if (data && data.path) {
                setReview_image_ref((prev) => {
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

    const addFaqQuestion = () => {
        setFaqQuestions([...faqQuestions, { question: '', answer: '' }]);
    };

    const removeLastFaqQuestion = () => {
        setFaqQuestions((prevFaqQuestions) => prevFaqQuestions.slice(0, -1)); // 移除数组中的最后一个元素
    };

    const handleFaqChange = (
        index: number,
        key: keyof (typeof faqQuestions)[0],
        value: string
    ) => {
        const updatedFaqs = [...faqQuestions];
        updatedFaqs[index][key] = value;
        setFaqQuestions(updatedFaqs);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let formattedPrice = price
            .split(',')
            .map((p) => parseFloat(p.trim()))
            .filter((p) => !isNaN(p));
        let formattedFaqQuestions = faqQuestions.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
        }));
        let formattedChips = chips
            .split(',')
            .filter((chip) => chip.trim())
            .map((chip) => chip.trim());

        const productData = {
            name,
            category,
            type,
            image_ref: imageRef.map((ref) => ref.trim()),
            review_image_ref: review_image_ref
                .map((ref) => ref.trim())
                .toString(),
            chips: formattedChips,
            seals: seals.map((seal) => seal.trim()),
            benefits_short: benefitsShort.map((bs) => bs.trim()),
            benefits_long: benefitsLong,
            price: formattedPrice,
            description_short: descriptionShort,
            instructions: instructions,
            scientific_research: scientificResearch
                .map(
                    (paragraph) =>
                        `<bio-paragraph className="body1">${paragraph.trim()}</bio-paragraph>`
                )
                .join('\n'),
            citations: citations,
            // hero_review: heroReview,
            faq_questions: formattedFaqQuestions,
            safety_information: safetyInformation,
            description_long: descriptionLong
                .map(
                    (paragraph) =>
                        `<bio-paragraph>${paragraph.trim()}</bio-paragraph>`
                )
                .join('\n'),
            href,
            rating: parseFloat(rating),
            filter_metadata: selectedFilters,
            safety_info_bold: [safetyInfoBoldText],
            safety_bullet: safetyBullets,
            safety_info_link: [formattedSafetyInfoLink],
        };
        try {
            const productResponse = await createProduct(productData);
            if (!productResponse || typeof productResponse !== 'object') {
                throw new Error(
                    'Invalid product data returned by createProduct'
                );
            }

            const formatBulletPoints = (bullets: any) => {
                return (Array.isArray(bullets) ? bullets : [])
                    .filter((b) => b.trim() !== '')
                    .map(
                        (b) =>
                            `[bio-bullet-item]${b.replace(
                                /\n/g,
                                ''
                            )}[/bio-bullet-item]`
                    )
                    .join(' ');
            };

            const productId = productResponse.id;
            const productHerf = productResponse.href;

            const productPriceData = {
                reference_id: productId,
                product_href: productHerf,
                variants: variants.map((variant, index) => ({
                    variant: variant.variant,
                    one_time: variant.one_time.map((priceInfo) => ({
                        marketPrice: parseFloat(priceInfo.marketPrice),
                        checkoutPrice: parseFloat(priceInfo.checkoutPrice),
                        originalPrice: parseFloat(priceInfo.originalPrice),
                        subcription_includes_bullets: formatBulletPoints(
                            priceInfo.subcription_includes_bullets
                        ),
                    })),
                    monthly: variant.monthly.map((priceInfo) => ({
                        marketPrice: parseFloat(priceInfo.marketPrice),
                        checkoutPrice: parseFloat(priceInfo.checkoutPrice),
                        originalPrice: parseFloat(priceInfo.originalPrice),
                        subcription_subtext: priceInfo.subcription_subtext,
                        subcription_includes_bullets: formatBulletPoints(
                            priceInfo.subcription_includes_bullets
                        ),
                    })),
                    quarterly: variant.quarterly.map((priceInfo) => ({
                        marketPrice: parseFloat(priceInfo.marketPrice),
                        checkoutPrice: parseFloat(priceInfo.checkoutPrice),
                        originalPrice: parseFloat(priceInfo.originalPrice),
                        subcription_subtext: priceInfo.subcription_subtext,
                        subcription_includes_bullets: formatBulletPoints(
                            priceInfo.subcription_includes_bullets
                        ),
                    })),
                    variant_index: index,
                })),
            };

            const priceResponse = await createProductPrice(
                productId,
                productHerf,
                productPriceData
            );

            if (!priceResponse) {
                throw new Error(
                    'Invalid price data returned by createProductPrice'
                );
            }

            // Success feedback to the user
            alert('Product and pricing data created successfully.');
        } catch (error: any) {
            console.error(error);
            // Error feedback to the user
        }
    };

    const addNewBenefit = () => {
        setBenefitsLong((prevState) => ({
            ...prevState,
            benefits: [
                { icon: 'placeholder.png', header: '', description: '' },
                ...prevState.benefits,
            ],
        }));
    };

    const removeLastBenefit = () => {
        setBenefitsLong((prevState) => ({
            ...prevState,
            benefits: prevState.benefits.slice(0, -1),
        }));
    };

    const updateBenefit = (index: any, key: any, value: any) => {
        const updatedBenefits = benefitsLong.benefits.map((benefit, i) =>
            i === index ? { ...benefit, [key]: value } : benefit
        );
        setBenefitsLong({ benefits: updatedBenefits });
    };

    const handleSafetyInformationChange = (e: any) => {
        const lines = e.target.value.split(/\r?\n/);
        setSafetyInformation(lines);
    };

    const handleFilterSelect = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedOption = event.target.value;
        const formattedOption = selectedOption
            .toLowerCase()
            .replace(/\s+/g, '-');

        // Check if selectedFilters includes the formattedOption
        if (!selectedFilters.includes(formattedOption)) {
            setSelectedFilters((prevSelectedFilters) => [
                ...prevSelectedFilters,
                formattedOption,
            ]);
        }
    };

    const handleCitationChange = (index: any, newValue: any) => {
        const newCitations = [...citations];
        newCitations[index] = newValue;
        setCitations(newCitations);
    };

    const addCitation = () => {
        setCitations([...citations, '']);
    };

    const removeLastCitation = () => {
        setCitations((prevCitations) => prevCitations.slice(0, -1));
    };

    const addSafetyBullet = () => {
        setSafetyBullets([...safetyBullets, '']);
    };
    const removeLastSafetyBullet = () => {
        setSafetyBullets((prevSafetyBullets) => prevSafetyBullets.slice(0, -1));
    };

    const updateSafetyBullet = (index: any, value: any) => {
        const updatedBullets = safetyBullets.map((bullet, i) =>
            i === index ? value : bullet
        );
        setSafetyBullets(updatedBullets);
    };

    const handleSubscriptionBulletChange = (
        variantIndex: any,
        priceType: 'one_time' | 'monthly' | 'quarterly',
        bulletIndex: any,
        value: any
    ) => {
        setSubscriptionBullets((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex
                    ? bullets.map((bullet, bIdx) =>
                          bIdx === bulletIndex ? value : bullet
                      )
                    : bullets
            )
        );

        // 同时更新variants数组中的对应数据
        setVariants((currentVariants) =>
            currentVariants.map((variant, vIdx) => {
                if (vIdx === variantIndex) {
                    const updatedPriceInfo = { ...variant[priceType][0] }; // 假设只有一个价格层级
                    updatedPriceInfo.subcription_includes_bullets =
                        updatedPriceInfo.subcription_includes_bullets.map(
                            (bullet: any, bIdx: any) =>
                                bIdx === bulletIndex ? value : bullet
                        );

                    return {
                        ...variant,
                        [priceType]: [updatedPriceInfo], // 更新对应价格类型的子弹点数据
                    };
                }
                return variant;
            })
        );
    };

    const handleSubscriptionBulletChangeMonthly = (
        variantIndex: any,
        priceType: 'one_time' | 'monthly' | 'quarterly',
        bulletIndex: any,
        value: any
    ) => {
        // 更新用于UI显示的subscriptionBullets
        setSubscriptionBulletsMonthly((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex
                    ? bullets.map((bullet, bIdx) =>
                          bIdx === bulletIndex ? value : bullet
                      )
                    : bullets
            )
        );

        // 同时更新variants数组中的对应数据
        setVariants((currentVariants) =>
            currentVariants.map((variant, vIdx) => {
                if (vIdx === variantIndex) {
                    const updatedPriceInfo = { ...variant[priceType][0] }; // 假设只有一个价格层级
                    updatedPriceInfo.subcription_includes_bullets =
                        updatedPriceInfo.subcription_includes_bullets.map(
                            (bullet: any, bIdx: any) =>
                                bIdx === bulletIndex ? value : bullet
                        );

                    return {
                        ...variant,
                        [priceType]: [updatedPriceInfo], // 更新对应价格类型的子弹点数据
                    };
                }
                return variant;
            })
        );
    };

    const handleSubscriptionBulletChangeQuaterly = (
        variantIndex: any,
        priceType: 'one_time' | 'monthly' | 'quarterly',
        bulletIndex: any,
        value: any
    ) => {
        // 更新用于UI显示的subscriptionBullets
        setSubscriptionBulletsQuaterly((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex
                    ? bullets.map((bullet, bIdx) =>
                          bIdx === bulletIndex ? value : bullet
                      )
                    : bullets
            )
        );

        // 同时更新variants数组中的对应数据
        setVariants((currentVariants) =>
            currentVariants.map((variant, vIdx) => {
                if (vIdx === variantIndex) {
                    const updatedPriceInfo = { ...variant[priceType][0] }; // 假设只有一个价格层级
                    updatedPriceInfo.subcription_includes_bullets =
                        updatedPriceInfo.subcription_includes_bullets.map(
                            (bullet: any, bIdx: any) =>
                                bIdx === bulletIndex ? value : bullet
                        );

                    return {
                        ...variant,
                        [priceType]: [updatedPriceInfo], // 更新对应价格类型的子弹点数据
                    };
                }
                return variant;
            })
        );
    };

    const addSubscriptionBullet = (variantIndex: any, priceType: PriceType) => {
        setSubscriptionBullets((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex ? [...bullets, ''] : bullets
            )
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
            })
        );
    };

    const addSubscriptionBulletMonthly = (
        variantIndex: any,
        priceType: PriceType
    ) => {
        setSubscriptionBulletsMonthly((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex ? [...bullets, ''] : bullets
            )
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
            })
        );
    };

    const addSubscriptionBulletQuaterly = (
        variantIndex: any,
        priceType: PriceType
    ) => {
        setSubscriptionBulletsQuaterly((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex ? [...bullets, ''] : bullets
            )
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
            })
        );
    };
    const safetyInfoLinkFormatted = `[click here](${safetyInfoLink})`;
    const formattedSafetyInfoLink = safetyInfoText + safetyInfoLinkFormatted;

    const handleHrefChange = (event: any) => {
        setHref(event.target.value);
    };

    const removeSubscriptionBullet = (variantIndex: any, bulletIndex: any) => {
        setSubscriptionBullets((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex
                    ? bullets.filter((_, bIdx) => bIdx !== bulletIndex)
                    : bullets
            )
        );
    };

    const removeSubscriptionBulletMonthly = (
        variantIndex: any,
        bulletIndex: any
    ) => {
        setSubscriptionBulletsMonthly((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex
                    ? bullets.filter((_, bIdx) => bIdx !== bulletIndex)
                    : bullets
            )
        );
    };

    const removeSubscriptionBulletQuarterly = (
        variantIndex: any,
        bulletIndex: any
    ) => {
        setSubscriptionBulletsQuaterly((currentBullets) =>
            currentBullets.map((bullets, idx) =>
                idx === variantIndex
                    ? bullets.filter((_, bIdx) => bIdx !== bulletIndex)
                    : bullets
            )
        );
    };

    const addVariant = () => {
        const newIndex = variants.length;

        const formatPrice = (priceInfo: any) => {
            return {
                ...priceInfo,
                marketPrice: priceInfo.marketPrice.toString(),
                checkoutPrice: priceInfo.checkoutPrice.toString(),
                originalPrice: priceInfo.originalPrice.toString(),
                subcription_subtext: priceInfo.subcription_subtext || '',
                subcription_includes_bullets:
                    priceInfo.subcription_includes_bullets || [''],
            };
        };

        const newOneTimePrice = oneTimePrice[0]
            ? formatPrice(oneTimePrice[0])
            : {
                  marketPrice: '',
                  checkoutPrice: '',
                  originalPrice: '',
                  subcription_subtext: '',
                  subcription_includes_bullets: [''],
              };

        const newMonthlyPrice = monthlyPrice[0]
            ? formatPrice(monthlyPrice[0])
            : {
                  marketPrice: '',
                  checkoutPrice: '',
                  originalPrice: '',
                  subcription_subtext: '',
                  subcription_includes_bullets: [''],
              };

        const newQuarterlyPrice = quarterlyPrice[0]
            ? formatPrice(quarterlyPrice[0])
            : {
                  marketPrice: '',
                  checkoutPrice: '',
                  originalPrice: '',
                  subcription_subtext: '',
                  subcription_includes_bullets: [''],
              };
        setSubscriptionBullets((prevBullets) => [...prevBullets, ['']]);
        setSubscriptionBulletsMonthly((prevBullets) => [...prevBullets, ['']]);
        setSubscriptionBulletsQuaterly((prevBullets) => [...prevBullets, ['']]);

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
    };

    const handleSnackbarClose = (event: any, reason: any) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };
    const removeVariant = (index: any) => {
        setVariants(variants.filter((_, i) => i !== index));
        setSnackbarOpen(true);
        setSnackbarMessage('Variant removed');
    };

    const handleVariantChange = (
        variantIndex: number,
        field: string,
        value: any,
        priceField: PriceFieldKeys | null = null,
        priceIndex: number | null = null
    ) => {
        setVariants((currentVariants) =>
            currentVariants.map((variant, idx) => {
                if (idx === variantIndex) {
                    if (
                        priceField &&
                        variant[priceField] &&
                        Array.isArray(variant[priceField])
                    ) {
                        const updatedPrice = variant[priceField].map(
                            (price, pIdx) => {
                                if (pIdx === priceIndex) {
                                    return { ...price, [field]: value };
                                }
                                return price;
                            }
                        );

                        return { ...variant, [priceField]: updatedPrice };
                    } else {
                        return { ...variant, [field]: value };
                    }
                }
                return variant;
            })
        );
    };

    const variantForms = variants.map((variant, index) => (
        <div key={index} className='mb-4'>
            <Paper className='p-6'>
                <div>
                    <h3 className='text-emerald-600	'>Variant #{index + 1}</h3>
                    <input
                        type='text'
                        value={variant.variant}
                        onChange={(e) =>
                            handleVariantChange(
                                index,
                                'variant',
                                e.target.value
                            )
                        }
                        placeholder='Variant Name'
                        className='block w-full p-2 border border-gray-300 rounded-md'
                    />
                    <br />

                    <h3 className='text-emerald-600	'>One Time Market price</h3>
                    <span className='text-emerald-500	'>
                        This is the cross-out one time price in PDP{' '}
                    </span>
                    <input
                        type='text'
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
                                    marketPrice:
                                        e.target.value === ''
                                            ? null
                                            : parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder='One Time Market Price'
                        className='block w-full p-2 border border-gray-300 rounded-md'
                    />
                    <br />

                    <h3 className='text-emerald-600	'>
                        One Time Checkout price
                    </h3>
                    <span className='text-emerald-500	'>
                        This is the one time price for check-out, should be the
                        same as Original price
                    </span>
                    <input
                        type='text'
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
                                    checkoutPrice:
                                        e.target.value === ''
                                            ? null
                                            : parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder='One Time Checkout Price'
                        className='block w-full p-2 border border-gray-300 rounded-md'
                    />
                    <br />

                    <h3 className='text-emerald-600	'>
                        One Time Original price
                    </h3>
                    <span className='text-emerald-500	'>
                        This is &ldquo;OUR&rdquo; one time price in PDP{' '}
                    </span>
                    <input
                        type='text'
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
                                    originalPrice:
                                        e.target.value === ''
                                            ? null
                                            : parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder='One Time Original Price'
                        className='block w-full p-2 border border-gray-300 rounded-md'
                    />
                    <div>
                        <br />

                        <h3 className='text-emerald-600	'>One Time Bullets</h3>
                        {subscriptionBullets[index].map(
                            (bullet, bulletIndex) => (
                                <div
                                    key={bulletIndex}
                                    className='flex items-center space-x-2 mt-2'
                                >
                                    <textarea
                                        rows={7}
                                        value={bullet}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 222) {
                                                handleSubscriptionBulletChange(
                                                    index, // 这里使用 index 作为 variantIndex
                                                    'one_time',
                                                    bulletIndex,
                                                    e.target.value
                                                );
                                            }
                                        }}
                                        placeholder={`Bullet Point ${
                                            bulletIndex + 1
                                        }, limited in 222 characters`}
                                        className='block w-full p-2 border border-gray-300 rounded-md'
                                    />
                                    <button
                                        type='button'
                                        onClick={() =>
                                            addSubscriptionBullet(
                                                index,
                                                'one_time'
                                            )
                                        }
                                        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                                    >
                                        Add
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            removeSubscriptionBullet(
                                                index,
                                                bulletIndex
                                            )
                                        }
                                        className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                                    >
                                        Remove
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div>
                    <br />
                    <h3 className='text-emerald-600	'>Monthly Market price</h3>
                    <span className='text-emerald-500	'>
                        This is the cross-out Monthly price in PDP {':))'}
                    </span>
                    <input
                        type='text'
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
                                    marketPrice:
                                        e.target.value === ''
                                            ? null
                                            : parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder='Monthly Market Price'
                        className='block w-full p-2 border border-gray-300 rounded-md'
                    />
                    <br />
                    <h3 className='text-emerald-600	'>Monthly Checkout price</h3>
                    <span className='text-emerald-500	'>
                        This is the Monthly price for check-out, should be the
                        same as Original price
                    </span>
                    <input
                        type='text'
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
                                    checkoutPrice:
                                        e.target.value === ''
                                            ? null
                                            : parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder='Monthly Checkout Price'
                        className='block w-full p-2 border border-gray-300 rounded-md'
                    />
                    <br />
                    <h3 className='text-emerald-600	'>Monthly Original price</h3>
                    <span className='text-emerald-500	'>
                        This is &ldquo;OUR&rdquo; Monthly price in PDP{' '}
                    </span>{' '}
                    <input
                        type='text'
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
                                    originalPrice:
                                        e.target.value === ''
                                            ? null
                                            : parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder='Monthly Original Price'
                        className='block w-full p-2 border border-gray-300 rounded-md'
                    />
                    <div>
                        <br />

                        <h3 className='text-emerald-600	'>Monthly Bullets</h3>
                        {subscriptionBulletsMonthly[index].map(
                            (bullet, bulletIndex) => (
                                <div
                                    key={index}
                                    className='flex items-center space-x-2'
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
                                                    e.target.value
                                                );
                                            }
                                        }}
                                        placeholder={`Monthly Bullet Point ${
                                            index + 1
                                        }, limited in 222 characters`}
                                        className='block w-full p-2 border border-gray-300 rounded-md'
                                    />
                                    <button
                                        type='button'
                                        onClick={() =>
                                            addSubscriptionBulletMonthly(
                                                index,
                                                'monthly'
                                            )
                                        }
                                        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                                    >
                                        Add
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            removeSubscriptionBulletMonthly(
                                                index,
                                                bulletIndex
                                            )
                                        }
                                        className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                                    >
                                        Remove
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                    <br />
                    <h3 className='text-emerald-600	'>Monthly Subtext</h3>
                    <span className='text-emerald-500	'>
                        This is Monthly Subtext in PDP{' '}
                    </span>{' '}
                    <input
                        type='text'
                        value={
                            variant.monthly[0] && variant.monthly.length > 0
                                ? variant.monthly[0].subcription_subtext
                                : ''
                        }
                        onChange={(e) =>
                            variant.monthly &&
                            handleVariantChange(index, 'monthly', [
                                {
                                    ...variant.monthly[0],
                                    subcription_subtext: e.target.value,
                                },
                            ])
                        }
                        placeholder='Monthly Original Price'
                        className='block w-full p-2 border border-gray-300 rounded-md'
                    />
                </div>
                <div>
                    <br />
                    <h3 className='text-emerald-600	'>Quarterly Market Price</h3>
                    <span className='text-emerald-500	'>
                        This is the cross-out Quarterly price in PDP{' '}
                    </span>
                    <input
                        type='text'
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
                                    marketPrice:
                                        e.target.value === ''
                                            ? null
                                            : parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder='QuarterlyMarket Price'
                        className='block w-full p-2 border border-gray-300 rounded-md'
                    />
                    <br />
                    <h3 className='text-emerald-600	'>
                        Quarterly Checkout Price
                    </h3>
                    <span className='text-emerald-500	'>
                        This is the Monthly price for check-out, should be the
                        same as Original price
                    </span>
                    <input
                        type='text'
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
                                    checkoutPrice:
                                        e.target.value === ''
                                            ? null
                                            : parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder='Quarterly Checkout Price'
                        className='block w-full p-2 border border-gray-300 rounded-md'
                    />
                    <br />
                    <h3 className='text-emerald-600	'>
                        Quarterly Original Price
                    </h3>
                    <span className='text-emerald-500	'>
                        This is &ldquo;OUR&rdquo; Quarterly price in PDP
                    </span>
                    <input
                        type='text'
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
                                    originalPrice:
                                        e.target.value === ''
                                            ? null
                                            : parseFloat(e.target.value),
                                },
                            ])
                        }
                        placeholder='Quarterly Original Price'
                        className='block w-full p-2 border border-gray-300 rounded-md'
                    />
                    <div>
                        <br />
                        <h3 className='text-emerald-600	'>Quarterly Bullets</h3>
                        {subscriptionBulletsQuaterly[index].map(
                            (bullet, bulletIndex) => (
                                <div
                                    key={index}
                                    className='flex items-center space-x-2'
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
                                                    e.target.value
                                                );
                                            }
                                        }}
                                        placeholder={`Quaterly Bullet Point ${
                                            index + 1
                                        }, limited in 222 characters`}
                                        className='block w-full p-2 border border-gray-300 rounded-md'
                                    />
                                    <button
                                        type='button'
                                        onClick={() =>
                                            addSubscriptionBulletQuaterly(
                                                index,
                                                'quarterly'
                                            )
                                        }
                                        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                                    >
                                        Add
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            removeSubscriptionBulletQuarterly(
                                                index,
                                                bulletIndex
                                            )
                                        }
                                        className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                                    >
                                        Remove
                                    </button>
                                </div>
                            )
                        )}{' '}
                    </div>
                    <br />
                    <h3 className='text-emerald-600	'>Quarterly Subtext</h3>
                    <span className='text-emerald-500	'>
                        This is Quarterly Subtext in PDP{' '}
                    </span>{' '}
                    <input
                        type='text'
                        value={
                            variant.quarterly[0] && variant.quarterly.length > 0
                                ? variant.quarterly[0].subcription_subtext
                                : ''
                        }
                        onChange={(e) =>
                            variant.quarterly &&
                            handleVariantChange(index, 'quarterly', [
                                {
                                    ...variant.quarterly[0],
                                    subcription_subtext: e.target.value,
                                },
                            ])
                        }
                        placeholder='Quarterly Original Price'
                        className='block w-full p-2 border border-gray-300 rounded-md'
                    />
                    <button
                        type='button'
                        onClick={addVariant}
                        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                    >
                        Add Variant
                    </button>
                    {/* <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
            action={
              <React.Fragment>
                <Button
                  color="primary"
                  size="small"
                  onClick={handleSnackbarClose}
                >
                  UNDO
                </Button>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={handleSnackbarClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          /> */}
                    <button
                        type='button'
                        onClick={() => removeVariant(index)}
                        className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                    >
                        Remove Variant
                    </button>
                </div>
            </Paper>
        </div>
    ));
    return (
        <div className='p-4 max-w-md mx-auto '>
            <a
                href='/admin/pdpapi'
                className='mb-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
                Return
            </a>
            <h1>Create Product</h1>
            <br />
            <form onSubmit={handleSubmit} className='space-y-4  '>
                <section className='mb-10 border-solid border-2 border-indigo-600 p-10 w-full'>
                    <h2>NAME SECTION</h2>
                    <br />
                    <label>
                        <h3 className='text-emerald-600	'>Product Name</h3>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Name'
                            className='block w-full p-2 border border-gray-300 rounded-md'
                        />
                    </label>
                    <br />
                    <label>
                        <h3 className='text-emerald-600	'>Product Rating</h3>
                        <span className='text-emerald-500	'>
                            Please enter number 1-5 for product rating
                        </span>
                        <input
                            type='text'
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            placeholder='Rating'
                            className='block w-full p-2 border border-gray-300 rounded-md'
                        />
                    </label>
                    <br />

                    <label>
                        <h3 className='text-emerald-600	'>Product Type</h3>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className='block w-full p-2 border border-gray-300 rounded-md'
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
                        <h3 className='text-emerald-600	'> Short Description</h3>
                        <span className='text-emerald-500	'>
                            this goes to collection card and to the top of the
                            PDP page
                        </span>
                        <textarea
                            rows={10}
                            value={descriptionShort}
                            onChange={(e) =>
                                setDescriptionShort(e.target.value)
                            }
                            placeholder='Short Description'
                            className='block w-full p-2 border border-gray-300 rounded-md'
                        />
                    </label>
                    <br />
                    <label>
                        <h3 className='text-emerald-600'>Short Benefits</h3>
                        <span className='text-emerald-500'>
                            limited in 222 characters
                        </span>
                        {benefitsShort.map((benefit, index) => (
                            <div
                                key={index}
                                className='flex items-center space-x-2 mt-2'
                            >
                                <textarea
                                    rows={6}
                                    value={benefit}
                                    onChange={(e) =>
                                        handleBenefitShortChange(
                                            e.target.value,
                                            index
                                        )
                                    }
                                    placeholder={`Benefit ${index + 1}`}
                                    className='block w-full p-2 border border-gray-300 rounded-md'
                                />
                                <button
                                    type='button'
                                    onClick={() => removeBenefitShort(index)}
                                    className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type='button'
                            onClick={addBenefitShort}
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2'
                        >
                            Add Benefit
                        </button>
                    </label>
                    <br />
                    {variantForms}

                    <br />
                    <label>
                        <h3 className='text-emerald-600	'>Href</h3>
                        <span className='text-emerald-500	'>
                            This means URL for the PDP, we normally put product
                            name as url
                        </span>
                        <input
                            type='text'
                            value={href}
                            onChange={handleHrefChange}
                            placeholder='Enter product href'
                            className='block w-full p-2 border border-gray-300 rounded-md'
                        />
                    </label>
                    <br />
                    {imageRef.map((ref, index) => (
                        <img key={index} src={ref} alt='Uploaded' />
                    ))}
                    <input type='file' onChange={handleImageUpload} />
                    <br />
                    <label>
                        <h3 className='text-emerald-600	'>Image URL</h3>
                        <span className='text-emerald-500	'>
                            No Need to edit this, for display info only
                        </span>
                        <input
                            type='text'
                            value={imageRef}
                            onChange={handleImageUpload}
                            placeholder='Image URL'
                            className='block w-full p-2 border border-gray-300 rounded-md'
                        />
                    </label>
                </section>
                <section className='mt-10 border-solid border-2 border-indigo-600 p-10 w-full'>
                    <h1>
                        NO INSURANCE REQUIRED • FREE SHIPPING • DELIVERED TO
                        YOUR DOOR
                    </h1>
                    <br />
                    <label>
                        <h3 className='text-emerald-600'>Long Description</h3>
                        <span className='text-emerald-500'>
                            Add paragraphs using the buttons below.
                        </span>
                        {descriptionLong.map((paragraph, index) => (
                            <div key={index} className='mb-2'>
                                <textarea
                                    rows={4}
                                    value={paragraph}
                                    onChange={(e) =>
                                        handleParagraphChange(
                                            e.target.value,
                                            index
                                        )
                                    }
                                    placeholder='Enter paragraph text here.'
                                    className='block w-full p-2 border border-gray-300 rounded-md mb-1'
                                />
                                <button
                                    type='button'
                                    onClick={() => removeParagraph(index)}
                                    className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                                >
                                    Remove Paragraph
                                </button>
                            </div>
                        ))}
                        <button
                            type='button'
                            onClick={addParagraph}
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2'
                        >
                            Add Paragraph
                        </button>
                    </label>
                    <br />
                    <label>
                        <h3 className='text-emerald-600	'> Long Benefits</h3>
                        {Array.isArray(benefitsLong.benefits) &&
                            benefitsLong.benefits &&
                            benefitsLong.benefits.map((benefit, index) => (
                                <div key={index}>
                                    <textarea
                                        rows={4}
                                        value={benefit.header}
                                        onChange={(e) =>
                                            updateBenefit(
                                                index,
                                                'header',
                                                e.target.value
                                            )
                                        }
                                        placeholder='Header'
                                        className='block w-full p-2 border border-gray-300 rounded-md'
                                    />
                                    <textarea
                                        rows={10}
                                        value={benefit.description}
                                        onChange={(e) =>
                                            updateBenefit(
                                                index,
                                                'description',
                                                e.target.value
                                            )
                                        }
                                        placeholder='Description'
                                        className='block w-full p-2 border border-gray-300 rounded-md'
                                    />
                                </div>
                            ))}
                        <button
                            type='button'
                            onClick={addNewBenefit}
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                        >
                            Add New Benefit
                        </button>
                        <button
                            type='button'
                            onClick={removeLastBenefit}
                            className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2' // ml-2 为按钮添加一些左边距
                        >
                            Remove New Benefit
                        </button>
                    </label>
                    <br />
                    <label>
                        <h3 className='text-emerald-600	'> Instructions</h3>
                        <textarea
                            rows={10}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder='Instructions'
                            className='block w-full p-2 border border-gray-300 rounded-md'
                        />
                    </label>
                </section>
                <section className='mt-24 border-solid border-2 border-indigo-600 p-10 w-full'>
                    <h1>Mechanism of Action</h1>
                    <br />
                    <label>
                        <h3 className='text-emerald-600'>
                            Scientific Research
                        </h3>
                        <span className='text-emerald-500'>
                            Add paragraphs using the buttons below.
                        </span>
                        {scientificResearch.map((paragraph, index) => (
                            <div key={index} className='mb-2'>
                                <textarea
                                    rows={4}
                                    value={paragraph}
                                    onChange={(e) =>
                                        handleResearchParagraphChange(
                                            e.target.value,
                                            index
                                        )
                                    }
                                    placeholder='Enter scientific research text here.'
                                    className='block w-full p-2 border border-gray-300 rounded-md mb-1'
                                />
                                <button
                                    type='button'
                                    onClick={() =>
                                        removeResearchParagraph(index)
                                    }
                                    className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                                >
                                    Remove Paragraph
                                </button>
                            </div>
                        ))}
                        <button
                            type='button'
                            onClick={addResearchParagraph}
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2'
                        >
                            Add Paragraph
                        </button>
                    </label>
                    <br />
                    <label>
                        <h3 className='text-emerald-600	'>Citations</h3>
                        {citations.map((citation, index) => (
                            <textarea
                                rows={4}
                                key={index}
                                value={citation}
                                onChange={(e) =>
                                    handleCitationChange(index, e.target.value)
                                }
                                placeholder='Enter citation'
                                className='block w-full p-2 border border-gray-300 rounded-md'
                            />
                        ))}
                        <button
                            type='button'
                            onClick={addCitation}
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                        >
                            Add New Citation
                        </button>
                        <button
                            type='button'
                            onClick={removeLastCitation}
                            className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2' // ml-2 为按钮添加一些左边距
                        >
                            Remove New Citation
                        </button>
                    </label>
                    <br />
                </section>
                {/* <section>
          <h1>Customer Review</h1>
          <br />
          <label>
            <h3 className="text-emerald-600	"> Hero Review</h3>
            <span className="text-emerald-500	">Please put number 1-5 </span>
            <input
              type="text"
              value={heroReview}
              onChange={(e) => setHeroReview(e.target.value)}
              placeholder="Hero Review"
              className="block w-full p-2 border border-gray-300 rounded-md"
            />
          </label>
        </section> */}
                <section className='mt-10 border-solid border-2 border-indigo-600 p-10 w-full'>
                    <h1>Frequently Asked Questions</h1>
                    <br />
                    {Array.isArray(faqQuestions) &&
                        faqQuestions.map((faq, index) => (
                            <div key={index} className='mb-4'>
                                <label>
                                    <h3 className='text-emerald-600	'>
                                        {' '}
                                        FAQ Question
                                    </h3>
                                    <textarea
                                        rows={4}
                                        value={faq.question}
                                        onChange={(e) =>
                                            handleFaqChange(
                                                index,
                                                'question',
                                                e.target.value
                                            )
                                        }
                                        placeholder='FAQ Question'
                                        className='block w-full p-2 border border-gray-300 rounded-md mb-2'
                                    />
                                </label>

                                <label>
                                    <h3 className='text-emerald-600	'>
                                        {' '}
                                        FAQ Answer
                                    </h3>
                                    <textarea
                                        rows={10}
                                        value={faq.answer}
                                        onChange={(e) =>
                                            handleFaqChange(
                                                index,
                                                'answer',
                                                e.target.value
                                            )
                                        }
                                        placeholder='FAQ Answer'
                                        className='block w-full p-2 border border-gray-300 rounded-md'
                                    />
                                </label>
                            </div>
                        ))}

                    <button
                        type='button'
                        onClick={addFaqQuestion}
                        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                    >
                        Add FAQ Question
                    </button>
                    <button
                        type='button'
                        onClick={removeLastFaqQuestion}
                        className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2' // ml-2 为按钮添加一些左边距
                    >
                        Remove FAQ Question
                    </button>
                </section>
                <section className='mt-10 border-solid border-2 border-indigo-600 p-10 w-full'>
                    <h1>Important Safety Information & Side Effects</h1>
                    <br />
                    <label>
                        <h3 className='text-emerald-600'>Safety Information</h3>
                        <span className='text-emerald-500'>
                            Add paragraphs using the buttons below.
                        </span>
                        {safetyInformation.map((paragraph, index) => (
                            <div key={index} className='mb-2'>
                                <textarea
                                    rows={4}
                                    value={paragraph}
                                    onChange={(e) =>
                                        handleSafetyInformationParagraphChange(
                                            e.target.value,
                                            index
                                        )
                                    }
                                    placeholder='Enter safety information here.'
                                    className='block w-full p-2 border border-gray-300 rounded-md mb-1'
                                />
                                <button
                                    type='button'
                                    onClick={() =>
                                        removeSafetyInformationParagraph(index)
                                    }
                                    className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                                >
                                    Remove Paragraph
                                </button>
                            </div>
                        ))}
                        <button
                            type='button'
                            onClick={addSafetyInformationParagraph}
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2'
                        >
                            Add Paragraph
                        </button>
                    </label>
                    <label>
                        <h3 className='text-emerald-600	'> Safety Info Bold</h3>
                        <textarea
                            rows={10}
                            value={safetyInfoBoldText}
                            onChange={(e) =>
                                setSafetyInfoBoldText(e.target.value)
                            }
                            placeholder='Enter safety information here.'
                            className='block w-full p-2 border border-gray-300 rounded-md'
                        />
                    </label>
                    <div>
                        <h3 className='text-emerald-600	'>
                            {' '}
                            Safety Info Bullet point
                        </h3>

                        {safetyBullets.map((bullet, index) => (
                            <textarea
                                key={index}
                                rows={4}
                                value={bullet}
                                onChange={(e) =>
                                    updateSafetyBullet(index, e.target.value)
                                }
                                placeholder={`Bullet Point ${index + 1}`}
                                className='block w-full p-2 border border-gray-300 rounded-md mb-2'
                            />
                        ))}
                        <button
                            type='button'
                            onClick={addSafetyBullet}
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                        >
                            Add Safety Bullet Point
                        </button>
                        <button
                            type='button'
                            onClick={removeLastSafetyBullet}
                            className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2' // ml-2 为按钮添加一些左边距
                        >
                            Remove Safety Bullet Point
                        </button>
                    </div>
                    <div>
                        <h3 className='text-emerald-600	'>
                            {' '}
                            Safety Info text before Link
                        </h3>

                        <textarea
                            rows={10}
                            value={safetyInfoText}
                            onChange={(e) => setSafetyInfoText(e.target.value)}
                            placeholder='Safety Information Text'
                            className='block w-full p-2 border border-gray-300 rounded-md mb-2'
                        />
                        <h3 className='text-emerald-600	'>
                            {' '}
                            Safety Info text Link
                        </h3>

                        <input
                            type='text'
                            value={safetyInfoLink}
                            onChange={(e) => setSafetyInfoLink(e.target.value)}
                            placeholder='Safety Information Link'
                            className='block w-full p-2 border border-gray-300 rounded-md mb-2'
                        />
                    </div>
                </section>

                <section className='mt-10 border-solid border-2 border-indigo-600 p-10 w-full'>
                    <h1>Colletion page</h1>
                    <br />
                    <label>
                        <h3 className='text-emerald-600	'> Category</h3>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className='block w-full p-2 border border-gray-300 rounded-md'
                        >
                            {[
                                'prescriptions',
                                'supplements',
                                'test-kits',
                                'consulting',
                            ].map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <label>
                        <h3 className='text-emerald-600	'>Price</h3>
                        <span className='text-emerald-500	'>
                            This is the price for collection card, which is
                            &ldquo;starting at $xx&rdquo;
                        </span>
                        <input
                            type='text'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder='Price'
                            className='block w-full p-2 border border-gray-300 rounded-md'
                        />
                    </label>
                    <br />
                    <label>
                        <h3 className='text-emerald-600	'>Filter Metadata</h3>
                        <select
                            onChange={handleFilterSelect}
                            className='block w-full p-2 border border-gray-300 rounded-md'
                        >
                            {availableFilters.map((filter, index) => (
                                <option key={index} value={filter}>
                                    {filter}
                                </option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <div>
                        Selected Filters:
                        {selectedFilters.map((filter, index) => (
                            <div
                                key={index}
                                className='flex items-center space-x-2'
                            >
                                <span>{filter}</span>
                                <button
                                    onClick={() => handleFilterDelete(filter)}
                                    className='bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600'
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                    <br />
                    <h3 className='text-emerald-600	'> Review Image</h3>
                    <span className='text-emerald-500	'>
                        This is for collection card image and review image in
                        PDP, please upload image 600 x 800
                    </span>
                    <input type='file' onChange={handleReviewImageUpload} />
                    <br />
                    <label>
                        <br />

                        <h3 className='text-emerald-600	'> Review Image URL</h3>
                        <span className='text-emerald-500	'>
                            No need to edit this, for display info only
                        </span>
                        <input
                            type='text'
                            readOnly
                            value={review_image_ref}
                            onChange={handleReviewImageUpload}
                            placeholder='Review Image URL'
                            className='block w-full p-2 border border-gray-300 rounded-md'
                        />
                    </label>
                </section>
                <br />
                <button
                    type='submit'
                    className='w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600'
                >
                    Create Product
                </button>
            </form>
        </div>
    );
};

export default CreateProductPage;
