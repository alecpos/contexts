'use client';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Button,
    IconButton,
    Paper,
    Snackbar,
    SnackbarContent,
} from '@mui/material';
import { useState } from 'react';
import ReviewItem from './review-item-display';
import { updateReviewDataForProductHref } from '../util/reviewapi-supabase';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    reviewData: {
        name: any;
        customer_reviews: ReviewApiJSON[];
    };
    href: string;
}

export default function ReviewPIMainContainer({ reviewData, href }: Props) {
    //tracks whether an edit was made so we can alert user before they leave the page their changes may not be saved.
    const [editsMade, setEditsMade] = useState<boolean>(false);
    const [successMessage, setSuccessMessageOpen] = useState(false);

    const [reviewFormData, setReviewFormData] = useState(reviewData);

    const updateDatabase = async () => {
        console.log('to update', reviewFormData.customer_reviews);
        const resultText = await updateReviewDataForProductHref(
            href,
            reviewFormData.customer_reviews
        );
        if (resultText === 'OK') {
            setSuccessMessageOpen(true);
        }
        setEditsMade(false);
    };

    const addNewReview = () => {
        setReviewFormData((prevState) => ({
            ...prevState,
            customer_reviews: [
                ...prevState.customer_reviews,
                {
                    customer_name: 'Enter Customer name here',
                    customer_review: 'Enter review details here.',
                },
            ],
        }));
        setEditsMade(true);
    };

    const handleSuccessMessageClose = () => {
        setSuccessMessageOpen(false);
    };

    return (
        <>
            <Paper className='p-4 flex flex-col w-full'>
                <div className='flex flex-col gap-6'>
                    <div className='w-full'>
                        <BioType className='h5'>
                            {reviewFormData.name} Reviews:
                        </BioType>
                    </div>

                    {editsMade && (
                        <div className='flex flex-row gap-6'>
                            <BioType className='text-red-400 h6'>
                                You have unsaved Edits!
                            </BioType>
                            <Button
                                onClick={updateDatabase}
                                color='secondary'
                                variant='contained'
                            >
                                Update Database
                            </Button>
                        </div>
                    )}

                    <div>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={addNewReview}
                        >
                            Add a new review
                        </Button>
                    </div>

                    <div className='flex flex-col gap-4'>
                        {reviewFormData.customer_reviews.map(
                            (review: any, index: number) => (
                                <div key={index} className='flex flex-col'>
                                    <ReviewItem
                                        review={review}
                                        index={index}
                                        setEditsMade={setEditsMade}
                                        setUpdates={setReviewFormData}
                                    />
                                </div>
                            )
                        )}
                    </div>
                </div>
            </Paper>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={successMessage}
                autoHideDuration={6000}
                onClose={handleSuccessMessageClose}
                color='success'
            >
                <SnackbarContent
                    message='Update was successful! Thank you for using the API. You are a beautiful and wonderful person!'
                    action={
                        <IconButton
                            size='small'
                            aria-label='close'
                            color='error'
                            onClick={handleSuccessMessageClose}
                        >
                            <CloseIcon fontSize='small' />
                        </IconButton>
                    }
                />
            </Snackbar>
        </>
    );
}
