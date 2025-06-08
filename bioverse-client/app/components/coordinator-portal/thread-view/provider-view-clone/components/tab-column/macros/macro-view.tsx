import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Paper } from '@mui/material';
import React from 'react';
import MacrosTiptap from './macros-tiptap';

const MacroView = ({ macroContent }: { macroContent: string }) => {
    return (
        <Paper className='w-1/2 p-3  h-[600px] overflow-y-auto'>
            <BioType className='itd-body text-textSecondary'>
                {macroContent ? (
                    <MacrosTiptap content={macroContent} />
                ) : (
                    'Select a template to preview.'
                )}
            </BioType>
        </Paper>
    );
};

export default MacroView;
