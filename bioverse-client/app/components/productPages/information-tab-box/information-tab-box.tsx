'use client';

import { Box, Tabs, Tab, useMediaQuery } from '@mui/material';

import { useState } from 'react';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import ScrollingMarqueeBar from '../content-pages/prescriptions/components/scrollingMarqueeBar';

interface Props {
    instructions: any;
    benefits: any;
    description: any;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    className: string;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, className } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            className={className}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

export default function InformationTabBox({
    description,
    benefits,
    instructions,
}: Props) {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const isNotMobile = useMediaQuery('(min-width:640px)');

    return (
        <div
            className={` ${
                isNotMobile
                    ? 'flex w-[120%] mx-5 md:mx-0 flex-col p-0 gap-0 items-start bg-white rounded'
                    : 'flex w-[90%] mx-5 md:mx-0 flex-col p-0 gap-0 items-start bg-white rounded'
            }`}
            style={
                isNotMobile
                    ? {
                          maxHeight: '650px',
                          minHeight: '600px',
                          overflowY: 'auto',
                      }
                    : {}
            }
        >
            <Box
                sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}
            >
                <Tabs
                    className='bg-[#f5faff] body1'
                    value={value}
                    onChange={handleChange}
                    aria-label='product-information-tabs'
                >
                    <Tab
                        label='Description'
                        {...a11yProps(0)}
                        className='text-xs md:text-base flex flex-col justify-center items-center flex-1 text-[#8f9090]'
                    />
                    <Tab
                        label='Benefits'
                        {...a11yProps(1)}
                        className='text-xs md:text-base flex flex-col justify-center items-center flex-1 text-[#8f9090]'
                    />
                    <Tab
                        label='Instructions'
                        {...a11yProps(2)}
                        className='text-xs md:text-base flex flex-col justify-center items-center flex-1 text-[#8f9090]'
                    />
                </Tabs>
            </Box>
            <TabPanel
                value={value}
                index={0}
                className='flex w-full flex-row justify-start items-start gap-[1.67vw] body1'
            >
                <BioType className='body1'>{description}</BioType>
            </TabPanel>
            <TabPanel
                value={value}
                index={1}
                className='flex w-full flex-row justify-start items-start gap-6'
            >
                {benefits.benefits &&
                    benefits.benefits.map((benefit: any, index: number) => (
                        <div
                            key={index}
                            className='flex p-[0.83vw] flex-col justify-center items-start self-stretch'
                        >
                            <div className='flex flex-row justify-center'>
                                {/* <img src={`/img/benefit-icons/${benefit.icon}`} /> image only necessary after benefits icons are added and stored in bucket. */}
                                <div className='body1bold'>
                                    {benefit.header}
                                </div>
                            </div>
                            <BioType className={`body1`}>
                                {benefit.description}
                            </BioType>
                        </div>
                    ))}
            </TabPanel>
            <TabPanel
                value={value}
                index={2}
                className='flex w-full flex-row justify-start items-start gap-[1.67vw] body1 whitespace-pre-wrap'
            >
                <BioType>{instructions}</BioType>
            </TabPanel>
        </div>
    );
}
