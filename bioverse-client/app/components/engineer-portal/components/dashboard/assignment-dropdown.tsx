import React, { useState } from 'react'; // Import useState

import { Button, MenuItem, Select } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { assignEngineerToStatusTag } from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getEmployeeNameById } from '../../utils/engineer-mapping';
import { KeyedMutator } from 'swr';

interface EngineeringDropdownProps {
    tagId: string | number;
    assigned_engineer?: string;
    current_user_id: string;
    mutate_intake_list: KeyedMutator<PatientOrderEngineerDetails[]>;
}

export default function EngineeringAssignmentDropdown({
    tagId,
    assigned_engineer,
    current_user_id,
    mutate_intake_list,
}: EngineeringDropdownProps) {
    const show_dropdown =
        current_user_id === '025668ab-3f9e-4839-a0c5-75790305cfe9' ||
        current_user_id === '1313a649-2299-4bd2-b584-eab040ce872f' ||
        current_user_id === '9afc3d1d-a9d0-46aa-8598-d2ac3d6ab928';

    const [staticSelection, setStaticSelection] = useState<string>(
        assigned_engineer ?? ''
    );
    const [selectedEngineer, setSelectedEngineer] = useState<string>(
        assigned_engineer ?? ''
    ); // State to hold the selected engineer

    const engineers = [
        { id: '025668ab-3f9e-4839-a0c5-75790305cfe9', name: 'Nathan' },
        { id: '1313a649-2299-4bd2-b584-eab040ce872f', name: 'Olivier' },
        { id: '9afc3d1d-a9d0-46aa-8598-d2ac3d6ab928', name: 'Ben' },
    ];

    const handleChange = (event: SelectChangeEvent<string>) => {
        setSelectedEngineer(event.target.value);
    };

    const updateAssignedEngineer = async (value: string) => {
        const { result } = await assignEngineerToStatusTag(
            tagId as number,
            value
        );
        setStaticSelection(value);
        mutate_intake_list;
    };

    return (
        <div className='flex flex-row gap-2'>
            {show_dropdown ? (
                <Select
                    value={selectedEngineer}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value={''}>None</MenuItem>
                    {engineers.map((engineer) => (
                        <MenuItem key={engineer.id} value={engineer.id}>
                            <BioType
                                className={`${
                                    engineer.id === current_user_id
                                        ? 'text-red-500'
                                        : 'text-blue-300'
                                }`}
                            >
                                {engineer.name}
                            </BioType>
                        </MenuItem>
                    ))}
                </Select>
            ) : (
                <>
                    <BioType
                        className={`${
                            selectedEngineer === current_user_id
                                ? 'text-red-500'
                                : 'text-blue-300'
                        }`}
                    >
                        {getEmployeeNameById(selectedEngineer)}
                    </BioType>
                </>
            )}
            {staticSelection !== selectedEngineer && (
                <Button
                    variant='outlined'
                    onClick={() => updateAssignedEngineer(selectedEngineer)}
                >
                    Assign
                </Button>
            )}
        </div>
    );
}
