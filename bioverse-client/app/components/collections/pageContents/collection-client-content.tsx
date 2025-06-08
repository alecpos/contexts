'use client';

import { useState, useEffect } from 'react';
import CollectionSort from '../sorting/collection-sort';
import CollectionFilter from '../filter/collection-filter';
import ProductCardContainer from '../product-card-container/product-card-container';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { Button, Drawer, useMediaQuery } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import MobileFilterDrawer from '../filter/mobile-filter/mobile-filter-drawer';
import MobileSortDrawer from '../sorting/mobile/mobile-sort-drawer';
import './styles.css';
import useSWR from 'swr';
import { getActiveCollectionsData } from '@/app/utils/database/controller/products/products';
import LoadingScreen from '../../global-components/loading-screen/loading-screen';

interface Props {
    prefilter: CollectionsFilterSearchParams;
}

export default function CollectionClientContent({ prefilter }: Props) {
    const {
        data: swr_collections_data,
        isLoading,
        error,
    } = useSWR(`collections`, () => getActiveCollectionsData());

    const [isMounted, setIsMounted] = useState(false);
    const [focusFilters, setFocusFilters] = useState<string[]>([]);
    const [typeFilters, setTypeFilters] = useState<string[]>([]);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [filteredProductCount, setFilteredProductCount] = useState(0);
    const [sortingCriteria, setSortingCriteria] = useState('');
    const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
    const [sortDrawerOpen, setSortDrawerOpen] = useState<boolean>(false);

    const isNotMobile = useMediaQuery('(min-width:640px)');

    useEffect(() => {
        // Clear existing filters
        setFocusFilters([]);
        setTypeFilters([]);
        //load pre-existing filter values
        if (prefilter) {
            //Check pre-existing focus filters:
            if (prefilter.focusPrefilter !== undefined) {
                updateFocusFilter(prefilter.focusPrefilter, true);
            }

            //Check pre-existing type filters:
            if (prefilter.typePrefilter !== undefined) {
                updateFocusFilter(prefilter.typePrefilter, true);
            }
        }

        setIsMounted(true);
    }, [prefilter]);

    const updateFocusFilter = (filterValue: string, add: boolean) => {
        setFocusFilters((prevFilters) => {
            const updatedFilters = new Set(prevFilters);
            if (add) {
                updatedFilters.add(filterValue);
            } else {
                updatedFilters.delete(filterValue);
            }
            return Array.from(updatedFilters);
        });
    };

    const updateTypeFilter = (filterValue: string, add: boolean) => {
        setTypeFilters((prevFilters) => {
            const updatedFilters = new Set(prevFilters);
            if (add) {
                updatedFilters.add(filterValue);
            } else {
                updatedFilters.delete(filterValue);
            }
            return Array.from(updatedFilters);
        });
    };

    const toggleFilterDrawer = () => {
        setFilterDrawerOpen((prev) => !prev);
    };

    const toggleSortDrawer = () => {
        setSortDrawerOpen((prev) => !prev);
    };

    const closeFilterDrawer = () => {
        setFilterDrawerOpen(false);
    };

    const closeSortDrawer = () => {
        setSortDrawerOpen(false);
    };

    if (isLoading || !swr_collections_data) {
        return <LoadingScreen />;
    }

    return (
        <div
            id='collections-container'
            className='w-full items-center inline-flex flex-col self-center fadeIn' // Added fadeIn class here for the entire container
        >
            <div
                id='header-BioType'
                className='flex flex-col self-stretch items-start h-24 md:h-48 md:bg-gradient-to-r md:from-[#F5F8FA] md:to-[#FFFFFF]'
            >
                <div className='max-w-7xl w-full mx-auto md:mt-8 sm:px-8'>
                    <BioType className='h4 text-center md:text-left'>
                        TREATMENTS BACKED BY SCIENCE
                    </BioType>
                    <BioType
                        className={`h4 text-[18px] hidden md:inline leading-none`}
                    >
                        <p>{filteredProductCount} treatments</p>
                    </BioType>
                    <BioType className='body1 text-center md:text-left mt-4 md:mt-5'>
                        Longevity prescriptions delivered right to your
                        doorstep.
                    </BioType>
                </div>
            </div>
            <div className='max-w-7xl mt-10 md:mt-12 px-8'>
                {isMounted && (
                    <>
                        {!isNotMobile && (
                            <div className='flex flex-row gap-3 '>
                                <Button
                                    variant='outlined'
                                    className='flex flex-grow'
                                    onClick={toggleFilterDrawer}
                                >
                                    <FilterAltIcon /> FILTER
                                </Button>

                                <Button
                                    variant='outlined'
                                    className='flex flex-grow'
                                    onClick={toggleSortDrawer}
                                >
                                    <FilterListIcon /> SORT
                                </Button>

                                <Drawer
                                    anchor='right'
                                    open={filterDrawerOpen}
                                    onClose={closeFilterDrawer}
                                >
                                    <MobileFilterDrawer
                                        setMenuOpen={setMenuOpen}
                                        updateFocusFilter={updateFocusFilter}
                                        updateTypeFilter={updateTypeFilter}
                                        preFilledFocusFilters={focusFilters}
                                        preFilledTypeFilters={typeFilters}
                                        closeDrawer={closeFilterDrawer}
                                    />
                                </Drawer>

                                <Drawer
                                    anchor='right'
                                    open={sortDrawerOpen}
                                    onClose={closeSortDrawer}
                                >
                                    <MobileSortDrawer
                                        setSorting={setSortingCriteria}
                                        currentSorting={sortingCriteria}
                                        closeDrawer={closeSortDrawer}
                                    />
                                </Drawer>
                            </div>
                        )}

                        <div
                            id='collections-body'
                            className='w-full flex-col gap-[2.12vw] '
                        >
                            <div
                                id='sortMenu'
                                className='flex w-full mb-4 mr-[0.3%]'
                            >
                                <div className='flex justify-end w-full '>
                                    {isNotMobile && (
                                        <CollectionSort
                                            setSorting={setSortingCriteria}
                                        />
                                    )}
                                </div>
                            </div>

                            <div
                                id='collections-filter-and-cards'
                                className='flex flex-col md:flex-row gap-[20px] w-full mt-2'
                            >
                                <div className='md:w-[25%] md:max-w-[20vw]'>
                                    {isNotMobile && (
                                        <CollectionFilter
                                            focusFiltersFromParent={
                                                focusFilters
                                            }
                                            typeFiltersFromParent={typeFilters}
                                            updateFocusFilter={
                                                updateFocusFilter
                                            }
                                            updateTypeFilter={updateTypeFilter}
                                        />
                                    )}
                                </div>
                                <div className='md:w-[75%]'>
                                    {/* Pass data to ProductCardContainer */}
                                    <div className='fadeIn'>
                                        {' '}
                                        {/* Apply fadeIn class to the product container */}
                                        <ProductCardContainer
                                            data={swr_collections_data.data}
                                            focusFilters={focusFilters}
                                            typeFilters={typeFilters}
                                            setFilteredProductCount={
                                                setFilteredProductCount
                                            }
                                            sortingCriteria={sortingCriteria}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
