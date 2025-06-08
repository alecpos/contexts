'use client';

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

interface Props {
    productData: any[];
}

export default function ReviewApiSelectMenu({ productData }: Props) {
    const [selectedItem, setSelectedItem] = useState<string>(
        productData[0].href,
    );

    const router = useRouter();

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        setSelectedItem(event.target.value);
    };

    const handleRedirect = () => {
        router.push(`/admin/reviewapi/${selectedItem}`);
    };

    return (
        <>
            <div className="flex flex-row gap-2 my-10">
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                        Select a Product
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedItem}
                        label="Select a Product"
                        onChange={handleSelectChange}
                    >
                        {productData.map((product, index) => (
                            <MenuItem key={index} value={product.href}>
                                {product.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button onClick={handleRedirect}>Go</Button>
            </div>
        </>
    );
}
