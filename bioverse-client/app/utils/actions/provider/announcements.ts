'use server';

import { UUID } from 'crypto';
import { createSupabaseServiceClient } from '../../clients/supabaseServerClient';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';

export type Announcement = {
    id?: string;
    roles: string[];
    updated_at?: Date;
    created_at?: Date;
    title: string;
    body: string;
    image_path?: string;
    image_url?: string;
};

export type AnnoucementReciept = {
    user_id: UUID;
    updated_at?: Date;
};

const DEFAULT_ANNOUNCEMENT_ROLES = [
    BV_AUTH_TYPE.PROVIDER,
    BV_AUTH_TYPE.LEAD_PROVIDER,
    BV_AUTH_TYPE.COORDINATOR,
    BV_AUTH_TYPE.LEAD_COORDINATOR,
    BV_AUTH_TYPE.DEVELOPER,
    BV_AUTH_TYPE.ADMIN,
];

export async function getDefaultAnnouncementRoles(): Promise<BV_AUTH_TYPE[]> {
    return DEFAULT_ANNOUNCEMENT_ROLES;
}

export async function uploadAnnouncementImage(
    formData: FormData
): Promise<string> {
    const supabase = createSupabaseServiceClient();

    const file = formData.get('file') as File;

    const uuid = crypto.randomUUID();
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuid}.${fileExt}`;
    const imagePath = `announcement-images/${fileName}`;

    let { error } = await supabase.storage
        .from('bioverse-images')
        .upload(imagePath, file);

    if (error) {
        throw error;
    }

    return imagePath;
}

export async function createAnnouncement(
    announcement: Announcement
): Promise<void> {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase.from('announcements').insert(announcement);

    if (error) {
        throw error;
    }
}

export async function getAnnouncementHistory(): Promise<Announcement[]> {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw error;
    }

    return addImageUrlsToAnnouncements(data);
}

const MS_TO_WAIT_FOR_NEW_ANNOUNCEMENTS = 100;

export async function getAnnouncementsForProvider(
    providerId: UUID,
    role: BV_AUTH_TYPE
): Promise<Announcement[]> {
    const supabase = createSupabaseServiceClient();

    const { data: receiptData, error: receiptError } = await supabase
        .from('announcement_receipts')
        .select('updated_at')
        .eq('user_id', providerId)
        .single();

    if (receiptError && receiptError.code !== 'PGRST116') {
        throw receiptError;
    }

    const lastViewedAt = receiptData?.updated_at
        ? new Date(receiptData.updated_at)
        : new Date(0);
    // const lastViewedAt = new Date(0);

    const { data: announcementsData, error: announcementsError } =
        await supabase
            .from('announcements')
            .select('*')
            .contains('roles', [role])
            .gt(
                'updated_at',
                new Date(
                    lastViewedAt.getTime() + MS_TO_WAIT_FOR_NEW_ANNOUNCEMENTS
                ).toISOString()
            );

    if (announcementsError && announcementsError.code !== 'PGRST116') {
        throw announcementsError;
    }

    return announcementsData || [];
}

export async function updateAnnouncementReceipt(
    announcementReceipt: AnnoucementReciept
): Promise<void> {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase
        .from('announcement_receipts')
        .upsert(announcementReceipt, { onConflict: 'user_id' });

    if (error) {
        throw error;
    }
}

export async function addImageUrlsToAnnouncements(
    announcements: Announcement[]
): Promise<Announcement[]> {
    const supabase = createSupabaseServiceClient();

    return announcements.map((announcement) => {
        if (!announcement.image_path) {
            return { ...announcement, image_url: '' };
        }

        const { data } = supabase.storage
            .from('bioverse-images')
            .getPublicUrl(announcement.image_path);

        const imageUrl = data?.publicUrl || '';
        return { ...announcement, image_url: imageUrl };
    });
}
