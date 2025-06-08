import React, { useState } from 'react'; // Import useState

import { Button, MenuItem, Select } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {
    assignEngineerToStatusTag,
    setStatusTagMetadata,
} from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getEmployeeNameById } from '../../utils/engineer-mapping';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import { KeyedMutator } from 'swr';

interface EngineeringDropdownProps {
    tagId: number;
    special_case_value: string;
    mutate_intake_list: KeyedMutator<PatientOrderEngineerDetails[]>;
}

export default function EngPortalSpecialCaseDropDown({
    tagId,
    special_case_value,
    mutate_intake_list,
}: EngineeringDropdownProps) {
    const [specialCaseDisplay, setSpecialCaseDisplay] = useState<string>(
        special_case_value ?? ''
    );
    const [staticDisplay, setStaticDisplay] = useState<string>(
        special_case_value ?? ''
    );

    const options = [
        {
            id: 'BugTracking',
            name: 'Tracking Bug - No Pending Patient',
            color: 'text-blue-500',
        },
        {
            id: 'PatientNeedsScript',
            name: 'Patient Needs Script',
            color: 'text-red-500',
        },
        {
            id: 'NeedDiscussion',
            name: 'Needs Discussion',
            color: 'text-orange-600',
        },
        {
            id: 'Unknown',
            name: 'Issue Unknown',
            color: 'text-black',
        },
    ];

    const handleChange = (event: SelectChangeEvent<string>) => {
        setSpecialCaseDisplay(event.target.value);
    };

    const updateAssignedSpecialCase = async (value: string) => {
        console.log(tagId);
        await setStatusTagMetadata(tagId, 'renewalSpecialCase', value);
        setStaticDisplay(value);
        mutate_intake_list;
    };

    return (
        <div className='flex flex-row gap-2'>
            <Select
                value={specialCaseDisplay}
                onChange={handleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
            >
                <MenuItem value={''}>None</MenuItem>
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        <BioType className={`${option.color}`}>
                            {option.name}
                        </BioType>
                    </MenuItem>
                ))}
            </Select>

            {specialCaseDisplay !== staticDisplay && (
                <Button
                    variant='outlined'
                    onClick={() =>
                        updateAssignedSpecialCase(specialCaseDisplay)
                    }
                >
                    Assign
                </Button>
            )}
        </div>
    );
}
