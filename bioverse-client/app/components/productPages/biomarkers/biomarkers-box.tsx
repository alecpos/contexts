'use client';

import { Typography, Button, Box } from '@mui/material';
import BiomarkerCarousel from './biomarker-carousel';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/app/utils/clients/supabaseBrowserClient';

interface Props {
    productName: string;
    productId: number;
}

interface BiomarkerRow {
    id: number;
    name: string;
    unit: string;
    description: string;
}

async function fetchBiomarkerFromMappingTable(id: number): Promise<number[]> {
    try {
        // Replace 'base' with your table name
        const tableName = 'product_biomarker_mapping';

        const supabase = createSupabaseBrowserClient();

        // Replace 'id' with the column you want to retrieve
        const { data, error } = await supabase
            .from(tableName)
            .select('biomarker')
            .eq('id', id)
            .single();

        if (error) {
            console.error(
                'Error fetching data from biomarker mapping table:',
                error.message,
            );
            return [];
        }
        // Extract IDs from the result
        const idsArray = data.biomarker;

        return idsArray;
    } catch (error: any) {
        console.error(
            'Error in fetching table data for biomarkers',
            error.message,
        );
        return [];
    }
}

async function fetchBiomarkersWithMarkerArray(biomarkers: number[]) {
    try {
        // Replace 'datax' with your table name
        const tableName = 'biomarkers';

        const supabase = createSupabaseBrowserClient();

        // Use the 'in' filter to search for rows with IDs in the provided array
        const { data, error } = await supabase
            .from(tableName)
            .select()
            .in('id', biomarkers);

        if (error) {
            console.error(
                'Error fetching data from biomarker table:',
                error.message,
            );
            return [];
        }

        //console.log('Selected rows from datax table:', data); //Debug Line for retrieved database rows
        return data;
    } catch (error: any) {
        console.error(
            'Error in fetch data from biomarker datax table:',
            error.message,
        );
        return [];
    }
}

export default function BiomarkersInformationBox({
    productName,
    productId,
}: Props) {
    const background = {
        borderRadius: 'var(--none, 0px)',
        background:
            'radial-gradient(161.2% 44.61% at 50% 50%, #508DC1 52.08%, #DFCFBA 100%)',
        filter: 'blur(192.5px)',
    };

    const [biomarkersId, setBiomarkersId] = useState<number[]>([]);
    const [biomarkerData, setBiomarkerData] = useState<BiomarkerRow[]>([]);

    useEffect(() => {
        const getBiomarkers = async () => {
            // Fetch data from the datax table using the obtained IDs
            const x = await fetchBiomarkersWithMarkerArray(biomarkersId);
            setBiomarkerData(x);
        };

        getBiomarkers();
    }, [biomarkersId]);

    useEffect(() => {
        const getBiomarkers = async () => {
            // Fetch data from the datax table using the obtained IDs
            setBiomarkersId(await fetchBiomarkerFromMappingTable(productId));
        };

        getBiomarkers();
    }, [biomarkersId]);

    return (
        <div
            id="biomarkers-container"
            className="flex flex-col md:flex-row p-0 w-full items-start "
        >
            {/**
             * There is a problem regarding the css classes. So pdpbg will be kept til fixed.
             */}
            {/* <div className=" bg-gradient-to-r from-blue-500 to-yellow-300 blur-[192.5px]"></div> */}
            <div
                id="biomarkers-cta"
                className="flex flex-col p-[1.389vw] items-start gap-[1.67vw]"
            >
                {/* <div className='w-[100vw] h-[29.8vw] overflow-hidden flex-shrink-0 absolute' style={background}></div> */}
                <Typography className="!text-black h5">
                    {productName} supports Key Biomarkers
                </Typography>
                <Typography className={`!body1 !text-black`}>
                    Learn which biomarkers matter the most to you for only $189.
                </Typography>
                <Button variant="contained">TAKE THE DIAGNOSTIC</Button>
            </div>

            <BiomarkerCarousel biomarkers={biomarkerData} />
        </div>
    );
}
