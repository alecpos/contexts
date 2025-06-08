'use client';

import React, { useState } from 'react';
import { Box, Chip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';

interface Props {
    className: string;
    citations: string[];
}

export default function CitationsBox({ className, citations }: Props) {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [showMoreExpanded, setShowMoreExpanded] = useState<boolean>(false);

    const handleClick = () => {
        setExpanded(!expanded);
    };

    const handleShowMoreExpand = () => {
        setShowMoreExpanded(!showMoreExpanded);
    };

    const answerStyle = {
        opacity: expanded ? 1 : 0,
        maxHeight: expanded ? '500px' : '0',
        margin: expanded ? '10px' : '0 10px',
        overflow: 'hidden',
        transition: 'opacity 0.3s ease, max-height 0.3s ease, margin 0.3s ease',
    };

    function formatCitation(citation: string) {
        const byIndex = citation.indexOf(' by ');
        const beforeBy = citation.substring(0, byIndex);
        const afterBy = citation.substring(byIndex);

        return { beforeBy, afterBy };
    }

    return (
        <div className={className}>
            <Box
                className='flex flex-row items-center gap-3'
                onClick={handleClick}
            >
                <Chip
                    label={citations.length}
                    variant='outlined'
                    sx={{
                        borderRadius: '5px', // 25% more round than before, adjust as needed
                        width: 'fit-content',
                        height: 'auto',
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                        fontSize: '0.875rem',
                        fontWeight: 'normal',
                        textTransform: 'uppercase',
                        paddingX: '6px', // Reduced horizontal padding by 10%
                        paddingY: '8px',
                        '& .MuiChip-icon': {
                            marginLeft: '4px', // Adjust the icon's left margin if necessary
                        },
                    }}
                />
                <BioType className='body2 cursor-pointer'>
                    SCIENTIFIC REFERENCES
                </BioType>
                <IconButton
                    style={{
                        transform: `rotate(${expanded ? '180deg' : '0deg'})`,
                        transition: 'transform 0.3s ease-in-out',
                    }}
                >
                    {expanded ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
            </Box>
            <div style={answerStyle}>
                <div className='flex flex-col'>
                    {(showMoreExpanded ? citations : citations.slice(0, 5)).map(
                        (citation, index) => {
                            const byIndex = citation.indexOf(' by ');
                            const beforeBy =
                                byIndex !== -1
                                    ? citation.substring(0, byIndex)
                                    : citation;
                            const afterBy =
                                byIndex !== -1
                                    ? citation.substring(byIndex)
                                    : '';

                            return (
                                <div key={index} className='mb-1'>
                                    <BioType className='body2'>
                                        <span>
                                            {index + 1}. {beforeBy}
                                        </span>
                                        {afterBy && (
                                            <span className='text-gray-400'>
                                                {afterBy}
                                            </span>
                                        )}
                                    </BioType>
                                </div>
                            );
                        }
                    )}
                    {citations.length > 5 && (
                        <BioType
                            className='body1 cursor-pointer hover:underline'
                            onClick={handleShowMoreExpand}
                        >
                            {showMoreExpanded ? 'Show Less...' : 'Show More...'}
                        </BioType>
                    )}
                    {citations.length > 5 && (
                        <BioType
                            className='body1 cursor-pointer hover:underline'
                            onClick={handleShowMoreExpand}
                        >
                            {showMoreExpanded ? 'Show Less...' : 'Show More...'}
                        </BioType>
                    )}
                </div>
            </div>
        </div>
    );
}
