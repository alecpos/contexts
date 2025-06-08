'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Paper } from '@mui/material';
import React from 'react';

const supportList = [
    {
        title: 'Account Info',
        link: 'https://www.gobioverse.com/help-center/my-account',
    },
    {
        title: 'Orders & subscriptions',
        link: 'https://www.gobioverse.com/help-center/shipping',
    },
    {
        title: 'Billing Info',
        link: 'https://www.gobioverse.com/help-center/my-account',
    },
    {
        title: 'Technical Issues',
        link: 'https://www.gobioverse.com/help-center/the-basics',
    },
    {
        title: 'Something else',
        link: 'https://www.gobioverse.com/help-center',
    },
];
const QuickSupport = () => {
    return (
        <div className='w-full md:w-[600px] mt-20 box-border px-4'>
            <div className='flex flex-col font-light w-full overflow-hidden'>
                <BioType className='itd-body-inter md:itd-body-inter font-bold md:text-[24px]'>
                    Contact Patient Support
                </BioType>
                <BioType className='itd-body-inter md:itd-body-inter mt-2 text-weak sm:text-sm'>
                    Get quick support for any non-medical questions.
                </BioType>
                <div className='flex flex-wrap gap-3 mt-5 mb-10'>
                    {supportList.map((supportItem, index) => (
                        <Paper
                            elevation={0}
                            key={index}
                            className={`flex justify-center items-center w-full md:w-[48%] py-5 md:py-3 itd-body-inter md:itd-body-inter hover:cursor-pointer text-sm md:text-sm font-bold strong-border rounded-xl shadow-none bg-transparent`}
                            onClick={() => {
                                window.open(supportItem.link, '_blank');
                            }}
                        >
                            {supportItem.title}
                        </Paper>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuickSupport;
