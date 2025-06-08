'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import { Paper } from '@mui/material';
import useSWR from 'swr';

interface ProviderDetailMenuProps {
    selectedProvider: ProviderOption | undefined;
}

export default function ProvderDetailMenu({
    selectedProvider,
}: ProviderDetailMenuProps) {
    const { data, error, isLoading } = useSWR(
        selectedProvider ? `${selectedProvider.id}-activity-audit` : null,
        () => {}
    );

    return (
        <Paper className='flex w-[75%] min-h-[75%]'>
            <div className='flex p-4 flex-col h-full w-full'>
                <BioType className='it-h1'>Audit Details for</BioType>
                <div className='h-full'>
                    <HorizontalDivider backgroundColor={'gray'} height={1} />
                </div>
                {!selectedProvider && (
                    <div className='flex flex-col py-4'>
                        <BioType className='it-subtitle'>
                            Please select a provider on the left to load data.
                        </BioType>
                    </div>
                )}
            </div>
        </Paper>
    );
}
