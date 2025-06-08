'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import PreviewCard from './preview-card/preview-card';
import { Avatar, ButtonBase } from '@mui/material';
import {
    ThreadAndPreviewMessage,
    PreviewCardThreadData,
} from '@/app/types/messages/messages-types';
import QuickSupport from './quickSupport';

interface PreviewListContainerProps {
    thread_preview_data: ThreadAndPreviewMessage[];
    setThreadToView: (thread_id: string) => void;
}

export default function PreviewListContainer({
    thread_preview_data,
    setThreadToView,
}: PreviewListContainerProps) {
    return (
        <div className='flex flex-col p-4'>
            <div className='flex mt-4 flex-col sm:mt-12 w-full md:max-w-[600px] md:px-1 mx-auto'>
                <BioType className=' text-[rgba(0, 0, 0, 0.9)] itd-h1-inter text-[24px]'>
                    Messages
                </BioType>
                <BioType className='itd-subtitle-inter md:itd-subtitle-inter mt-2 text-[20px] md:text-[18px]'>
                    Chat with a provider
                </BioType>
                <BioType className='itd-body-inter md:itd-body-inter mt-2 text-weak text-[18px]'>
                    Message your provider and care team with questions about
                    your treatment.
                </BioType>
            </div>

            <div className='flex flex-col mt-4 w-full gap-3 max-w-[600px] mx-auto md:px-4'>
                {thread_preview_data.map((thread, index, array) => {
                    let initial_thread_data: PreviewCardThreadData;
                    if (!thread.message_preview) {
                        initial_thread_data = {
                            thread_id: thread.id as number,
                            first_name: '',
                            last_name: '',
                            avatar: <Avatar></Avatar>,
                            message: {
                                message_id_: 0,
                                created_at: new Date(),
                                sender_id: '',
                                content: '',
                                last_read_at: new Date(),
                            },
                            product_name: thread.product_data?.name,
                        };
                    } else {
                        initial_thread_data = {
                            thread_id: thread.id as number,
                            first_name:
                                thread.message_preview.sender.first_name,
                            last_name: thread.message_preview.sender.last_name,
                            avatar: thread.message_preview.sender.provider_data
                                ?.profile_picture_url ? (
                                <Avatar
                                    className='h-8 w-8= text-base'
                                    alt={
                                        thread.message_preview.sender.first_name.charAt(
                                            0
                                        ) +
                                        thread.message_preview.sender.last_name.charAt(
                                            0
                                        )
                                    }
                                    src={
                                        thread.message_preview.sender
                                            .provider_data?.profile_picture_url
                                    }
                                />
                            ) : (
                                <Avatar className='h-8 w-8 text-base'>
                                    {thread.message_preview.sender.first_name.charAt(
                                        0
                                    ) +
                                        thread.message_preview.sender.last_name.charAt(
                                            0
                                        )}
                                </Avatar>
                            ),
                            message: {
                                message_id_: 0,
                                created_at: new Date(
                                    thread.message_preview.created_at
                                ),
                                sender_id: thread.message_preview.sender_id,
                                content: thread.message_preview.content,
                                last_read_at: new Date(),
                            },
                            product_name: thread.product_data?.name,
                        };
                    }

                    return (
                        <ButtonBase
                            key={index}
                            onClick={() => {
                                /**
                                 * @author Nathan Cho
                                 * I put a time out to implement button base so I can add the ripple effect.
                                 * However I needed to add the timeout because the state change happened faster than the animation playing.
                                 */
                                setTimeout(() => {
                                    setThreadToView(thread.id as string);
                                }, 200); // Delay in milliseconds
                            }}
                        >
                            <div className='flex cursor-pointer w-full'>
                                <PreviewCard
                                    initial_thread_data={initial_thread_data}
                                />
                            </div>
                        </ButtonBase>
                    );
                })}
            </div>

            <div className='max-w-[600px] mx-auto'>
                <QuickSupport />
            </div>
        </div>
    );
}
