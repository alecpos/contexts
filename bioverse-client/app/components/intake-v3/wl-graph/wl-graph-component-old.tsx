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



/** 
*
* @Author Ben Hebert
* Calling this file old because it's essentially the v1 graph with new fonts 
* there is a a newer design that did not make the cut for v3 intake 
* 
*/
export default function WeightLossGraph({
    user_body_weight,
    product_href,
}: WLGraphProps) {
    const data = parseBodyWeightToChartDataStructure(
        user_body_weight,
        determineCompoundtype(product_href),
    );

    const maxValue = user_body_weight;
    let [currWeek, setCurrWeek] = useState<string>('');
    let [areaHeight, setAreaHeight] = useState<string>('');
    let [pointOffset, setPointOffset] = useState<number[]>([0, 0]);
    let [tooltipOffset, setTooltipOffset] = useState<number[]>([0, 0]);
    let [lineOffset, setLineOffset] = useState<number[]>([0, 0]);
    let [pointPos, setPointPos] = useState<number[]>([0, 0]);
    let [opacity, setOpacity] = useState(0);

    const handleAreaRef = useCallback((e: any) => {
        if (!e) {
            return;
        }
        setAreaHeight(e.props.height);
        let points = e?.props.points;
        let i = -1;
        let timer = setInterval(() => {
            setPointPos((prev) => {
                if (i >= points.length - 1) {
                    clearInterval(timer);
                    return prev;
                }
                i++;
                return [points[i].x, points[i].y];
            });
            setOpacity(1);
            setCurrWeek((_) => convertWeeksToDate(points[i]?.payload.name));
        }, 200);
    }, []);

    const handlePointRef = useCallback((e: HTMLDivElement) => {
        if (!e) {
            return;
        }
        let rect = e.getBoundingClientRect();
        setPointOffset([rect.width, rect.height]);
    }, []);

    const handleTooltipRef = useCallback((e: HTMLDivElement) => {
        if (!e) {
            return;
        }
        let rect = e.getBoundingClientRect();
        setTooltipOffset([rect.width, rect.height]);
    }, []);

    const handleLineRef = useCallback((e: HTMLDivElement) => {
        if (!e) {
            return;
        }
        let rect = e.getBoundingClientRect();
        setLineOffset([rect.width, rect.height]);
    }, []);

    const pointStyle = {
        opacity: opacity,
        borderColor: '#286BA2',
        transform: `translate(${pointPos[0]}px, ${pointPos[1]}px)`,
        left: `-${pointOffset[0] / 2}px`,
        top: `-${pointOffset[1] / 2}px`,
    };

    const toolTipStyle = {
        opacity: opacity,
        transform: `translate(${pointPos[0]}px, 10px)`,
        left: `-${tooltipOffset[0] / 2}px`,
        top: `-${tooltipOffset[1] / 2}px`,
        fontSize: '19px',
        padding: '6px 10px',
    };

    const lineStyle = {
        opacity: opacity,
        transform: `translate(${pointPos[0]}px, 10px)`,
        left: `-${lineOffset[0] / 2}px`,
        height: `${areaHeight}px`,
    };

    const CustomLabel = ({ value }: { value: string }) => (
        <div className="text-gray-700">{value}</div>
    );

    const renderLineChart = (
        <>
            <div className="inter-tight text-[14px] md:flex md:w-full md:h-full relative ">
                {/* <div
                    className="absolute border-l-0 border-solid border-gray-700 border-opacity-10 z-50 transition-all ease-linear duration-200"
                    style={lineStyle}
                    ref={handleLineRef}
                ></div> */}
                {/* <div
                    className="absolute bg-white whitespace-nowrap text-[15px] h-[30px] w-[80px] sm:h-[36px] sm:w-[100px] rounded-full z-50 flex justify-center items-center shadow transition-all ease-linear duration-200"
                    style={toolTipStyle}
                    ref={handleTooltipRef}
                >
                    {currWeek}
                </div> */}
                <div
                    className="h-1 w-1 absolute bg-white border-1 border-solid rounded-full z-50 transition-all ease-linear duration-200 ml-1"
                    style={pointStyle}
                    ref={handlePointRef}
                ></div>
                {/* <p style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }} className='my-auto'>Weight (lbs)</p> */}

                <ResponsiveContainer width="100%" height={328}>
                    <AreaChart
                        data={data}
                        margin={{ top: 15, left: 0, right: 10, bottom: 10 }}
                    >
                 
                        <Area
                            ref={handleAreaRef}
                            fill="url(#graph_color)"
                            dataKey="displayVal"
                            stroke="#286BA2"
                            strokeWidth={2}
                            connectNulls
                        />
                        <CartesianGrid stroke="#D7D7D740" strokeDasharray="3" />
                        <XAxis
                            dataKey="name"
                            height={50}
                            scale={'auto'}
                            allowDecimals={false}
                            tick={false}
                            tickLine={false}
                            axisLine={false}
                        ></XAxis>
                               <defs>
                            <linearGradient
                                id="graph_color"
                                x1="-29.5662"
                                y1="5"
                                x2="270.195"
                                y2="214.192"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0.0940712" stop-color="#0071E0" />
                                <stop
                                    offset="0.160674"
                                    stop-color="#0081FF"
                                    stop-opacity="0.916064"
                                />
                                <stop offset="0.421668" stop-color="#2A95FE" />
                                <stop offset="0.601173" stop-color="#14C0FA" />
                                <stop offset="1" stop-color="#00E6F7" />
                            </linearGradient>
                        </defs>
                        <YAxis
                            domain={[
                                Math.floor((user_body_weight * 0.84) / 10) * 10,
                                'dataMax',
                            ]}
                            ticks={[...generateWeightRange(user_body_weight)]}
                            allowDecimals={false}
                            tick={false}
                            tickLine={false}
                            axisLine={false}
                        ></YAxis>
                    </AreaChart>
                </ResponsiveContainer>
            </div>            

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
