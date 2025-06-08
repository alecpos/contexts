import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { useEffect, useState } from 'react';

interface CollectionFilterProps {
    updateFocusFilter: (filter: string, add: boolean) => void;
    updateTypeFilter: (filter: string, add: boolean) => void;
    focusFiltersFromParent: string[];
    typeFiltersFromParent: string[];
}

const processTypeFilter = (filterValue: string) => {
    return filterValue.toLowerCase();
};

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
        displayText: 'NAD+ Support',
        filterText: 'nad-support',
    },
    {
        displayText: 'Hair Loss',
        filterText: 'hair-loss',
    },
    {
        displayText: 'Glutathione (GSH) Support',
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

export default function CollectionFilter({
    focusFiltersFromParent,
    typeFiltersFromParent,
    updateFocusFilter,
    updateTypeFilter,
}: CollectionFilterProps) {
    const [checkedFocusAreas, setCheckedFocusAreas] = useState(
        new Set<string>()
    );
    const [checkedTypes, setCheckedTypes] = useState(new Set<string>());

    useEffect(() => {
        // Convert the array to a Set before setting the state
        const focusAreasSet = new Set<string>(focusFiltersFromParent);
        const typesSet = new Set<string>(typeFiltersFromParent);

        setCheckedFocusAreas(focusAreasSet);
        setCheckedTypes(typesSet);
    }, [focusFiltersFromParent, typeFiltersFromParent]);

    const handleFocusAreaChange = (
        filterValue: FocusFilter,
        checked: boolean
    ) => {
        const processedFilterValue = filterValue.filterText;
        const updatedCheckedFocusAreas = new Set(checkedFocusAreas);

        if (checked) {
            updatedCheckedFocusAreas.add(processedFilterValue);
        } else {
            updatedCheckedFocusAreas.delete(processedFilterValue);
        }

        console.log(
            'Updating focus areas: ',
            Array.from(updatedCheckedFocusAreas)
        );
        setCheckedFocusAreas(updatedCheckedFocusAreas);
        updateFocusFilter(processedFilterValue, checked);
    };

    const handleTypeChange = (filterValue: string, checked: boolean) => {
        const processedFilterValue = processTypeFilter(filterValue); // Lowercase version
        const updatedCheckedTypes = new Set(checkedTypes);

        if (checked) {
            updatedCheckedTypes.add(processedFilterValue); // Add lowercase version
        } else {
            updatedCheckedTypes.delete(processedFilterValue); // Delete lowercase version
        }

        console.log('Updating types: ', Array.from(updatedCheckedTypes));
        setCheckedTypes(updatedCheckedTypes);
        updateTypeFilter(processedFilterValue, checked);
    };

    const handleClearFilters = () => {
        // Set states to empty sets to uncheck all checkboxes
        setCheckedFocusAreas(new Set());
        setCheckedTypes(new Set());

        // Update the filters in the parent component to indicate no filters are selected
        focusFilters.forEach((filter) => {
            updateFocusFilter(filter.filterText, false);
        });

        filterElements.forEach((element) => {
            updateTypeFilter(processTypeFilter(element.filterValue), false);
        });
    };

    return (
        <div className='w-[full] flex flex-col gap-[.83vw]'>
            <div className=''>
                <div className='flex justify-between'>
                    <BioType className='subtitle2'>Filters</BioType>
                    <BioType
                        className='body1 cursor-pointer hover:underline text-[#286BA2]'
                        onClick={handleClearFilters}
                    >
                        Clear
                    </BioType>
                </div>
                <HorizontalDivider backgroundColor={'gray'} height={1} />
            </div>
            <div className='flex self-start'>
                <BioType className='body1bold'>BY FOCUS AREA</BioType>
            </div>
            <div id='focus-area-filters' className='flex flex-row'>
                <FormControl>
                    {focusFilters.map((item, index) => (
                        <div key={index}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkedFocusAreas.has(
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
            </div>
            <div>
                <HorizontalDivider backgroundColor={'gray'} height={1} />
            </div>
            <div className='flex self-start'>
                <BioType className='body1bold'>BY TREATMENT TYPE</BioType>
            </div>
            <div id='treatment-filters' className='flex flex-row'>
                <FormControl>
                    {filterElements.map((item, index) => (
                        <div className='flex flex-row' key={index}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkedTypes.has(
                                            processTypeFilter(item.filterValue)
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
            </div>
        </div>
    );
}
