'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    CardHeader,
} from '@mui/material';
import { useRouter } from 'next/navigation';

enum ProductType {
    Prescription = 'prescription',
    Supplement = 'supplement',
    Consultation = 'consultation',
    Test = 'test',
    Callout = 'callout',
}

interface Props {
    name: string;
    type:
        | 'prescriptions'
        | 'supplements'
        | 'consultation'
        | 'test-kits'
        | 'callout';
    price: number;
    description: string;
    imageUrl: string;
    href: string;
}

/**
 *
 * DISCOUNT: the decimal multiplier for how much discount. (12% discount will be 0.78)
 */
const discount = 0.7;

/**
 *
 * @props ProductCardProps
 * TODO: Map Assistive Chips to chip label array
 * Connect ImageRef to Supabase
 *
 * @returns
 */
export default function ProductCard({
    name,
    type,
    price,
    description,
    imageUrl,
    href,
}: Props) {
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`${type}/${href}`);
    };

    const limitTextTo100Words = (text: string) => {
        const words = text.split(' ');
        if (words.length <= 80) {
            return text;
        } else {
            const limitedWords = words.slice(0, 80);
            return limitedWords.join(' ') + '...';
        }
    };

    return (
        <>
            <Card
                style={{ backgroundColor: '#F6F9FB' }}
                className='flex flex-col w-[100%] md:mb-6 md:w-[31%] md:aspect-[22:41]'
            >
                <CardActionArea
                    onClick={handleCardClick}
                    className='flex flex-col'
                >
                    <CardContent
                        className='flex-shrink-0'
                        style={{ overflow: 'hidden' }}
                    >
                        <BioType className='body1bold'>
                            {name.toUpperCase()}
                        </BioType>
                    </CardContent>

                    {/* This CardMedia is the image */}
                    <CardMedia
                        component='img'
                        image={imageUrl}
                        alt='product-image'
                        style={{ maxHeight: 264, width: '100%' }}
                    />

                    {/* This CardContent will grow to fill the available space */}
                    <CardContent
                        className='flex-grow'
                        style={{ overflow: 'hidden' }}
                    >
                        <BioType className='body2'>
                            {limitTextTo100Words(description)}
                        </BioType>
                    </CardContent>
                </CardActionArea>

                <CardActions className='mt-auto self-center justify-center'>
                    {price && (
                        <Button variant='contained' onClick={handleCardClick}>
                            {type == 'prescriptions'
                                ? `Starting at $${price.toFixed(2)}`
                                : `Add to Cart`}
                        </Button>
                    )}
                </CardActions>
            </Card>
        </>
    );
}
