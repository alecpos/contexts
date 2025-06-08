'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
    setSorting: (criteria: string) => void;
    currentSorting: string;
    closeDrawer: () => void;
}

export default function MobileSortDrawer({
    setSorting,
    currentSorting,
    closeDrawer,
}: Props) {
    const [selectedSort, setSelectedSort] = useState(currentSorting);

    const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedSort(event.target.value);
    };

    const applySortAndClose = () => {
        setSorting(selectedSort);
        closeDrawer();
    };

    return (
        <>
            <div className={`flex flex-col w-[100vw]`}>
                <div
                    onClick={closeDrawer}
                    className='h-[50px] h7 flex flex-row justify-end items-center'
                >
                    <BioType className='rubik-large flex flex-row'>
                        CLOSE
                        <CloseIcon className='flex' />
                    </BioType>
                </div>
                <div className='h-[2px]'>
                    <HorizontalDivider backgroundColor={'#e3e3e3'} height={1} />
                </div>
                <div className='flex flex-col gap-3 m-5'>
                    <Button
                        variant='contained'
                        onClick={applySortAndClose}
                        className='h-12'
                    >
                        APPLY SORT
                    </Button>
                </div>
                <AccordionSummary
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                >
                    <BioType className='rubik-large text-text'>SORT BY</BioType>
                </AccordionSummary>

                <div className='h-[2px]'>
                    <HorizontalDivider backgroundColor={'#e3e3e3'} height={1} />
                </div>

                <FormControl component='fieldset' className='ml-5 mr-5 mb-5'>
                    <RadioGroup
                        aria-label='sorting-options'
                        name='sorting-options'
                        value={selectedSort}
                        onChange={handleSortChange}
                    >
                        <FormControlLabel
                            value='best-selling'
                            control={<Radio />}
                            label='Best Selling'
                        />
                        <FormControlLabel
                            value='alphabetical'
                            control={<Radio />}
                            label='Alphabetical: A-Z'
                        />
                        <FormControlLabel
                            value='alphabetical-reverse'
                            control={<Radio />}
                            label='Alphabetical: Z-A'
                        />
                        <FormControlLabel
                            value='price'
                            control={<Radio />}
                            label='Price: Low - High'
                        />
                        <FormControlLabel
                            value='price-reverse'
                            control={<Radio />}
                            label='Price: High - Low'
                        />
                    </RadioGroup>
                </FormControl>
            </div>
        </>
    );
}
