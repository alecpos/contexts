'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button, Tooltip } from '@mui/material';

interface ClinicalTemplateCustomTooltip {
    text: string;
    hover: string[];
}

export default function ClinicalTemplateCustomTooltip({
    text,
    hover,
}: ClinicalTemplateCustomTooltip) {
    return (
        <>
            <div>
                <Tooltip
                    sx={{
                        '& .MuiTooltip-tooltip': {
                            backgroundColor: 'green',
                            color: 'green',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            '& .MuiTooltip-arrow': {
                                color: 'orange',
                            },
                        },
                    }}
                    title={hover.map((value) => {
                        return (
                            <BioType
                                key={value}
                                className='provider-dropdown-title normal-case mt-1 mb-1'
                            >
                                {value}
                            </BioType>
                        );
                    })}
                >
                    <Button sx={{ color: 'black' }}>
                        <BioType className='provider-dropdown-title normal-case'>
                            {text}
                        </BioType>
                    </Button>
                </Tooltip>
            </div>
        </>
    );
}
