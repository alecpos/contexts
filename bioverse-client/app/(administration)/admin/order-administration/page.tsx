'use server';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import AdministratorOrderTable from './_components/administrator-order-table';

export default async function OrderAdministrationPage() {
    return (
        <>
            <div className='flex flex-col justify-center items-center my-4'>
                <BioType className='h4 text-primary'>Order Management</BioType>
                <div className='flex flex-col w-[75%]'>
                    <AdministratorOrderTable />
                </div>
            </div>
        </>
    );
}
