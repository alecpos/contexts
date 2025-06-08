import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import MacroView from './macro-view';
import useSWR from 'swr';
import { getAllMacrosByResponder } from '@/app/utils/database/controller/macros/macros-api';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

interface MacrosDisplayProps {
    setTabSelected: React.Dispatch<React.SetStateAction<string>>;
    setMessageContent: Dispatch<SetStateAction<string>>;
    macroDestination: string;
}
const MacrosDisplay = ({
    setMessageContent,
    macroDestination,
    setTabSelected,
}: MacrosDisplayProps) => {
    const [macroCategorySelected, setMacroCategorySelected] = useState('All');
    const [macroSelected, setMacroSelected] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [shouldUseFilter, setShouldUseFilter] = useState<boolean>(false);
    const [filteredMacrosList, setFilteredMacrosList] = useState<MacrosSBR[]>(
        []
    );
    const { data, error, isLoading } = useSWR(`provider-macros`, () =>
        getAllMacrosByResponder('Coordinator')
    );

    useEffect(() => {
        if (searchTerm.length < 3) {
            setShouldUseFilter(false);
        }
        if (searchTerm.length > 3) {
            filterBySearchTerm();
            setShouldUseFilter(true);
        }
    }, [data, searchTerm]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    const filterBySearchTerm = () => {
        if (!searchTerm || searchTerm.trim() === '') {
            setFilteredMacrosList([]);
            return;
        }

        // Create a regex pattern from searchTerm for partial matching without considering case
        const regexPattern = new RegExp(searchTerm, 'i');

        // Filter all macros where either name or macroText matches the searchTerm
        const filtered = data!.macros.filter(
            (macro) =>
                regexPattern.test(macro.name!) ||
                regexPattern.test(macro.macroText!)
        );

        setFilteredMacrosList(filtered);
    };

    const handleMacroSelect = (macro: MacrosSBR) => {
        setMacroSelected(macro.macroHtml!);
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        setMacroCategorySelected(event.target.value);
        setMessageContent('');
    };

    return (
        <div>
            <div className=' py-4 pl-6 border-0 border-solid border-b-2 border-b-[#E5E5E5]'>
                <BioType className='  itd-subtitle text-primary'>
                    Patient Messaging Macros
                </BioType>
            </div>

            <div className='flex flex-row gap-3 px-2'>
                <FormControl fullWidth margin='normal'>
                    <TextField
                        id='outlined-basic'
                        label='Search Macros'
                        variant='outlined'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </FormControl>

                <FormControl fullWidth margin='normal'>
                    <InputLabel id='macros'>Categories</InputLabel>
                    <Select
                        id='macros_select'
                        label='Categories'
                        variant='outlined'
                        value={macroCategorySelected}
                        onChange={handleSelectChange}
                    >
                        <MenuItem value={'All'}>All</MenuItem>
                        {data?.categories.map((category, index) => (
                            <MenuItem key={index} value={category.category}>
                                {category.category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className='flex flex-row gap-3  w-full my-4'>
                <div></div>
                <Paper className=' w-1/2 p-3  h-[600px] overflow-y-auto'>
                    {data &&
                        (shouldUseFilter
                            ? filteredMacrosList
                            : data.macros
                        ).map((macro, index) => {
                            if (macroCategorySelected != 'All') {
                                if (macro.category != macroCategorySelected) {
                                    return null;
                                }
                            }

                            return (
                                <>
                                    <BioType
                                        key={index}
                                        className='itd-body mb-3'
                                        onClick={() => {
                                            handleMacroSelect(macro);
                                        }}
                                    >
                                        {macro.name}
                                    </BioType>
                                </>
                            );
                        })}
                </Paper>

                <MacroView key={macroSelected} macroContent={macroSelected} />
            </div>

            <div
                id='macros-button'
                className='flex flex-col justify-center items-center border-0 border-solid border-t-2 border-t-[#E5E5E5] py-4'
            >
                <Button
                    className='p-2'
                    variant='contained'
                    disabled={macroSelected ? false : true}
                    onClick={() => {
                        if (macroDestination == 'messages') {
                            setTabSelected('messages');
                            setMessageContent(macroSelected);
                        } else {
                            // setClinicalNoteTextInputValue(macroSelected);
                        }
                    }}
                >
                    Use Template
                </Button>
            </div>
        </div>
    );
};

export default MacrosDisplay;
