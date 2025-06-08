'use client';

import { useRouter } from 'next/navigation';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';
import {
    Box,
    CircularProgress,
    FormControl,
    TextField,
    Tabs,
    Tab,
} from '@mui/material';
import { Button } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import * as Yup from 'yup';
import useSWR from 'swr';
import {
    Announcement,
    createAnnouncement,
    getDefaultAnnouncementRoles,
    uploadAnnouncementImage,
    getAnnouncementHistory,
} from '@/app/utils/actions/provider/announcements';
import AnnouncementHistory from './announcement-history';

const validationSchema = Yup.object({
    title: Yup.string()
        .required('Title is required')
        .max(100, 'Title must be 100 characters or less'),
    body: Yup.string()
        .required('Body is required')
        .max(1000, 'Body must be 1000 characters or less'),
});

export default function AnnouncementContainer() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const { data: announcementsData, error: announcementsError } = useSWR(
        'announcements/history',
        getAnnouncementHistory
    );

    const [formData, setFormData] = useState({
        title: '',
        body: '',
        image: null,
    });
    const [errors, setErrors] = useState<{
        [key: string]: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [createAnnouncementSuccess, setCreateAnnouncementSuccess] =
        useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await validationSchema.validate(formData, { abortEarly: false });

            setIsLoading(true);

            const announcement = {
                roles: await getDefaultAnnouncementRoles(),
                title: formData.title,
                body: formData.body,
            } as Announcement;

            // Upload image if it exists.
            if (formData.image) {
                const imageUploadFormData = new FormData();
                imageUploadFormData.append('file', formData.image as File);
                const imagePath = await uploadAnnouncementImage(
                    imageUploadFormData
                );
                announcement.image_path = imagePath;
            }

            // Create announcement.
            await createAnnouncement(announcement);

            setFormData({
                title: '',
                body: '',
                image: null,
            });
            setErrors({});
            setIsLoading(false);
            setCreateAnnouncementSuccess(true);
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const newErrors: { [key: string]: string } = {};
                err.inner.forEach((error) => {
                    if (error.path) {
                        newErrors[error.path] = error.message;
                    }
                });
                setErrors(newErrors);
            } else {
                setErrors((prev) => ({
                    ...prev,
                    image: 'Error creating announcement',
                }));
            }
            setIsLoading(false);
            setCreateAnnouncementSuccess(false);
        }
    };

    const handleChange = async (e: any) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = async (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prevData) => ({ ...prevData, image: file }));
        }
    };

    const handlePreviewImageLoad = (e: any) => {
        (e.target as HTMLElement).style.display = 'block';
    };

    const imagePreviewUrl = formData.image
        ? URL.createObjectURL(formData.image)
        : null;

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const renderCreateTab = () => (
        <div className='flex flex-col w-full justify-start mt-4 mb-16 relative'>
            <BioType className='text-[#646464] itd-subtitle'>
                Create Provider Announcement
            </BioType>
            <div className='flex flex-col w-full h-[1px]'>
                <HorizontalDivider backgroundColor={'#DFDFDF'} height={1} />
            </div>

            <form onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ my: 2 }}>
                    <TextField
                        name='title'
                        label='Title'
                        variant='outlined'
                        value={formData.title}
                        onChange={handleChange}
                        inputProps={{ maxLength: 100 }}
                        helperText={
                            errors.title
                                ? errors.title
                                : 'Maximum 100 characters'
                        }
                        error={!!errors.title}
                    />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <TextField
                        name='body'
                        label='Body'
                        variant='outlined'
                        multiline
                        rows={4}
                        value={formData.body}
                        onChange={handleChange}
                        inputProps={{ maxLength: 1000 }}
                        helperText={
                            errors.body
                                ? errors.body
                                : 'Maximum 1000 characters'
                        }
                        error={!!errors.body}
                    />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <input
                        accept='image/*'
                        style={{ display: 'none' }}
                        id='image-upload'
                        type='file'
                        onChange={handleImageChange}
                    />
                    <label htmlFor='image-upload'>
                        <Button
                            variant='outlined'
                            component='span'
                            fullWidth
                            color={errors.image ? 'error' : 'primary'}
                        >
                            Upload Image
                        </Button>
                    </label>
                    {errors.image && (
                        <div
                            style={{
                                color: '#d32f2f',
                                fontSize: '0.75rem',
                                marginTop: '3px',
                                marginLeft: '14px',
                            }}
                        >
                            {errors.image}
                        </div>
                    )}
                    {imagePreviewUrl && (
                        <Image
                            src={imagePreviewUrl}
                            alt='Preview'
                            width={0}
                            height={0}
                            sizes='100%'
                            style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                                marginTop: '8px',
                                display: 'block',
                                objectFit: 'contain',
                                width: 'auto',
                                height: 'auto',
                            }}
                            onLoad={handlePreviewImageLoad}
                            unoptimized
                        />
                    )}
                </FormControl>

                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    fullWidth
                >
                    Create Announcement
                </Button>
            </form>
            <div className='h-4 flex justify-center items-center'>
                {isLoading && (
                    <Box sx={{ display: 'flex', marginTop: '48px' }}>
                        <CircularProgress size={20} />
                    </Box>
                )}
            </div>
            {createAnnouncementSuccess && (
                <BioverseSnackbarMessage
                    open={createAnnouncementSuccess}
                    setOpen={setCreateAnnouncementSuccess}
                    color={'success'}
                    message={'Announcement created successfully!'}
                />
            )}
        </div>
    );

    const renderHistoryTab = () => (
        <div className='flex flex-col w-full justify-start mt-4 mb-16 relative'>
            <BioType className='text-[#646464] itd-subtitle'>
                Announcement History
            </BioType>
            <div className='flex flex-col w-full h-[1px]'>
                <HorizontalDivider backgroundColor={'#DFDFDF'} height={1} />
            </div>
            <div className='mt-4'>
                {announcementsError ? (
                    <BioType className='text-red-500'>
                        Error loading announcements
                    </BioType>
                ) : !announcementsData ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 4,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <AnnouncementHistory announcements={announcementsData} />
                )}
            </div>
        </div>
    );

    return (
        <div className='flex flex-col items-center justify-start min-h-[500px] mx-[200px] mt-16'>
            <div className='flex flex-col items-start w-full justify-start gap-4'>
                <div
                    className='flex flex-row items-center gap-2 cursor-pointer hover:underline decoration-1'
                    onClick={() => {
                        router.push('/admin');
                    }}
                >
                    <ArrowBackOutlinedIcon sx={{ color: '#6E6E6E' }} />
                    <BioType className='itd-input text-[#6e6e6e]'>
                        Back to Admin Dashboard
                    </BioType>
                </div>
                <BioType className='itd-h1'>Announcements</BioType>
            </div>

            <Box sx={{ width: '100%', mt: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label='Create' />
                    <Tab label='History' />
                </Tabs>
            </Box>

            {activeTab === 0 && renderCreateTab()}
            {activeTab === 1 && renderHistoryTab()}
        </div>
    );
}
