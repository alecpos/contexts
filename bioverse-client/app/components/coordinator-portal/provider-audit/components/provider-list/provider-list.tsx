'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import { getProviderList } from '@/app/utils/database/controller/providers/providers-api';
import { Paper } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import useSWR from 'swr';

interface ProviderListProps {
    selectedProvider: ProviderOption | undefined;
    setSelectedProviderId: Dispatch<SetStateAction<ProviderOption | undefined>>;
}

export default function ProviderList({
    selectedProvider,
    setSelectedProviderId,
}: ProviderListProps) {
    const { data, error, isLoading } = useSWR(`provider-list`, () =>
        getProviderList()
    );

    return (
        <Paper className='flex flex-col w-[20%] min-h-[75%]'>
            <div className='flex p-4 flex-col h-full'>
                <BioType className='it-h1'>Providers:</BioType>
                <div className='h-full'>
                    <HorizontalDivider backgroundColor={'gray'} height={1} />
                </div>
                <div className='flex flex-col it-body p-2 gap-2'>
                    {data &&
                        data.map((provider_item, index) => (
                            <div
                                key={index}
                                className={`rounded-lg hover:bg-blue-200 hover:cursor-pointer ${
                                    selectedProvider &&
                                    selectedProvider.id === provider_item.id &&
                                    'bg-blue-200'
                                }
                                `}
                                onClick={() => {
                                    setSelectedProviderId(provider_item);
                                }}
                            >
                                {provider_item.name}
                            </div>
                        ))}
                </div>
            </div>
        </Paper>
    );
}
