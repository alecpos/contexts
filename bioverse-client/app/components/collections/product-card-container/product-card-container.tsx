'use client';

import LoadingScreen from '../../global-components/loading-screen/loading-screen';
import ProductCard from './productCard/product-card';
import { useCallback, useEffect, useState } from 'react';

interface Props {
    data: any[] | undefined | null;
    focusFilters: string[];
    typeFilters: string[];
    sortingCriteria: string;
    setFilteredProductCount: (count: number) => void;
}

export default function ProductCardContainer({
    data,
    focusFilters,
    typeFilters,
    setFilteredProductCount,
    sortingCriteria,
}: Props) {
    // console.log('Data:', data); // Log initial data
    // console.log("Focus Filters:", focusFilters); // Log focus filters
    // console.log("Type Filters:", typeFilters); // Log type filters

    const [filteredItems, setFilteredItems] = useState<any[]>([]);

    const itemMatchesFilter = useCallback(
        (item: any) => {
            // Check if item.filter_metadata is not null and is an array
            // If focusFilters is empty, consider matchesFocusFilter as true

            const matchesFocusFilter =
                focusFilters.length === 0 ||
                (item.filter_metadata && Array.isArray(item.filter_metadata)
                    ? item.filter_metadata.some((filter: string) =>
                          focusFilters.includes(filter)
                      )
                    : false);

            // Check if the item's type matches any filter in typeFilters
            // If typeFilters is empty, consider matchesTypeFilter as true
            const matchesTypeFilter =
                typeFilters.length === 0 || typeFilters.includes(item.type);

            // Return true only if the item matches both focus and type filters
            return matchesFocusFilter && matchesTypeFilter;
        },
        [focusFilters, typeFilters]
    ); // Add dependency array here

    useEffect(() => {
        if (data) {
            let items = data.filter(itemMatchesFilter);

            if (sortingCriteria === 'best-selling') {
                items.sort((a, b) => b.sales - a.sales);
            } else if (sortingCriteria === 'price') {
                items.sort((a, b) => a.price[0] - b.price[0]);
            } else if (sortingCriteria === 'price-reverse') {
                items.sort((a, b) => b.price[0] - a.price[0]);
            } else if (sortingCriteria === 'alphabetical') {
                items.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortingCriteria === 'alphabetical-reverse') {
                items.sort((a, b) => b.name.localeCompare(a.name));
            }

            setFilteredProductCount(items.length);
            setFilteredItems(items); // Update state with filtered and sorted items
        }
    }, [
        data,
        focusFilters,
        typeFilters,
        sortingCriteria,
        setFilteredProductCount,
        itemMatchesFilter,
    ]);

    if (!data) {
        return <LoadingScreen />;
    }

    return (
        <>
            <div
                id='product-card-container-topdiv'
                className='flex p-0 flex-col md:flex-row gap-6 md:gap-[3.3%] flex-wrap items-stretch justify-start mx-auto max-w-7xl '
            >
                {filteredItems &&
                    filteredItems.map(
                        (item, index) =>
                            itemMatchesFilter(item) && (
                                <ProductCard
                                    key={index}
                                    name={item.name}
                                    type={item.category}
                                    price={item.price[0]}
                                    description={item.description_short}
                                    imageUrl={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${item.review_image_ref}`}
                                    href={item.href}
                                />
                            )
                    )}
            </div>
        </>
    );
}
