'use client';

import { useState } from 'react';
import ProviderList from '../components/provider-list/provider-list';
import ProvderDetailMenu from '../components/provider-detail-menu/provider-detail-menu';

interface ProviderAuditProps {}

export default function ProviderAuditMainContainer({}: ProviderAuditProps) {
    const [selectedProvider, setSelectedProvider] = useState<ProviderOption>();

    return (
        <div className='flex flex-row justify-center items-start w-full gap-4 mt-5'>
            <ProviderList
                selectedProvider={selectedProvider}
                setSelectedProviderId={setSelectedProvider}
            />
            <ProvderDetailMenu selectedProvider={selectedProvider} />
        </div>
    );
}
