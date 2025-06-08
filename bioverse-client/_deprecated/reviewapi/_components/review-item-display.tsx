'use client';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Dispatch, SetStateAction, useState } from 'react';
import TextField from '@mui/material/TextField';

interface Props {
    review: ReviewApiJSON;
    index: number;
    setEditsMade: Dispatch<SetStateAction<boolean>>;
    setUpdates: Dispatch<
        SetStateAction<{
            name: any;
            customer_reviews: ReviewApiJSON[];
        }>
    >;
}

export default function ReviewItem({
    review,
    index,
    setEditsMade,
    setUpdates,
}: Props) {
    const [editing, setEditing] = useState(false);
    const [customerName, setCustomerName] = useState(review.customer_name);
    const [customerReview, setCustomerReview] = useState(
        review.customer_review,
    );
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSetEditing = () => {
        setEditing(!editing);
    };

    // Function to handle saving changes
    const handleSaveChanges = () => {
        setUpdates((prev) => {
            return {
                ...prev,
                customer_reviews: prev.customer_reviews.map((review, i) => {
                    if (i === index) {
                        return {
                            customer_name: customerName,
                            customer_review: customerReview,
                        };
                    } else {
                        return review;
                    }
                }),
            };
        });
        setEditsMade(true);
        setEditing(false);
    };

    const handleDeleteReview = () => {
        // Your existing logic to delete the review
        setUpdates((prev) => ({
            ...prev,
            customer_reviews: prev.customer_reviews.filter(
                (_, i) => i !== index,
            ),
        }));
        setEditsMade(true);
        closeConfirmDeleteDialog(); // Close the dialog after deletion
    };

    const openConfirmDeleteDialog = () => {
        setDialogOpen(true);
    };

    const closeConfirmDeleteDialog = () => {
        setDialogOpen(false);
    };

    // Event handlers for TextField changes
    const handleCustomerNameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setCustomerName(event.target.value);
    };

    const handleCustomerReviewChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setCustomerReview(event.target.value);
    };

    return (
        <>
            <Paper className="p-2">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row justify-between">
                        {editing ? (
                            <div className="flex flex-col body1 gap-2">
                                <div className="body1bold">Customer Name: </div>

                                <TextField
                                    defaultValue={review.customer_name}
                                    onChange={handleCustomerNameChange}
                                    variant="outlined"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col body1 gap-2">
                                <div className="body1bold">Customer Name: </div>
                                <div>{review.customer_name}</div>
                            </div>
                        )}
                        <div id="icon buttons" className="gap-2">
                            {editing ? (
                                <div className="flex flex-row">
                                    <Button
                                        color="success"
                                        onClick={handleSaveChanges}
                                    >
                                        SAVE
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={handleSetEditing}
                                    >
                                        CANCEL
                                    </Button>
                                </div>
                            ) : (
                                <IconButton
                                    color="primary"
                                    onClick={handleSetEditing}
                                >
                                    <EditIcon />
                                </IconButton>
                            )}
                            {editing ? (
                                <></>
                            ) : (
                                <IconButton
                                    color="error"
                                    onClick={openConfirmDeleteDialog}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-row">
                        {editing ? (
                            <div className="flex flex-col body1 gap-2 w-full">
                                <div className="body1bold">Review:</div>
                                <TextField
                                    defaultValue={review.customer_review}
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    onChange={handleCustomerReviewChange}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col body1 gap-2 w-full">
                                <div className="body1bold">Review:</div>
                                <div>{review.customer_review}</div>
                            </div>
                        )}
                    </div>
                </div>
            </Paper>
            <Dialog
                open={dialogOpen}
                onClose={closeConfirmDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'Confirm Deletion'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this review?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirmDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteReview}
                        color="error"
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
