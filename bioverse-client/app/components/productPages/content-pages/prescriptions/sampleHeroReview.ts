interface Props {
    rating: number;
    description: string;
    imageRef: string;
    customerName: string;
}

const mockReviewData: Props = {
    rating: 4.5,
    description:
        '“THIS. IS. LIQUID. GOLD. It’s been a transformative addition to my wellness routine, providing a noticeable boost in my energy, focus, and overall vitality.”',
    imageRef: '/img/product-images/prescriptions/nad-injection1.png',
    customerName: 'BIOVERSE Customer',
};

export default mockReviewData;
