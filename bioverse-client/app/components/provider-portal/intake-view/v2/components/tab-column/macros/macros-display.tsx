import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    Tooltip,
} from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import MacroView from './macro-view';
import useSWR from 'swr';
import { getAllMacrosByResponder } from '@/app/utils/database/controller/macros/macros-api';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';

interface MacrosDisplayProps {
    setTabSelected: React.Dispatch<React.SetStateAction<string>>;
    setMessageContent: Dispatch<SetStateAction<string>>;
}
const MacrosDisplay = ({
    setMessageContent,
    setTabSelected,
}: MacrosDisplayProps) => {
    const [filteredMacrosList, setFilteredMacrosList] = useState<MacrosSBR[]>(
        []
    );
    const [macroCategorySelected, setMacroCategorySelected] = useState('All');
    const [macroSelected, setMacroSelected] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [shouldUseFilter, setShouldUseFilter] = useState<boolean>(false);
    const [selectedMacro, setSelectedMacro] = useState<MacrosSBR>({});
    // const [macroTitleChangeDialogOpen, setMacroTitleChangeDialogOpen] =
    //     useState<boolean>(false);
    // const [userPermissionLead, setUserPermissionLead] =
    //     useState<boolean>(false);

    const { data, error, isLoading, mutate } = useSWR(`provider-macros`, () =>
        getAllMacrosByResponder('Provider')
    );

    // useEffect(() => {
    //     const permissionCheck = async () => {
    //         const result = await verifyUserPermission(
    //             BV_AUTH_TYPE.LEAD_COORDINATOR
    //         );
    //         console.log(result);
    //         if (result.access_granted) {
    //             setUserPermissionLead(true);
    //         }
    //     };
    //     permissionCheck();
    // }, []);

    useEffect(() => {
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
                    macro.tags!.some((tag) => regexPattern.test(tag))
            );

            setFilteredMacrosList(filtered);
        };

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

    const handleMacroSelect = (macro: MacrosSBR) => {
        setMacroSelected(macro.macroHtml!);
        setSelectedMacro(macro);
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        setMacroCategorySelected(event.target.value);
        setMessageContent('');
    };

    const macroPopulateHandler = () => {
        setTabSelected('messages');
        setMessageContent(macroSelected);
    };

    return (
        <div>
            <div className=' py-4 pl-6 border-0 border-solid border-b border-b-[#E5E5E5]'>
                <BioType className=' provider-intake-tab-title'>
                    Patient Messaging Macros
                </BioType>
            </div>
            <div className=' px-6 h-[65vh]'>
                <div className='flex flex-row gap-[16px] '>
                    <FormControl fullWidth margin='normal' className='provider-tabs-macro-title'>
                        <TextField
                            id='outlined-basic'
                            label='Search Macros'
                            variant='outlined'
                            className='provider-tabs-macro-title'
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

                <div className='flex flex-row gap-[16px] my-4 max-h-[55vh] '>
                    <Paper className='flex flex-col w-1/2 overflow-y-scroll max-h-[50%] pt-3 flex-grow  border-solid border border-[#E5E5E5]' style={{boxShadow: 'none'}}>
                        {data &&
                            (shouldUseFilter
                                ? filteredMacrosList
                                : data.macros
                            ).map((macro, index) => {
                                if (macroCategorySelected != 'All') {
                                    if (
                                        macro.category != macroCategorySelected
                                    ) {
                                        return null;
                                    }
                                }
                                return (
                                    <div key={macro.id}>
                                        <Tooltip
                                            title={
                                                <span className='inter'>
                                                Click to Preview, Double Click To Use
                                                </span>
                                            }
                                            placement='right'
                                            key={macro.id}
                                        >
                                            <div
                                                onDoubleClick={() => {
                                                    macroPopulateHandler();
                                                }}
                                                key={index}
                                                className='px-3'
                                            >
                                                <BioType
                                                    key={index}
                                                    className={`provider-tabs-macro-title mb-3 hover:cursor-pointer hover:bg-blue-100 ${
                                                        macroSelected ===
                                                        macro.macroHtml
                                                            ? 'bg-blue-300 rounded-md'
                                                            : ''
                                                    }`}
                                                    onClick={() => {
                                                        handleMacroSelect(
                                                            macro
                                                        );
                                                    }}
                                                >
                                                    {macro.name}
                                                </BioType>
                                            </div>
                                        </Tooltip>
                                    </div>
                                );
                            })}
                    </Paper>

                    <div className='w-1/2 flex flex-col gap-2  border-solid border border-[#E5E5E5] rounded-md' >
                        {/* {userPermissionLead && !isEmpty(selectedMacro) && (
                            <>
                                <Button
                                    variant='outlined'
                                    onClick={() =>
                                        setMacroTitleChangeDialogOpen(true)
                                    }
                                >
                                    Change Macro Title
                                </Button>
                                <MacroTitleChangeDialog
                                    open={macroTitleChangeDialogOpen}
                                    onClose={() => {
                                        setMacroTitleChangeDialogOpen(false);
                                    }}
                                    macroTitle={selectedMacro.name!}
                                    macroId={selectedMacro.id!}
                                    mutateMacroList={mutate}
                                />
                            </>
                        )} */}

                        <MacroView
                            key={macroSelected}
                            macroContent={macroSelected}
                            mutateMacroList={mutate}
                            macroId={selectedMacro.id ?? -1}
                            macroTags={selectedMacro.tags ?? ['undefined']}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MacrosDisplay;
