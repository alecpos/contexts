'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Button,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    createNewProductInStripe,
    getProductDetailsForStripeAPI,
} from '../stripe-api-actions';

interface Props {
    productData: any[];
}

export default function StripeProductAPISelectMenu({ productData }: Props) {
    const [stripeResponse, setResponse] = useState<any>({});
    const [selectedItem, setSelectedItem] = useState<string>(
        productData[0].href
    );

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        setSelectedItem(event.target.value);
    };

    const generateStripeIdAndUpdate = async () => {
        const { data: productData, error: error } =
            await getProductDetailsForStripeAPI(selectedItem);

        if (error) {
            console.log('error', error);
            return;
        }

        const response = await createNewProductInStripe(productData);

        setResponse(response);
    };

    return (
        <>
            <div className='flex flex-row gap-2 my-10'>
                <FormControl fullWidth>
                    <InputLabel id='demo-simple-select-label'>
                        Select a Product
                    </InputLabel>
                    <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={selectedItem}
                        label='Select a Product'
                        onChange={handleSelectChange}
                    >
                        {productData.map((product, index) => (
                            <MenuItem key={index} value={product.href}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button variant='contained' onClick={generateStripeIdAndUpdate}>
                    Generage Stripe Product ID
                </Button>
            </div>

            <div className='flex flex-col mb-[300px] gap-4 justify-center items-center'>
                <BioType className='h6'>RESULT</BioType>
                <div>Product {JSON.stringify(stripeResponse.product)}</div>
                <div>
                    Made Product {JSON.stringify(stripeResponse.madeProduct)}
                </div>
                <div>
                    Product Data {JSON.stringify(stripeResponse.productData)}
                </div>
            </div>
        </>
    );
}
