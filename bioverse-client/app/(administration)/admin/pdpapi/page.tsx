'use client';

import React, { useEffect, useState } from 'react';
import {
    fetchProducts,
    deleteProduct,
} from '../../../utils/actions/pdp-api/pdp-api';
import Link from 'next/link';

interface Product {
    id: number;
    name: string;
}

const Page = () => {
    const [data, setData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts().then(({ data, error }) => {
            if (error) {
                console.error('Failed to fetch products:', error);
                setData([]); // Set an empty array if there's an error
                setLoading(false);
            } else {
                // Ensure that data is not null and is an array of products
                if (data && Array.isArray(data)) {
                    setData(data);
                } else {
                    console.error('Invalid data format:', data);
                    setData([]); // Set an empty array if data format is invalid
                }
                setLoading(false);
            }
        });
    }, []);

    if (loading) {
        return <span>Loading products...</span>;
    }

    if (!data || data.length === 0) {
        return <span>Product not found</span>;
    }

    const handleDelete = (product: any) => {
        const confirmDelete = window.prompt(
            `Please enter "delete" to confirm that you want to delete "${product.name}".`,
        );
        if (confirmDelete === 'delete') {
            deleteProduct(product.id, product.href).then(({ error }) => {
                if (error) {
                    console.error('Failed to delete product:', error);
                } else {
                    setData(data.filter((item) => item.id !== product.id));
                }
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Product Catalog
                </h1>
                <Link
                    href="/admin/pdpapi/create-product"
                    className="bg-blue-300 text-white hover:bg-blue-700 font-semibold px-4 py-2 rounded-md mb-6"
                >
                    Create New Product
                </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.map((product) => (
                    <div
                        className="rounded-lg shadow-md overflow-hidden p-4 hover:bg-gray-100 mb-4"
                        key={product.id}
                    >
                        <h2 className="text-2xl font-semibold mb-2">
                            {product.name}
                        </h2>
                        <div className="flex justify-between items-center">
                            <Link
                                href={{
                                    pathname: `/admin/pdpapi/${encodeURIComponent(product.id)}`,
                                    query: { id: `${product.id}` },
                                }}
                            >
                                {' '}
                                Details
                            </Link>
                            <button
                                onClick={() => handleDelete(product)}
                                className="bg-red-500 text-white hover:bg-red-700 font-semibold px-4 py-2 rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;
