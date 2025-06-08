'use client';
import {
    LineChart,
    ResponsiveContainer,
    Line,
    Label,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Area,
    AreaChart,
} from 'recharts';

import {
    SEMAGLUTIDE_PRODUCTS,
    TIRZEPATIDE_PRODUCTS,
} from '../constants/constants';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { useCallback, useState } from 'react';

interface WLGraphProps {
    user_body_weight: number; //in lbs.
    product_href: string;
}

interface WL_GRAPH_PERCENT_DATA_POINTS {
    week: number;
    percent_change: number;
}

const SEMAGLUTIDE_WL_GRAPH_PERCENT_DATA: WL_GRAPH_PERCENT_DATA_POINTS[] = [
    { week: 0, percent_change: 0 },
    { week: 4, percent_change: -2.28 },
    { week: 8, percent_change: -1.72 },
    { week: 12, percent_change: -1.6 },
    { week: 16, percent_change: -1.49 },
    { week: 20, percent_change: -1.55 },
    { week: 28, percent_change: -2.3 },
    { week: 36, percent_change: -1.51 },
    { week: 44, percent_change: -1.29 },
    { week: 52, percent_change: -1.34 },
    { week: 60, percent_change: -1.2 },
    { week: 68, percent_change: -0.52 },
];
const TIRZEPATIDE_WL_GRAPH_PERCENT_DATA: WL_GRAPH_PERCENT_DATA_POINTS[] = [
    { week: 0, percent_change: 0 },
    { week: 4, percent_change: -3.45 },
    { week: 8, percent_change: -2.82 },
    { week: 12, percent_change: -2.79 },
    { week: 16, percent_change: -2.59 },
    { week: 20, percent_change: -2.41 },
    { week: 24, percent_change: -2.32 },
    { week: 28, percent_change: -1.65 },
    { week: 32, percent_change: -1.21 },
    { week: 36, percent_change: -0.76 },
];

const convertWeeksToDate = (weekNum: number) => {
    const monthsToAdd = Math.floor(weekNum / 4);
    const date = new Date();
    date.setMonth(date.getMonth() + monthsToAdd);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    return date.toLocaleDateString('en', options);
};


export default function WeightLossGraph({
    user_body_weight,
    product_href,
}: WLGraphProps) {

    let [areaHeight, setAreaHeight] = useState<string>('');
    let [pointOffset, setPointOffset] = useState<number[]>([0, 0]);
    let [tooltipOffset, setTooltipOffset] = useState<number[]>([0, 0]);
    let [lineOffset, setLineOffset] = useState<number[]>([0, 0]);
    let [pointPos, setPointPos] = useState<number[]>([0, 0]);
    let [opacity, setOpacity] = useState(0);
    let [currWeek, setCurrWeek] = useState<string>('');


    const data = parseBodyWeightToChartDataStructure(
        user_body_weight,
        determineCompoundtype(product_href),
    );

  
    const renderLineChart = (
        <>
            <div className=" inter-h5-regular text-sm flex md:w-[90%] md:h-full relative  md:pl-2 mt-2">
     
               
            <p style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }} className='my-auto'>Weight (lbs)</p>
                <ResponsiveContainer width="90%" height={300} >
                <AreaChart
                        data={data}
                        margin={{ top: 15, left: 0, right: 7, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="graph_color"
                                x1="-29.5662"
                                y1="5"
                                x2="270.195"
                                y2="214.192"
                                gradientUnits="userSpaceOnUse"
                            
                            >
                                    <stop offset="0.0940712" stopColor="#0071E0" stopOpacity="0.6" />
                                    <stop offset="0.160674" stopColor="#0081FF" stopOpacity="0.6" />
                                    <stop offset="0.421668" stopColor="#2A95FE" stopOpacity="0.6" />
                                    <stop offset="0.601173" stopColor="#14C0FA" stopOpacity="0.6" />
                                    <stop offset="1" stopColor="#00E6F7" stopOpacity="0.3" />
                            </linearGradient>
                            <filter id="blurEdges" x="-10%" y="-10%" width="120%" height="120%">
                                <feGaussianBlur stdDeviation="2" />
                            </filter>
                        </defs>
                        <Area //this is the dashed line
                            dataKey="displayVal"
                            fill="none" 
                            stroke="#1da1ef"
                            strokeWidth={3}
                            strokeDasharray="8 4"
                            connectNulls
                            isAnimationActive={false}
                        />

                        <Area //this is the area and the dots
                            fill="url(#graph_color)"
                            dataKey="displayVal"
                            filter="url(#blurEdges)"
                            connectNulls
                            className='ml-3'
                            dot={(dotProps) => (
                                <CustomizedDot {...dotProps} index={dotProps.index} totalDots={data.length} />
                            )}
                            isAnimationActive={false}
                        />
       
                        <CartesianGrid stroke="#D7D7D740" strokeDasharray="3 3" className='opacity-75'/>
                        <XAxis
                            dataKey="name"
                            height={50}
                            scale={'auto'}
                            allowDecimals={false}
                            tick={true}
                            tickLine={false}
                            axisLine={false}
                        ></XAxis>
                        <YAxis
                            domain={[
                                Math.floor((user_body_weight * 0.84) / 10) * 10 - 8,
                                'dataMax',
                            ]}
                            ticks={[...generateWeightRange(user_body_weight)]}
                            allowDecimals={false}
                            tick={true}
                            tickLine={false}
                            axisLine={false}
                        ></YAxis>
                    </AreaChart>
                    
                </ResponsiveContainer>
               
            </div>
            <p className='text-center inter-h5-regular text-sm mb-4'>Weeks</p>
        </>
    );

    return (
        <div className="flex flex-col">
            <div>{renderLineChart}</div>
        </div>
    );
}

function determineCompoundtype(product_href: string): number {
    if (SEMAGLUTIDE_PRODUCTS.includes(product_href as PRODUCT_HREF)) {
        return 1; //1 is semaglutide
    } else if (TIRZEPATIDE_PRODUCTS.includes(product_href as PRODUCT_HREF)) {
        return 2; //2 is tirzepatide
    }

    return 0; //0 means something went wrong
}

function generateWeightRange(user_body_weight: number): number[] {
    const start = Math.ceil(user_body_weight / 10) * 10;
    const end = Math.floor((user_body_weight * 0.84) / 10) * 10;
    const weightRange: number[] = [];

    for (let i = start; i >= end; i -= 10) {
        weightRange.push(i);
    }

    return weightRange;
}

function parseBodyWeightToChartDataStructure(
    user_body_weight: number,
    compound_type: number,
) {
    // Initialize the array to hold the transformed data
    let transformedData: { name: string; val: number; displayVal: number }[] = [
        { name: '0', val: user_body_weight, displayVal: user_body_weight },
    ];

    const percent_data =
        compound_type === 1
            ? SEMAGLUTIDE_WL_GRAPH_PERCENT_DATA
            : TIRZEPATIDE_WL_GRAPH_PERCENT_DATA;

    // Iterate through the TIRZEPATIDE_WL_GRAPH_PERCENT_DATA array
    for (let i = 1; i < percent_data.length; i++) {
        // Calculate the new value based on the previous entry's value and the current entry's percent_change
        let val =
            transformedData[i - 1].val -
            (user_body_weight * Math.abs(percent_data[i].percent_change)) / 100;

        // Create the new object and add it to the transformedData array
        transformedData.push({
            name: percent_data[i].week.toString(), // Convert week number to string for the name property
            val: val, // Use the calculated value
            displayVal: Math.round(val),
        });
    }

    // Return the transformed data
    return transformedData;
}


const CustomizedDot = (props: any) => {
    const { cx, cy, index, totalDots } = props;

    // Calculate the shade of the color
    const baseColor = 20; // Base RGB value for blue (0-255 scale)
    const shadeIncrement = Math.floor((255 - baseColor) / totalDots); // Step to lighten the color
    const colorValue = Math.min(baseColor + shadeIncrement * index, 255); // Ensure it doesn't exceed 255
    const fillColor = `rgb(${baseColor}, ${colorValue}, 240)`; // Adjust RGB for gradual lightening

    return (
        <circle
            cx={cx}
            cy={cy}
            r={7}
            fill={fillColor}
        />
    );
};

