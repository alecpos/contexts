'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
    updateFocusFilter: (filter: string, add: boolean) => void;
    updateTypeFilter: (filter: string, add: boolean) => void;
    preFilledFocusFilters: string[];
    preFilledTypeFilters: string[];
    closeDrawer: () => void;
}

const processTypeFilter = (filterValue: string) => {
    return filterValue.toLowerCase();
};

export default function MobileFilterDrawer({
    closeDrawer,
    setMenuOpen,
    updateFocusFilter,
    updateTypeFilter,
    preFilledFocusFilters,
    preFilledTypeFilters,
}: Props) {
    const initialState: mobileFilterStates = {
        focusAreas: new Set(preFilledFocusFilters || []),
        types: new Set(
            preFilledTypeFilters
                ? preFilledTypeFilters.map(processTypeFilter)
                : []
        ),
    };

    const [checkedFilters, setCheckedFilters] =
        useState<mobileFilterStates>(initialState);

    useEffect(() => {
        const mobilePreFilters: mobileFilterStates = {
            focusAreas: new Set(preFilledFocusFilters),
            types: new Set(preFilledTypeFilters.map(processTypeFilter)),
        };

        setCheckedFilters(mobilePreFilters);
    }, [preFilledFocusFilters, preFilledTypeFilters]);

    const handleClose = () => {
        closeDrawer();
    };

    const handleFocusAreaChange = (
        filterValue: FocusFilter,
        checked: boolean
    ) => {
        const processedFilterValue = filterValue.filterText;
        setCheckedFilters((prevState) => {
            const updatedFocusAreas = new Set(prevState.focusAreas);
            if (checked) {
                updatedFocusAreas.add(processedFilterValue);
            } else {
                updatedFocusAreas.delete(processedFilterValue);
            }
            return { ...prevState, focusAreas: updatedFocusAreas };
        });
    };

    const handleTypeChange = (filterValue: string, checked: boolean) => {
        const processedFilterValue = processTypeFilter(filterValue);
        setCheckedFilters((prevState) => {
            const updatedTypes = new Set(prevState.types);
            if (checked) {
                updatedTypes.add(processedFilterValue);
            } else {
                updatedTypes.delete(processedFilterValue);
            }
            return { ...prevState, types: updatedTypes };
        });
    };

    const handleApplyFilters = () => {
        // For focus filters
        focusFilters.forEach((filter) => {
            const isFilterChecked = checkedFilters.focusAreas.has(
                filter.filterText
            );
            updateFocusFilter(filter.filterText, isFilterChecked);
        });

        // For type filters
        filterElements.forEach((element) => {
            const processedFilterValue = processTypeFilter(element.filterValue);
            const isFilterChecked =
                checkedFilters.types.has(processedFilterValue);
            updateTypeFilter(processedFilterValue, isFilterChecked);
        });

        handleClose();
    };

    const handleResetFilters = () => {
        // Clear all filters
        setCheckedFilters({ focusAreas: new Set(), types: new Set() });

        // Update parent component's state to reflect no filters are selected
        focusFilters.forEach((filter) =>
            updateFocusFilter(filter.filterText, false)
        );
        filterElements.forEach((element) =>
            updateTypeFilter(processTypeFilter(element.filterValue), false)
        );
        handleClose();
    };

    return (
        <>
            <div className={`flex flex-col w-[100vw]`}>
                <div
                    onClick={handleClose}
                    className='h-[50px] h7 flex flex-row justify-end items-center'
                >
                    <BioType className='rubik-large flex flex-row'>
                        CLOSE
                        <CloseIcon className='flex' />
                    </BioType>
                </div>

                <div className='h-[1px]'>
                    <HorizontalDivider backgroundColor={''} height={1} />
                </div>

                <div className='flex flex-col gap-3 m-5'>
                    <Button
                        variant='contained'
                        onClick={handleApplyFilters}
                        className='h-12'
                    >
                        APPLY FILTERS
                    </Button>

                    <Button
                        variant='outlined'
                        onClick={handleResetFilters}
                        className='h-12'
                    >
                        RESET FILTERS
                    </Button>
                </div>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1a-content'
                        id='panel1a-header'
                    >
                        <BioType className='rubik-large text-text'>
                            BY FOCUS AREAS
                        </BioType>
                    </AccordionSummary>
                    <AccordionDetails
                        className='pl-[56px] gap-4 flex-col flex'
                        style={{ marginTop: '-16px' }}
                    >
                        <FormControl>
                            {focusFilters.map((item, index) => (
                                <div key={index}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={checkedFilters.focusAreas.has(
                                                    item.filterText
                                                )}
                                                onChange={(e) =>
                                                    handleFocusAreaChange(
                                                        item,
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        }
                                        label={
                                            <BioType className='body1'>
                                                {item.displayText}
                                            </BioType>
                                        }
                                    />
                                </div>
                            ))}
                        </FormControl>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls='panel1a-content'
                        id='panel1a-header'
                    >
                        <BioType className=' rubik-large text-text'>
                            BY TREATMENT TYPE
                        </BioType>
                    </AccordionSummary>
                    <AccordionDetails
                        className='pl-[56px] gap-4 flex-col flex'
                        style={{ marginTop: '-16px' }}
                    >
                        <FormControl>
                            {filterElements.map((item, index) => (
                                <div className='flex flex-row' key={index}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={checkedFilters.types.has(
                                                    processTypeFilter(
                                                        item.filterValue
                                                    )
                                                )}
                                                onChange={(e) =>
                                                    handleTypeChange(
                                                        item.filterValue,
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        }
                                        label={
                                            <div className='flex flex-row gap-1 align-middle'>
                                                <BioType className='body1'>
                                                    {item.filterValue}
                                                </BioType>
                                                <img
                                                    className='h-6 w-6'
                                                    alt={item.filterValue}
                                                    src={item.iconRef}
                                                />
                                            </div>
                                        }
                                    />
                                </div>
                            ))}
                        </FormControl>
                    </AccordionDetails>
                </Accordion>
            </div>
        </>
    );
}

const focusFilters: FocusFilter[] = [
    {
        displayText: 'Health & Longevity',
        filterText: 'health-and-longevity',
    },
    {
        displayText: 'Weight Loss',
        filterText: 'weight-loss',
    },
    {
        displayText: 'Energy & Cognitive Function',
        filterText: 'energy-and-cognitive-function',
    },
    {
        displayText: 'Autoimmune Support',
        filterText: 'autoimmune-support',
    },
    {
        displayText: 'Heart Health & Blood Pressure',
        filterText: 'heart-health-and-blood-pressure',
    },
    {
        displayText: 'NAD Support',
        filterText: '   ',
    },
    {
        displayText: 'Hair Loss',
        filterText: 'hair-loss',
    },
    {
        displayText: 'GSH Support',
        filterText: 'gsh-support',
    },
    // {
    //     displayText: 'Erectile Dysfunction',
    //     filterText: 'erectile-dysfunction',
    // },
    {
        displayText: 'Health Monitoring',
        filterText: 'health-monitoring',
    },
    {
        displayText: 'Skincare',
        filterText: 'skincare',
    },
];

const filterElements: IconFilter[] = [
    //   {
    //     filterValue: "Consultation",
    //     iconRef: "/img/type-icons/consultation.svg",
    //   },
    {
        filterValue: 'Cream',
        iconRef: '/img/type-icons/cream.svg',
    },
    {
        filterValue: 'Injection',
        iconRef: '/img/type-icons/injection.svg',
    },
    {
        filterValue: 'Patch',
        iconRef: '/img/type-icons/patch.svg',
    },
    {
        filterValue: 'Pill',
        iconRef: '/img/type-icons/pill.svg',
    },
    // {
    //   filterValue: "Powder",
    //   iconRef: "/img/type-icons/powder.svg",
    // },
    {
        filterValue: 'Spray',
        iconRef: '/img/type-icons/spray.svg',
    },
    // {
    //     filterValue: 'Test Kit',
    //     iconRef: '/img/type-icons/test-kit.svg',
    // },
];
