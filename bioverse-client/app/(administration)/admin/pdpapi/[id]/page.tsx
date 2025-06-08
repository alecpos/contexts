'use client';

import React, { useState, useEffect } from 'react';
import {
    fetchProduct,
    updateProduct,
} from '../../../../utils/actions/pdp-api/pdp-api';
import { useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';
import Link from 'next/link';

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
    // hero_review?: string;
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
    price?: number;
    description_short?: string;
    instructions?: string;
    scientific_research?: string;
    citations?: string[];
    // hero_review?: string;
    faq_questions?: { question: string; answer: string }[];
    safety_information?: string[];
    description_long?: string;
    href?: string;
    rating?: number;
    filter_metadata?: string[];
    safety_info_bold?: string[];
    safety_bullet?: string[];
    safety_info_link?: string[];
    review_image_ref?: string;
}

const ProductDetailsPage = () => {
    const searchParams = useSearchParams();
    const [chips, setChips] = useState('New,BestSeller,GMO Free');
    const [seals, setSeals] = useState('');
    const id = searchParams.get('id') ?? '1';
    const [product, setProduct] = useState<Product | null>(null);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('prescriptions');
    const [type, setType] = useState('consultation');
    const [price, setPrice] = useState(0);
    const [scientificResearchParagraphs, setScientificResearchParagraphs] =
        useState<string[]>([]);
    const [faqQuestions, setFaqQuestions] = useState([
        { question: '', answer: '' },
    ]);
    const [href, setHref] = useState('');
    const [benefitsShort, setBenefitsShort] = useState<string[]>([]);
    const [benefitsLong, setBenefitsLong] = useState({
        benefits: [
            {
                icon: 'placeholder.png',
                header: '',
                description: '',
            },
        ],
    });
    const [discountable, setDiscountable] = useState('');
    const [descriptionShort, setDescriptionShort] = useState('');
    const [instructions, setInstructions] = useState('');
    const [citations, setCitations] = useState(['']);
    // const [heroReview, setHeroReview] = useState("");
    const [safetyInformationParagraphs, setSafetyInformationParagraphs] =
        useState<string[]>([]);
    const [descriptionLong, setDescriptionLong] = useState<string[]>(['']);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [availableFilters, setAvailableFilters] = useState([
        'Energy and Cognitive Function',
        'Autoimmune Support',
        'Heart Health and Blood Pressure',
        'NAD Support',
        'GSH Support',
        // 'Erectile dysfunction',
        'Health Monitoring',
        // 'Hair loss',
        'Skincare',
        'Health & Longevity',
        'Weight Loss',
    ]);
    const [rating, setRating] = useState('');
    const [safetyInfoBoldText, setSafetyInfoBoldText] = useState('');
    const [safetyBullets, setSafetyBullets] = useState<string[]>([]);
    const [safetyInfoText, setSafetyInfoText] = useState('');
    const [safetyInfoLink, setSafetyInfoLink] = useState('');

    const [imageRef, setImageRef] = useState<string[]>([]);
    const [priceVariantSubscriptionData, setPriceVariantSubscriptionData] =
        useState({});
    const [review_image_ref, setReview_image_ref] = useState<string>('');

    const [isEditable, setIsEditable] = useState(false);
    const [isEditableRating, setIsEditableRating] = useState(false);
    const [isEditableType, setIsEditableType] = useState(false);
    const [isEditableShortDes, setIsEditableShortDes] = useState(false);
    const [isEditableShortBen, setIsEditableShortBen] = useState(false);
    const [isEditableHref, setIsEditableHref] = useState(false);
    const [isEditableDescriptionLong, setIsEditableDescriptionLong] =
        useState(false);
    const [isEditableInstructions, setIsEditableInstructions] = useState(false);
    const [isEditableCitations, setIsEditableCitations] = useState(false);
    // const [isEditableHeroReview, setIsEditableHeroReview] = useState(false);
    const [isEditableSafetyInformation, setIsEditableSafetyInformation] =
        useState(false);
    const [isEditableSafetyInfoBullet, setIsEditableSafetyInfoBullet] =
        useState(false);
    const [isEditableSafetyInfoText, setIsEditableSafetyInfoText] =
        useState(false);
    const [isEditableSafetyInfoLink, setIsEditableSafetyInfoLink] =
        useState(false);
    const [isEditableSafetyInfoBold, setIsEditableSafetyInfoBold] =
        useState(false);
    const [isEditablePrice, setIsEditablePrice] = useState(false);
    const [isEditableFilterMetadata, setIsEditableFilterMetadata] =
        useState(false);
    const [isEditableCategory, setIsEditableCategory] = useState(false);
    const [isEditableBenefitHead, setIsEditableCBenefitHead] = useState(false);
    const [isEditableBenefitBody, setIsEditableCBenefitBody] = useState(false);
    const [isEditableScientific, setIsEditableCScientific] = useState(false);
    const [isEditableFAQuestion, setIsEditableFAQuestion] = useState(false);
    const [isEditableFAQAnswer, setIsEditableFAQAnswer] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const addBenefitShort = () => {
        setBenefitsShort([...benefitsShort, '']);
    };

    const removeBenefitShort = (index: any) => {
        const newBenefits = benefitsShort.filter((_, i) => i !== index);
        setBenefitsShort(newBenefits);
    };

    const addSafetyInformationParagraph = () => {
        setSafetyInformationParagraphs([...safetyInformationParagraphs, '']);
    };

    const removeSafetyInformationParagraph = (index: any) => {
        const newParagraphs = safetyInformationParagraphs.filter(
            (_, i) => i !== index
        );
        setSafetyInformationParagraphs(newParagraphs);
    };

    const handleImageUpload = async (event: any) => {
        const supabase = createSupabaseBrowserClient();

        const file = event.target.files[0];
        if (!file) {
            console.error('No file selected');
            return;
        }
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileExt = file.name.split('.').pop();
        const fileName = `${href}-${uniqueSuffix}.${fileExt}`;
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

    const handleFilterDelete = (filterToRemove: any) => {
        setSelectedFilters(
            selectedFilters.filter((filter) => filter !== filterToRemove)
        );
    };

    const toggleEdit = () => {
        setIsEditable((prevEditable) => !prevEditable);
    };

    const toggleEditRating = () => {
        setIsEditableRating((prevEditable) => !prevEditable);
    };

    const toggleEditType = () => {
        setIsEditableType((prevEditable) => !prevEditable);
    };

    const toggleEditShortDes = () => {
        setIsEditableShortDes((prevEditable) => !prevEditable);
    };

    const toggleEditShortBen = () => {
        setIsEditableShortBen((prevEditable) => !prevEditable);
    };

    const toggleEditHref = () => {
        setIsEditableHref((prevEditable) => !prevEditable);
    };

    const toggleEditDescriptionLong = () => {
        setIsEditableDescriptionLong((prevEditable) => !prevEditable);
    };

    const toggleEditInstructions = () => {
        setIsEditableInstructions((prevEditable) => !prevEditable);
    };

    const toggleEditCitations = () => {
        setIsEditableCitations((prevEditable) => !prevEditable);
    };

    // const toggleEditHeroReview = () => {
    //   setIsEditableHeroReview((prevEditable) => !prevEditable);
    // };

    const toggleEditSafetyInformation = () => {
        setIsEditableSafetyInformation((prevEditable) => !prevEditable);
    };

    const toggleEditSafetyInfoBullet = () => {
        setIsEditableSafetyInfoBullet((prevEditable) => !prevEditable);
    };

    const toggleEditSafetyInfoText = () => {
        setIsEditableSafetyInfoText((prevEditable) => !prevEditable);
    };

    const toggleEditSafetyInfoLink = () => {
        setIsEditableSafetyInfoLink((prevEditable) => !prevEditable);
    };

    const toggleEditSafetyInfoBold = () => {
        setIsEditableSafetyInfoBold((prevEditable) => !prevEditable);
    };

    const toggleEditPrice = () => {
        setIsEditablePrice((prevEditable) => !prevEditable);
    };

    const toggleEditFilterMetadata = () => {
        setIsEditableFilterMetadata((prevEditable) => !prevEditable);
    };

    const toggleEditCategory = () => {
        setIsEditableCategory((prevEditable) => !prevEditable);
    };

    const toggleEditBenefitHead = () => {
        setIsEditableCBenefitHead((prevEditable) => !prevEditable);
    };

    const toggleEditBenefitBody = () => {
        setIsEditableCBenefitBody((prevEditable) => !prevEditable);
    };

    const toggleEditScientific = () => {
        setIsEditableCScientific((prevEditable) => !prevEditable);
    };

    const toggleEditFAQuestion = () => {
        setIsEditableFAQuestion((prevEditable) => !prevEditable);
    };
    const toggleEditFAQAnswer = () => {
        setIsEditableFAQAnswer((prevEditable) => !prevEditable);
    };

    const formattedScientificResearch = scientificResearchParagraphs
        .map(
            (paragraph) =>
                `<bio-paragraph className="body1">${paragraph}</bio-paragraph>`
        )
        .join('\n');

    const addLongParagraph = () => {
        setDescriptionLong([...descriptionLong, '']);
    };

    const removeLongParagraph = (index: any) => {
        const newParagraphs = descriptionLong.filter((_, i) => i !== index);
        setDescriptionLong(newParagraphs);
    };

    const addResearchParagraph = () => {
        setScientificResearchParagraphs([...scientificResearchParagraphs, '']);
    };

    const removeResearchParagraph = (index: any) => {
        const newParagraphs = scientificResearchParagraphs.filter(
            (_, i) => i !== index
        );
        setScientificResearchParagraphs(newParagraphs);
    };

    const parseSafetyInfo = (dataArray: any) => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            console.error(
                'Expected an array for safety info, but received:',
                dataArray
            );
            return { text: '', link: '' };
        }

        const data = dataArray[0];
        if (typeof data !== 'string') {
            console.error(
                'Expected a string for safety info, but received:',
                data
            );
            return { text: '', link: '' };
        }

        const regex = /\[click here]\((.*?)\)/;
        const matches = data.match(regex);

        if (matches && matches[1]) {
            const link = matches[1];
            const text = data.replace(regex, '').trim();
            return { text, link };
        }

        return { text: data, link: '' };
    };

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        fetchProduct(id)
            .then((response) => {
                if (response.data) {
                    setName(response.data.name);
                    setRating(response.data.rating);
                    setDescriptionShort(response.data.description_short);
                    setInstructions(response.data.instructions);
                    setProduct(response.data);
                    setCategory(response.data.category);
                    setType(response.data.type);
                    // setHeroReview(response.data.hero_review);
                    setSafetyInfoBoldText(response.data.safety_info_bold);
                    setPrice(response.data.price);
                    setHref(response.data.href);
                }
                if (Array.isArray(response.data.filter_metadata)) {
                    setSelectedFilters(response.data.filter_metadata);
                }

                if (Array.isArray(response.data.faq_questions)) {
                    setFaqQuestions(response.data.faq_questions);
                }
                if (Array.isArray(response.data.benefits_short)) {
                    setBenefitsShort(response.data.benefits_short);
                }

                if (Array.isArray(response.data.citations)) {
                    setCitations(response.data.citations);
                }

                if (Array.isArray(response.data.safety_information)) {
                    setSafetyInformationParagraphs(
                        response.data.safety_information
                    );
                }

                if (Array.isArray(response.data.safety_bullet)) {
                    setSafetyBullets(response.data.safety_bullet);
                }

                if (typeof response.data.description_long === 'string') {
                    const paragraphs = response.data.description_long
                        .split(/<\/?bio-paragraph>/)
                        .filter((paragraph: any) => paragraph.trim() !== '');
                    setDescriptionLong(paragraphs);
                }

                if (typeof response.data.scientific_research === 'string') {
                    // 使用正则表达式替换所有 <bio-paragraph> 标签
                    const cleanedString =
                        response.data.scientific_research.replace(
                            /<\/?bio-paragraph[^>]*>/g,
                            ''
                        );

                    // 将清理后的字符串分割成段落数组
                    const paragraphs = cleanedString
                        .split('\n')
                        .filter((paragraph: any) => paragraph.trim() !== '');

                    setScientificResearchParagraphs(paragraphs);
                }

                if (Array.isArray(response.data.safety_info_link)) {
                    const { text, link } = parseSafetyInfo(
                        response.data.safety_info_link
                    );
                    setSafetyInfoText(text);
                    setSafetyInfoLink(link);
                }

                if (
                    response.data.benefits_long &&
                    Array.isArray(response.data.benefits_long.benefits)
                ) {
                    setBenefitsLong(response.data.benefits_long);
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

    const removeLastBenefit = () => {
        setBenefitsLong((prevState) => ({
            ...prevState,
            benefits: prevState.benefits.slice(0, -1),
        }));
    };

    const removeLastCitation = () => {
        setCitations((prevCitations) => prevCitations.slice(0, -1));
    };

    const removeLastFaqQuestion = () => {
        setFaqQuestions((prevFaqQuestions) => prevFaqQuestions.slice(0, -1)); // 移除数组中的最后一个元素
    };

    const removeLastSafetyBullet = () => {
        setSafetyBullets((prevSafetyBullets) => prevSafetyBullets.slice(0, -1)); // 移除数组中的最后一个元素
    };

    const handleReviewImageUpload = async (event: any) => {
        const supabase = createSupabaseBrowserClient();

        const file = event.target.files[0];
        if (!file) {
            console.error('No file selected');
            return;
        }
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileExt = file.name.split('.').pop();
        const fileName = `review-${href}-${uniqueSuffix}.${fileExt}`;
        const filePath = `product-images/${href}/${fileName}`;

        try {
            let { error, data } = await supabase.storage
                .from('bioverse-images')
                .upload(filePath, file);

            if (error) {
                throw error;
            }

            if (data?.path) {
                setReview_image_ref(data.path);
                alert('Image uploaded successfully');
            }
        } catch (error) {
            alert('Error uploading image');
            console.log('Error uploading image:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let formattedFaqQuestions = faqQuestions.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
        }));

        let formattedChips = chips
            .split(',')
            .filter((chip) => chip.trim())
            .map((chip) => chip.trim());
        let updatedInfo: UpdatedInfo = {};
        if (review_image_ref.length > 0) {
            updatedInfo['review_image_ref'] = review_image_ref;
        }
        if (name !== '') updatedInfo['name'] = name;
        if (category !== '') updatedInfo['category'] = category;
        if (type !== '') updatedInfo['type'] = type;
        if (price !== 0) updatedInfo['price'] = price;
        if (scientificResearchParagraphs.length > 0) {
            updatedInfo['scientific_research'] = formattedScientificResearch;
        }
        if (formattedFaqQuestions.length > 0)
            updatedInfo['faq_questions'] = formattedFaqQuestions;
        if (formattedChips.length > 0) updatedInfo['chips'] = formattedChips;
        if (seals !== '')
            updatedInfo['seals'] = seals.split(',').map((seal) => seal.trim());
        if (benefitsShort.length > 0)
            updatedInfo['benefits_short'] = benefitsShort.map((bs) =>
                bs.trim()
            );
        if (benefitsLong.benefits.length > 0)
            updatedInfo['benefits_long'] = benefitsLong;
        if (discountable !== '')
            updatedInfo['discountable'] = parseFloat(discountable);
        if (descriptionShort !== '')
            updatedInfo['description_short'] = descriptionShort;
        if (instructions !== '') updatedInfo['instructions'] = instructions;
        if (citations.length > 0) updatedInfo['citations'] = citations;
        if (safetyInformationParagraphs.length > 0) {
            updatedInfo['safety_information'] = safetyInformationParagraphs;
        }

        if (descriptionLong.length > 0) {
            const formattedLongDescription = descriptionLong
                .map(
                    (paragraph) => `<bio-paragraph>${paragraph}</bio-paragraph>`
                )
                .join('\n');

            updatedInfo['description_long'] = formattedLongDescription;
        }
        if (selectedFilters.length > 0)
            updatedInfo['filter_metadata'] = selectedFilters;
        if (rating !== '') updatedInfo['rating'] = parseFloat(rating);
        if (safetyInfoBoldText !== '')
            updatedInfo['safety_info_bold'] = [safetyInfoBoldText];
        if (safetyBullets.length > 0)
            updatedInfo['safety_bullet'] = safetyBullets;
        if (safetyInfoLink !== '')
            updatedInfo['safety_info_link'] = [formattedSafetyInfoLink];
        if (imageRef.length > 0)
            updatedInfo['image_ref'] = imageRef.map((ref) => ref.trim());

        if (href !== '') updatedInfo['href'] = href;

        const response = await updateProduct(id, updatedInfo);
        if (response.error) {
            console.error('Update error:', response.error);
        } else {
            console.log('Update success:', response.data);
            alert('Product updated successfully');
        }
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

    const addFaqQuestion = () => {
        setFaqQuestions([...faqQuestions, { question: '', answer: '' }]);
    };
    const updateChips = (newChips: any) => {
        setChips(newChips);
    };

    const addNewBenefit = () => {
        setBenefitsLong((prevState) => ({
            ...prevState,
            benefits: [
                { icon: 'placeholder.png', header: '', description: '' },
                ...(Array.isArray(prevState.benefits)
                    ? prevState.benefits
                    : []),
            ],
        }));
    };

    const updateBenefit = (index: any, key: any, value: any) => {
        const updatedBenefits = benefitsLong.benefits.map((benefit, i) =>
            i === index ? { ...benefit, [key]: value } : benefit
        );
        setBenefitsLong({ benefits: updatedBenefits });
    };

    const handleCitationChange = (index: any, newValue: any) => {
        const newCitations = [...citations];
        newCitations[index] = newValue;
        setCitations(newCitations);
    };

    const addCitation = () => {
        setCitations([...citations, '']);
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

    const updateSafetyBullet = (index: any, value: any) => {
        const updatedBullets = safetyBullets.map((bullet, i) =>
            i === index ? value : bullet
        );
        setSafetyBullets(updatedBullets);
    };

    const addSafetyBullet = () => {
        setSafetyBullets([...safetyBullets, '']);
    };

    const safetyInfoLinkFormatted = `[click here](${safetyInfoLink})`;
    const formattedSafetyInfoLink = safetyInfoText + safetyInfoLinkFormatted;

    const handleHrefChange = (event: any) => {
        setHref(event.target.value);
    };

    return (
        <div className='p-4 max-w-md mx-auto w-5/6'>
            <Link
                href='/admin/pdpapi'
                className='mb-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
                Return
            </Link>
            <h1>Edit Product</h1>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <section className='mb-10 border-solid border-2 border-indigo-600 p-20 w-full'>
                    <h1>NAME SECTION</h1>
                    <br />
                    <label>
                        <h3 className='text-cyan-700'>
                            Product Name: {product.name}
                        </h3>
                        <div className='relative'>
                            <input
                                type='text'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='Name'
                                readOnly={!isEditable}
                                className='w-full p-2 border border-gray-300 rounded-md pl-10' // Adjust left padding if necessary
                            />
                        </div>
                        <button
                            onClick={toggleEdit}
                            type='button'
                            className='ml-96'
                        >
                            {isEditable ? 'Lock' : 'Edit'}
                        </button>
                    </label>

                    <br />
                    <label>
                        <h3 className='text-cyan-700'>Product Rating</h3>
                        <span className='text-emerald-500	'>
                            Please enter number 1-5 for product rating
                        </span>
                        <div className='relative'>
                            <input
                                type='text'
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                readOnly={!isEditableRating}
                                placeholder='Rating'
                                className='block w-full p-2 border border-gray-300 rounded-md'
                            />
                        </div>
                        <button
                            onClick={toggleEditRating}
                            type='button'
                            className='ml-96'
                        >
                            {isEditableRating ? 'Lock' : 'Edit'}
                        </button>
                    </label>
                    <br />

                    <label>
                        <h3 className='text-cyan-700'>Product Type</h3>
                        <div className='relative'>
                            <select
                                disabled={!isEditableType}
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
                        </div>
                        <button
                            onClick={toggleEditType}
                            type='button'
                            className='ml-96'
                        >
                            {isEditableType ? 'Lock' : 'Edit'}
                        </button>
                    </label>
                    <br />
                    <label>
                        <h3 className='text-cyan-700'>Short Description</h3>
                        <span className='text-emerald-500	'>
                            this goes to collection card and to the top of the
                            PDP page, limited in 125 characters
                        </span>
                        <div className='relative'>
                            <textarea
                                rows={10}
                                readOnly={!isEditableShortDes}
                                value={descriptionShort}
                                onChange={(e) => {
                                    setDescriptionShort(e.target.value);
                                }}
                                placeholder='Short Description, limited in 125 characters'
                                className='block w-full p-2 border border-gray-300 rounded-md'
                            />
                        </div>
                        <button
                            onClick={toggleEditShortDes}
                            type='button'
                            className='ml-96'
                        >
                            {isEditableShortDes ? 'Lock' : 'Edit'}
                        </button>
                    </label>
                    <br />
                    <label>
                        <h3 className='text-cyan-700'> Short Benefits</h3>
                        <span className='text-emerald-500'>
                            limited in 222 characters
                        </span>
                        {benefitsShort.map((benefit, index) => (
                            <div key={index}>
                                <div className='relative'>
                                    <textarea
                                        rows={4}
                                        value={benefit}
                                        readOnly={!isEditableShortBen}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 222) {
                                                const newBenefits = [
                                                    ...benefitsShort,
                                                ];
                                                newBenefits[index] =
                                                    e.target.value;
                                                setBenefitsShort(newBenefits);
                                            }
                                        }}
                                        placeholder='Benefit'
                                        className='w-full p-2 border border-gray-300 rounded-md pl-10' // Adjust left padding if necessary
                                    />
                                </div>
                                <button
                                    onClick={toggleEditShortBen}
                                    type='button'
                                    className='ml-96'
                                >
                                    {isEditableShortBen ? 'Lock' : 'Edit'}
                                </button>
                                <br />
                                <button
                                    disabled={!isEditableShortBen}
                                    onClick={() => removeBenefitShort(index)}
                                    type='button'
                                    className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={addBenefitShort}
                            disabled={!isEditableShortBen}
                            type='button'
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                        >
                            Add Benefit
                        </button>
                    </label>

                    <br />
                    {/* {variantForms} */}

                    <br />
                    <label>
                        <h3 className='text-cyan-700'>Href</h3>
                        <span className='text-emerald-500	'>
                            This means URL for the PDP, we normally put product
                            name as url
                        </span>
                        <div className='relative'>
                            <input
                                type='text'
                                value={href}
                                readOnly={!isEditableHref}
                                onChange={handleHrefChange}
                                placeholder='Enter product href'
                                className='block w-full p-2 border border-gray-300 rounded-md'
                            />
                        </div>
                        <button
                            onClick={toggleEditHref}
                            type='button'
                            className=' ml-96'
                        >
                            {isEditableHref ? 'Lock' : 'Edit'}
                        </button>
                    </label>
                    <br />
                    {imageRef.map((ref, index) => (
                        <img key={index} src={ref} alt='Uploaded' />
                    ))}
                    <input type='file' onChange={handleImageUpload} />
                    <br />
                    <label>
                        <h3 className='text-cyan-700'> Product Image</h3>
                        <span className='text-emerald-500	'>
                            No Need to edit this, for display info only
                        </span>
                        <input
                            type='text'
                            readOnly
                            value={imageRef}
                            onChange={handleImageUpload}
                            placeholder='Image URL'
                            className='block w-full p-2 border border-gray-300 rounded-md'
                        />
                    </label>
                </section>

                <section className='mt-10 border-solid border-2 border-indigo-600 p-20 w-full'>
                    <h1>
                        NO INSURANCE REQUIRED • FREE SHIPPING • DELIVERED TO
                        YOUR DOOR
                    </h1>
                    <br />
                    <label>
                        <h3 className='text-cyan-700'> Long Description</h3>
                        <span className='text-emerald-500	'>
                            Please use Enter for new paragraphs.
                        </span>
                        {descriptionLong.map((paragraph, index) => (
                            <div
                                key={index}
                                className='flex items-center space-x-2 relative'
                            >
                                <textarea
                                    rows={10}
                                    value={paragraph}
                                    readOnly={!isEditableDescriptionLong}
                                    onChange={(e) => {
                                        const newParagraphs = [
                                            ...descriptionLong,
                                        ];
                                        newParagraphs[index] = e.target.value;
                                        setDescriptionLong(newParagraphs);
                                    }}
                                    placeholder='Paragraph'
                                    className='block w-full p-2 border border-gray-300 rounded-md'
                                />
                                <button
                                    onClick={toggleEditDescriptionLong}
                                    type='button'
                                    className=' top-0 right-0 mt-2 mr-2 text-sm text-blue-500 hover:text-blue-700'
                                >
                                    {isEditableDescriptionLong
                                        ? 'Lock'
                                        : 'Edit'}
                                </button>

                                <button
                                    type='button'
                                    disabled={!isEditableDescriptionLong}
                                    onClick={() => removeLongParagraph(index)}
                                    className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type='button'
                            onClick={addLongParagraph}
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                        >
                            Add Paragraph
                        </button>
                    </label>
                    <br />
                    <label>
                        <h3 className='text-cyan-700'>Long Benefits</h3>
                        {Array.isArray(benefitsLong.benefits) &&
                            benefitsLong.benefits.map((benefit, index) => (
                                <div key={index} className='benefit-item'>
                                    <div className='relative'>
                                        <input
                                            type='text'
                                            readOnly={!isEditableBenefitHead}
                                            value={benefit.header}
                                            onChange={(e) =>
                                                updateBenefit(
                                                    index,
                                                    'header',
                                                    e.target.value
                                                )
                                            }
                                            placeholder='Header'
                                            className='block w-full p-2 border border-gray-300 rounded-md mb-2'
                                        />
                                    </div>
                                    <button
                                        onClick={toggleEditBenefitHead}
                                        type='button'
                                        className='ml-96'
                                    >
                                        {isEditableBenefitHead
                                            ? 'Lock'
                                            : 'Edit'}
                                    </button>
                                    <div className='relative'>
                                        <textarea
                                            rows={10}
                                            readOnly={!isEditableBenefitBody}
                                            value={benefit.description}
                                            onChange={(e) =>
                                                updateBenefit(
                                                    index,
                                                    'description',
                                                    e.target.value
                                                )
                                            }
                                            placeholder='Description, limited in 450 characters in total'
                                            className='block w-full p-2 border border-gray-300 rounded-md mb-2'
                                        />
                                    </div>
                                    <button
                                        onClick={toggleEditBenefitBody}
                                        type='button'
                                        className='ml-96'
                                    >
                                        {isEditableBenefitBody
                                            ? 'Lock'
                                            : 'Edit'}
                                    </button>
                                    <button
                                        type='button'
                                        disabled={!isEditableBenefitBody}
                                        onClick={() => removeLastBenefit()}
                                        className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2'
                                    >
                                        Remove Benefit
                                    </button>
                                </div>
                            ))}
                        <button
                            type='button'
                            disabled={!isEditableBenefitBody}
                            onClick={addNewBenefit}
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-2'
                        >
                            Add New Benefit
                        </button>
                    </label>
                    <br />
                    <label>
                        <h3 className='text-cyan-700'>Instructions</h3>
                        <div className='relative'>
                            <textarea
                                rows={10}
                                value={instructions}
                                readOnly={!isEditableInstructions}
                                onChange={(e) =>
                                    setInstructions(e.target.value)
                                }
                                placeholder='Instructions'
                                className='block w-full p-2 border border-gray-300 rounded-md'
                            />
                        </div>
                        <button
                            onClick={toggleEditInstructions}
                            type='button'
                            className='ml-96'
                        >
                            {isEditableInstructions ? 'Lock' : 'Edit'}
                        </button>
                    </label>
                </section>
                <section className='mt-24 border-solid border-2 border-indigo-600 p-20 w-full'>
                    <h1>Mechanism of Action</h1>
                    <br />
                    <label>
                        <h3 className='text-cyan-700'> Scientific Research </h3>
                        <span className='text-emerald-500	'>
                            Please use Enter for new paragraphs.
                        </span>
                        {scientificResearchParagraphs.map(
                            (paragraph, index) => (
                                <div key={index}>
                                    <div className='relative mt-5'>
                                        <textarea
                                            className='block w-full p-2 border border-gray-300 rounded-md'
                                            rows={10}
                                            value={paragraph}
                                            readOnly={!isEditableScientific}
                                            onChange={(e) => {
                                                const newParagraphs = [
                                                    ...scientificResearchParagraphs,
                                                ];
                                                newParagraphs[index] =
                                                    e.target.value;
                                                setScientificResearchParagraphs(
                                                    newParagraphs
                                                );
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={toggleEditScientific}
                                        type='button'
                                        className='ml-96'
                                    >
                                        {isEditableScientific ? 'Lock' : 'Edit'}
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            removeResearchParagraph(index)
                                        }
                                        className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2' // ml-2 为按钮添加一些左边距
                                    >
                                        Remove Paragraph
                                    </button>
                                </div>
                            )
                        )}
                        <button
                            type='button'
                            onClick={addResearchParagraph}
                            className=' mt-5 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                        >
                            Add Paragraph
                        </button>
                    </label>
                    <br />
                    <label>
                        <h3 className='text-cyan-700'> Citations </h3>
                        <span className='text-emerald-500	'>
                            add &quot;by&quot; to gray out name of the authors
                        </span>
                        {citations.map((citation, index) => (
                            <div className='relative' key={index}>
                                <textarea
                                    rows={4}
                                    value={citation}
                                    readOnly={!isEditableCitations}
                                    onChange={(e) =>
                                        handleCitationChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    placeholder='Enter citation'
                                    className='block w-full p-2 border border-gray-300 rounded-md'
                                />
                            </div>
                        ))}
                        <button
                            onClick={toggleEditCitations}
                            type='button'
                            className='ml-96'
                        >
                            {isEditableCitations ? 'Lock' : 'Edit'}
                        </button>
                        <button
                            type='button'
                            disabled={!isEditableCitations}
                            onClick={addCitation}
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                        >
                            Add New Citation
                        </button>
                        <button
                            type='button'
                            onClick={removeLastCitation}
                            disabled={!isEditableCitations}
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
            <h3 className="text-cyan-700"> Hero Review</h3>
            <span className="text-emerald-500	">Please put number 1-5 </span>

            <br />
            <div className="relative">
              <input
                type="text"
                readOnly={!isEditableHeroReview}
                value={heroReview}
                onChange={(e) => setHeroReview(e.target.value)}
                placeholder="Hero Review"
                className="block w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={toggleEditHeroReview}
                type="button"
                className="absolute top-0 right-0 mt-2 mr-2 text-sm text-blue-500 hover:text-blue-700"
              >
                {isEditableHeroReview ? "Lock" : "Edit"}
              </button>
            </div>
          </label>
        </section> */}
                <section className='mt-10 border-solid border-2 border-indigo-600 p-20 w-full'>
                    <h1>Frequently Asked Questions</h1>
                    <br />
                    {Array.isArray(faqQuestions) &&
                        faqQuestions.map((faq, index) => (
                            <div key={index} className='mb-4'>
                                <label>
                                    <h3 className='text-cyan-700'>
                                        {' '}
                                        FAQ Question{' '}
                                    </h3>
                                    <div className='relative'>
                                        <input
                                            type='text'
                                            value={faq.question}
                                            readOnly={!isEditableFAQuestion}
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
                                    </div>
                                    <button
                                        onClick={toggleEditFAQuestion}
                                        type='button'
                                        className='ml-96'
                                    >
                                        {isEditableFAQuestion ? 'Lock' : 'Edit'}
                                    </button>
                                </label>

                                <label>
                                    <h3 className='text-cyan-700'>
                                        {' '}
                                        FAQ Answer
                                    </h3>
                                    <div className='relative'>
                                        <textarea
                                            rows={10}
                                            value={faq.answer}
                                            readOnly={!isEditableFAQAnswer}
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
                                    </div>
                                    <button
                                        onClick={toggleEditFAQAnswer}
                                        type='button'
                                        className='ml-96'
                                    >
                                        {isEditableFAQAnswer ? 'Lock' : 'Edit'}
                                    </button>
                                </label>
                            </div>
                        ))}

                    <button
                        type='button'
                        disabled={!isEditableFAQAnswer}
                        onClick={addFaqQuestion}
                        className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                    >
                        Add FAQ Question
                    </button>
                    <button
                        disabled={!isEditableFAQAnswer}
                        type='button'
                        onClick={removeLastFaqQuestion}
                        className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2' // ml-2 为按钮添加一些左边距
                    >
                        Remove FAQ Question
                    </button>
                </section>
                <section className=' mt-10 border-solid border-2 border-indigo-600 p-20 w-full'>
                    <h1>Important Safety Information & Side Effects</h1>
                    <br />
                    <label>
                        <h3 className='text-cyan-700'>Safety Information</h3>
                        <span className='text-emerald-500	'>
                            General safety information (first paragraphs){' '}
                        </span>
                        {safetyInformationParagraphs?.map(
                            (paragraph, index) => (
                                <div key={index}>
                                    <div className='relative'>
                                        <textarea
                                            rows={10}
                                            value={paragraph}
                                            readOnly={
                                                !isEditableSafetyInformation
                                            }
                                            onChange={(e) => {
                                                const newParagraphs = [
                                                    ...safetyInformationParagraphs,
                                                ];
                                                newParagraphs[index] =
                                                    e.target.value;
                                                setSafetyInformationParagraphs(
                                                    newParagraphs
                                                );
                                            }}
                                            className='w-full'
                                        />
                                    </div>
                                    <button
                                        onClick={toggleEditSafetyInformation}
                                        type='button'
                                        className='ml-96'
                                    >
                                        {isEditableSafetyInformation
                                            ? 'Lock'
                                            : 'Edit'}
                                    </button>
                                    <button
                                        disabled={!isEditableSafetyInformation}
                                        className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2' // ml-2 为按钮添加一些左边距
                                        type='button'
                                        onClick={() =>
                                            removeSafetyInformationParagraph(
                                                index
                                            )
                                        }
                                    >
                                        Remove Paragraph
                                    </button>
                                </div>
                            )
                        )}
                        <button
                            disabled={!isEditableSafetyInformation}
                            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                            type='button'
                            onClick={addSafetyInformationParagraph}
                        >
                            Add Paragraph
                        </button>
                    </label>

                    <div>
                        <h3 className='text-cyan-700'>
                            {' '}
                            Safety Info Bullet points{' '}
                        </h3>

                        {safetyBullets.map((bullet, index) => (
                            <div className='relative' key={index}>
                                <textarea
                                    rows={10}
                                    value={bullet}
                                    readOnly={!isEditableSafetyInfoBullet}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 222) {
                                            updateSafetyBullet(
                                                index,
                                                e.target.value
                                            );
                                        }
                                    }}
                                    placeholder={`Bullet Point ${
                                        index + 1
                                    },limited in 222 characters`}
                                    className='block w-full p-2 border border-gray-300 rounded-md mb-2'
                                />
                            </div>
                        ))}
                        <button
                            onClick={toggleEditSafetyInfoBullet}
                            type='button'
                            className='ml-96'
                        >
                            {isEditableSafetyInfoBullet ? 'Lock' : 'Edit'}
                        </button>
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
                        <h3 className='text-cyan-700'> Safety Info text </h3>
                        <span className='text-emerald-500	'>
                            Paragraphs with links
                        </span>
                        <div className='relative'>
                            <textarea
                                rows={10}
                                value={safetyInfoText}
                                readOnly={!isEditableSafetyInfoText}
                                onChange={(e) =>
                                    setSafetyInfoText(e.target.value)
                                }
                                placeholder='Safety Information Text'
                                className='block w-full p-2 border border-gray-300 rounded-md mb-2'
                            />
                        </div>
                        <button
                            onClick={toggleEditSafetyInfoText}
                            type='button'
                            className='ml-96'
                        >
                            {isEditableSafetyInfoText ? 'Lock' : 'Edit'}
                        </button>
                        <h3 className='text-cyan-700'> Safety Info Link </h3>
                        <span className='text-emerald-500	'>Link</span>
                        <div className='relative'>
                            <input
                                type='text'
                                value={safetyInfoLink}
                                readOnly={!isEditableSafetyInfoLink}
                                onChange={(e) =>
                                    setSafetyInfoLink(e.target.value)
                                }
                                placeholder='Safety Information Link'
                                className='block w-full p-2 border border-gray-300 rounded-md mb-2'
                            />
                        </div>
                        <button
                            onClick={toggleEditSafetyInfoLink}
                            type='button'
                            className='ml-96'
                        >
                            {isEditableSafetyInfoLink ? 'Lock' : 'Edit'}
                        </button>
                    </div>
                    <label>
                        <h3 className='text-cyan-700'> Safety Info Bold </h3>
                        <span className='text-emerald-500	'>
                            Last bolded paragraph
                        </span>
                        <div className='relative'>
                            <textarea
                                rows={10}
                                readOnly={!isEditableSafetyInfoBold}
                                value={safetyInfoBoldText}
                                onChange={(e) =>
                                    setSafetyInfoBoldText(e.target.value)
                                }
                                placeholder='Enter safety information here.'
                                className='block w-full p-2 border border-gray-300 rounded-md'
                            />
                        </div>
                        <button
                            onClick={toggleEditSafetyInfoBold}
                            type='button'
                            className='ml-96'
                        >
                            {isEditableSafetyInfoBold ? 'Lock' : 'Edit'}
                        </button>
                    </label>
                </section>
                <section className='mt-10 border-solid border-2 border-indigo-600 p-20 w-full'>
                    <h1>Colletion page</h1>
                    <br />
                    <label>
                        <h3 className='text-cyan-700'> Category </h3>
                        <div className='relative'>
                            <select
                                value={category}
                                disabled={!isEditableCategory}
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
                        </div>
                        <button
                            onClick={toggleEditCategory}
                            type='button'
                            className='ml-96'
                        >
                            {isEditableCategory ? 'Lock' : 'Edit'}
                        </button>
                    </label>
                    <br />
                    <label>
                        <h3 className='text-cyan-700'> Price </h3>
                        <span className='text-emerald-500	'>
                            This is the price for collection card, which is
                            &ldquo;starting at $xx&rdquo;
                        </span>
                        <div className='relative'>
                            <input
                                type='text'
                                value={price}
                                readOnly={!isEditablePrice}
                                onChange={(e) =>
                                    setPrice(
                                        e.target.value
                                            ? parseFloat(e.target.value)
                                            : 0
                                    )
                                }
                                placeholder='Price (comma-separated for multiple values)'
                                className='block w-full p-2 border border-gray-300 rounded-md'
                            />
                        </div>
                        <button
                            onClick={toggleEditPrice}
                            type='button'
                            className='ml-96'
                        >
                            {isEditablePrice ? 'Lock' : 'Edit'}
                        </button>
                    </label>
                    <br />
                    <label>
                        <h3 className='text-cyan-700'>Filter Metadata </h3>
                        <div className='relative'>
                            <select
                                disabled={!isEditableFilterMetadata}
                                onChange={handleFilterSelect}
                                className='block w-full p-2 border border-gray-300 rounded-md'
                            >
                                {availableFilters.map((filter, index) => (
                                    <option key={index} value={filter}>
                                        {filter}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={toggleEditFilterMetadata}
                            type='button'
                            className='ml-96'
                        >
                            {isEditableFilterMetadata ? 'Lock' : 'Edit'}
                        </button>
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
                                    disabled={!isEditableFilterMetadata}
                                    onClick={() => handleFilterDelete(filter)}
                                    className='bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600'
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                    <br />
                    <h3 className='text-cyan-700	'> Review Image</h3>

                    <span className='text-emerald-500	'>
                        This is for collection card image and review image in
                        PDP, please upload image 600 x 800
                    </span>
                    <input type='file' onChange={handleReviewImageUpload} />
                    <br />
                    <label>
                        <h3 className='text-cyan-700'>
                            {' '}
                            collections page card image
                        </h3>
                        <span className='text-emerald-500	'>
                            No need to edit this, for display info only
                        </span>
                        <input
                            readOnly
                            type='text'
                            value={review_image_ref}
                            onChange={handleReviewImageUpload}
                            placeholder='collections page card image              '
                            className='block w-full p-2 border border-gray-300 rounded-md'
                        />
                    </label>
                </section>
                <button
                    type='submit'
                    className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                >
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default ProductDetailsPage;
