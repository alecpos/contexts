'use client';

import {
    useState,
    useEffect,
    useRef,
    Fragment,
    Dispatch,
    SetStateAction,
} from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
    createUserStatusTagWAction,
    getUserStatusTags,
} from '@/app/utils/database/controller/patient-status-tags/patient-status-tags-api';
import {
    Button,
    Chip,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Dialog, Transition } from '@headlessui/react';
import { readUserSession } from '@/app/utils/actions/auth/session-reader';
import useSWR from 'swr';
import {
    AllStatusTagSelectLabel,
    StatusTag,
    StatusTagAction,
    StatusTagSelectLabel,
    StatusTagSelectLabelProvider,
    StatusTagSelectLabelRegisteredNurse,
} from '@/app/types/status-tags/status-types';
import { statusInfo } from '@/app/constants/components/status-dropdown-constants';
import { OrderType } from '@/app/types/orders/order-types';
import { createNewProviderActivityAudit } from '@/app/utils/database/controller/provider_activity_audit/provider_activity_audit-api';
import { createNewCoordinatorActivityAudit } from '@/app/utils/database/controller/coordinator_activity_audit/coordinator_activity_audit-api';
import {
    isRenewalOrder,
    updateRenewalOrderByRenewalOrderId,
} from '@/app/utils/database/controller/renewal_orders/renewal_orders';
import { updateOrder } from '@/app/utils/database/controller/orders/orders-api';
import React from 'react';
import { usePathname } from 'next/navigation';

const createOrderOptions: string[] = ['zofran', 'weight-loss capsules'];

interface StatusDropdownProps {
    patient_id: string;
    order_id: string;
    employee_type?: string;
    order_data?: DBOrderData;
    orderType?: OrderType;
    setCanProceed?: Dispatch<SetStateAction<boolean>>;
    sharedMutate?: () => void;
    onStatusTagsChange?: (tags: string[]) => void;
}

export default function StatusDropdown({
    patient_id,
    order_id,
    order_data,
    orderType,
    employee_type,
    setCanProceed,
    sharedMutate,
    onStatusTagsChange,
}: StatusDropdownProps) {
    const path = usePathname();
    //determines modal state to pick new status tag
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    //note input text
    const [noteMessage, setNoteMessage] = useState('');
    //holds chosen status tag
    const [statusTagSelected, setStatusTagSelected] = useState<string>('');
    //variable to hold fetched user status tags from swr data, only to populate if data fetch succeeds
    const [userStatusTags, setUserStatusTags] = useState<StatusTag>(
        StatusTag.None
    );
    // Add state for validation error
    const [noteError, setNoteError] = useState<boolean>(false);
    const [noteErrorMessage, setNoteErrorMessage] = useState<string>('');

    //When tagging Coordinator Create Order, there is simplified options.
    const [selectedCreateOrderOption, setSelectedCreateOrderOption] =
        useState<string>('n/a');
    //if there are variants of the product we select them here
    const [createOrderVariant, setCreateOrderVariant] = useState<string>('');

    const {
        data: statusTags,
        error: statusTagsError,
        isLoading: statusTagsLoading,
        mutate: mutateTags,
        isValidating: statusTagsValidating,
    } = useSWR(
        `${patient_id}-${order_id}-status-Tags`,
        () => getUserStatusTags(patient_id, order_id),
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            revalidateIfStale: false,
            revalidateOnMount: true,
            dedupingInterval: 60000, // Only revalidate after 1 minute
            keepPreviousData: true, // Keep showing previous data while fetching new data
            compare: (a, b) => {
                // Only update if the status tags are different
                return (
                    JSON.stringify(a?.data?.status_tag) ===
                    JSON.stringify(b?.data?.status_tag)
                );
            },
        }
    );

    //store the status tag that we're at right now, so when they mark resolved, we can have a 'previous status tag' for the metadata
    useEffect(() => {
        if (statusTags && statusTags?.data && statusTags?.data?.status_tag) {
            setUserStatusTags(statusTags.data.status_tag as StatusTag);
        }
    }, [statusTags]);

    useEffect(() => {
        if (
            statusTagSelected ===
                AllStatusTagSelectLabel.CoordinatorCreateOrder &&
            selectedCreateOrderOption !== 'n/a'
        ) {
            setNoteMessage(
                `This patient needs an order created for ${selectedCreateOrderOption} ${
                    selectedCreateOrderOption === 'zofran' &&
                    'with ' + createOrderVariant
                }`
            );
        }
    }, [statusTagSelected, selectedCreateOrderOption, createOrderVariant]);

    const statusTagsToIgnoreCharacterRequirement = [
        AllStatusTagSelectLabel.Resolved,
        AllStatusTagSelectLabel.IDDocs,
        AllStatusTagSelectLabel.ProviderAwaitingResponse,
        AllStatusTagSelectLabel.LeadProviderAwaitingResponse,
        AllStatusTagSelectLabel.Review,
        AllStatusTagSelectLabel.IDVerificationCustomerIOFollowUp,
    ];

    const handleStatusTagInsert = async (event: any) => {
        event.preventDefault();

        // Validate note length for non-Resolved tags
        if (
            !statusTagsToIgnoreCharacterRequirement.includes(
                statusTagSelected as AllStatusTagSelectLabel
            ) &&
            noteMessage.length < 40
        ) {
            setNoteError(true);
            setNoteErrorMessage('Note must be at least 40 characters long');
            return;
        }

        setNoteError(false);
        setNoteErrorMessage('');

        const author_id = (await readUserSession()).data.session?.user.id;

        // Handle provider and coordinator audits
        if (employee_type === 'provider') {
            await handleProviderAudit();
        } else if (employee_type === 'coordinator') {
            await handleCoordinatorAudit();
        }

        // Set canProceed flag for specific status tags
        if (
            setCanProceed !== undefined &&
            [
                AllStatusTagSelectLabel.Resolved,
                AllStatusTagSelectLabel.Coordinator,
                AllStatusTagSelectLabel.LeadCoordinator,
                AllStatusTagSelectLabel.LeadProvider,
                AllStatusTagSelectLabel.Engineer,
                AllStatusTagSelectLabel.ProviderAwaitingResponse,
                AllStatusTagSelectLabel.IDDocs,
                AllStatusTagSelectLabel.NE,
                AllStatusTagSelectLabel.RNAwaitingResponse,
                AllStatusTagSelectLabel.UrgentRequiresProvider,
                AllStatusTagSelectLabel.ProviderMessage,
                AllStatusTagSelectLabel.Review,
                AllStatusTagSelectLabel.FinalReview,
                AllStatusTagSelectLabel.RegisteredNurseMessage,
                AllStatusTagSelectLabel.SupplementaryVialRequest,
                AllStatusTagSelectLabel.CustomDosageRequest,
            ].includes(statusTagSelected as AllStatusTagSelectLabel)
        ) {
            if (onStatusTagsChange) {
                onStatusTagsChange([statusTagSelected]);
            }
            setCanProceed(true);
        }

        // Map of status tags that require special handling
        const specialStatusTags: Record<string, StatusTag> = {
            [AllStatusTagSelectLabel.FollowUp]: StatusTag.FollowUp,
            [AllStatusTagSelectLabel.CustomerIOFollowUp]:
                StatusTag.CustomerIOFollowUp,
            [AllStatusTagSelectLabel.IDVerificationCustomerIOFollowUp]:
                StatusTag.IDVerificationCustomerIOFollowUp,
            [AllStatusTagSelectLabel.CoordinatorAwaitingResponse]:
                StatusTag.CoordinatorAwaitingResponse,
            [AllStatusTagSelectLabel.ProviderAwaitingResponse]:
                StatusTag.ProviderAwaitingResponse,
            [AllStatusTagSelectLabel.LeadProviderAwaitingResponse]:
                StatusTag.LeadProviderAwaitingResponse,
            [AllStatusTagSelectLabel.RegisteredNurseMessage]:
                StatusTag.RegisteredNurseMessage,
            [AllStatusTagSelectLabel.ProviderMessage]:
                StatusTag.ProviderMessage,
            [AllStatusTagSelectLabel.LeadProvider]: StatusTag.LeadProvider,
            [AllStatusTagSelectLabel.CoordinatorCreateOrder]:
                StatusTag.CoordinatorCreateOrder,
            [AllStatusTagSelectLabel.Review]: StatusTag.Review,
            [AllStatusTagSelectLabel.Overdue]: StatusTag.Overdue,
            [AllStatusTagSelectLabel.NE]: StatusTag.NE,
            [AllStatusTagSelectLabel.Resolved]: StatusTag.Resolved,
            [AllStatusTagSelectLabel.FinalReview]: StatusTag.FinalReview,
            [AllStatusTagSelectLabel.Engineer]: StatusTag.Engineer,
            [AllStatusTagSelectLabel.RNAwaitingResponse]:
                StatusTag.RNAwaitingResponse,
            [AllStatusTagSelectLabel.UrgentRequiresProvider]:
                StatusTag.UrgentRequiresProvider,
            [AllStatusTagSelectLabel.CustomDosageRequest]:
                StatusTag.CustomDosageRequest,
            [AllStatusTagSelectLabel.SupplementaryVialRequest]:
                StatusTag.SupplementaryVialRequest,
        };

        // Check if the selected status tag is in our special handling map
        if (statusTagSelected in specialStatusTags) {
            const statusTag = specialStatusTags[statusTagSelected];

            // Special case for LeadProvider that requires additional order updates
            if (statusTagSelected === AllStatusTagSelectLabel.LeadProvider) {
                await createUserStatusTagWAction(
                    statusTag,
                    order_id,
                    StatusTagAction.REPLACE,
                    patient_id,
                    noteMessage,
                    author_id!,
                    [statusTag]
                );

                const isRenewal = await isRenewalOrder(order_id, '');

                if (isRenewal) {
                    updateRenewalOrderByRenewalOrderId(order_id, {
                        assigned_provider:
                            '24138d35-e26f-4113-bcd9-7f275c4f9a47',
                    });
                } else {
                    updateOrder(Number(order_id), {
                        assigned_provider:
                            '24138d35-e26f-4113-bcd9-7f275c4f9a47',
                    });
                }
            }
            // Special case for CoordinatorCreateOrder that requires a different action
            else if (
                statusTagSelected ===
                AllStatusTagSelectLabel.CoordinatorCreateOrder
            ) {
                await createUserStatusTagWAction(
                    statusTag,
                    order_id,
                    StatusTagAction.REPLACE,
                    patient_id,
                    noteMessage,
                    author_id!,
                    [statusTag],
                    false
                );
            }
            // Default case for all other special status tags
            else {
                await createUserStatusTagWAction(
                    statusTag,
                    order_id,
                    StatusTagAction.REPLACE,
                    patient_id,
                    noteMessage,
                    author_id!,
                    [statusTag]
                );
            }

            // Reset form and refresh data
            setStatusTagSelected('');
            setNoteMessage('');
            setIsModalOpen(false);
            if (sharedMutate) {
                sharedMutate();
            } else {
                mutateTags();
            }
            return;
        }

        // Handle default case for non-special status tags
        const value = statusTagSelected;

        // Check if the status tag already exists
        if (userStatusTags.includes(value)) {
            return;
        }

        // Determine which status tags to replace
        // const replaceTags = [
        //     StatusTag.LeadProvider,
        //     StatusTag.Review,
        //     StatusTag.Overdue,
        //     StatusTag.ProviderAwaitingResponse,
        //     StatusTag.RegisteredNurseMessage,
        //     StatusTag.ProviderMessage,
        //     StatusTag.CoordinatorAwaitingResponse,
        //     StatusTag.CoordinatorCreateOrder,
        //     StatusTag.ReadPatientMessage,
        //     StatusTag.CustomerIOFollowUp,
        //     StatusTag.NE,
        //     StatusTag.Resolved,
        //     StatusTag.Engineer,
        //     StatusTag.FinalReview,
        //     StatusTag.ReviewNoPrescribe,
        //     StatusTag.OverdueNoPrescribe,
        //     StatusTag.RNAwaitingResponse,
        //     StatusTag.None,
        // ];

        // Create the status tag
        await createUserStatusTagWAction(
            value,
            order_id,
            StatusTagAction.INSERT,
            patient_id,
            noteMessage,
            author_id!,
            [value]
        );

        if (statusTagsError) {
            console.error('Status tag post error details: ', statusTagsError);
        }

        // Reset form and refresh data
        setStatusTagSelected('');
        setNoteMessage('');
        setIsModalOpen(false);
        if (sharedMutate) {
            sharedMutate();
        } else {
            mutateTags();
        }
    };

    const handleProviderAudit = async () => {
        const time = new Date().getTime();

        const new_audit: ProviderActivityAuditCreateObject = {
            provider_id: (await readUserSession()).data.session?.user.id!,
            action: 'tag_intake',
            timestamp: time,
            metadata: {
                previous_status_tag: userStatusTags,
                new_status_tag: statusTagSelected,
                note: noteMessage,
            },
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
            ...(orderType === OrderType.RenewalOrder
                ? {
                      renewal_order_id: order_data!.renewal_order_id,
                      order_id: order_data!.original_order_id!,
                  }
                : { order_id: order_data!.id }),
        };

        await createNewProviderActivityAudit(new_audit);
    };

    const handleCoordinatorAudit = async () => {
        const time = new Date().getTime(); // Record start time

        const new_audit: CoordinatorActivityAuditCreateObject = {
            coordinator_id: (await readUserSession()).data.session?.user.id!,
            action: 'tag_order',
            timestamp: time,
            metadata: {
                previous_status_tag: userStatusTags,
                new_status_tag: statusTagSelected,
                note: noteMessage,
            },
            environment: process.env.NEXT_PUBLIC_ENVIRONMENT!,
            ...(orderType === OrderType.RenewalOrder
                ? {
                      renewal_order_id: order_data!.renewal_order_id,
                      order_id: order_data!.original_order_id!,
                  }
                : { order_id: order_data!.id }),
        };

        await createNewCoordinatorActivityAudit(new_audit);
    };

    let statuses: string[];

    switch (employee_type) {
        case 'provider':
        case 'lead-provider':
            statuses = Object.values(StatusTagSelectLabelProvider);
            break;
        case 'registered-nurse':
            statuses = Object.values(StatusTagSelectLabelRegisteredNurse);
            break;
        default:
            statuses = Object.values(StatusTagSelectLabel);
    }

    let selectRef = useRef(null);

    /**
     * 12/4/24
     * @returns true if the Registered Nurse option SHOULD appear
     */
    const shouldShowRNOption = () => {
        if (!order_data) {
            return false;
        }

        if (
            [   
                "WI",
                "AK",
                "CA",
                "CT",
                "HI",
                "IL",
                "MA",
                "MI",
                "MN",
                "NV",
                "NY",
                "OR",
                "FL",
                "TX",
                "NC",
                "OH",
                "IN",
                "VA",
                "WA",
                "CO",
                "NJ",
                "PA"
            ].includes(
                order_data.state
            )
        ) {
            return true;
        }
        return false;
    };

    console.log('statusTags', statusTags);

    return (
        <div className=''>
            <div className='flex gap-1'>
                {!statusTags?.data?.status_tag && (
                    <Chip
                        clickable
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                        label={
                            <BioType className='inter-basic text-[14px]'>
                                {statusTagsLoading || statusTagsValidating
                                    ? 'Loading...'
                                    : 'Tag a status'}
                            </BioType>
                        }
                        color='primary'
                        variant='outlined'
                        sx={{
                            borderRadius: '6px',
                        }}
                    />
                )}
                {statusTags &&
                    statusTags.data &&
                    statusTags.data.status_tag && (
                        <Chip
                            clickable
                            onClick={() => {
                                setIsModalOpen(true);
                            }}
                            label={
                                <div className='flex flex-row gap-1 items-center'>
                                    <BioType className='inter-basic text-[14px]'>
                                        {
                                            statusInfo[
                                                statusTags.data.status_tag ??
                                                    StatusTag.None
                                            ]?.text
                                        }{' '}
                                    </BioType>
                                    <EditOutlinedIcon
                                        sx={{ fontSize: '24px' }}
                                    />
                                </div>
                            }
                            color='primary'
                            variant='outlined'
                            sx={{
                                borderColor:
                                    statusInfo[statusTags.data.status_tag]
                                        ?.color,
                                color: statusInfo[statusTags.data.status_tag]
                                    ?.color,
                                '& .MuiChip-deleteIcon': {
                                    color: statusInfo[
                                        statusTags.data.status_tag
                                    ]?.color,
                                },
                                borderRadius: '6px',
                            }}
                        />
                    )}
            </div>

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog
                    as='div'
                    className='relative z-10'
                    onClose={() => setIsModalOpen(false)}
                    initialFocus={selectRef}
                >
                    <Transition.Child
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in duration-200'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <div className='fixed inset-0 bg-black/25' />
                    </Transition.Child>

                    <div className='fixed inset-0 overflow-y-auto'>
                        <div className='flex min-h-screen items-center justify-center p-4 text-center'>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-300'
                                enterFrom='opacity-0 scale-95'
                                enterTo='opacity-100 scale-100'
                                leave='ease-in duration-200'
                                leaveFrom='opacity-100 scale-100'
                                leaveTo='opacity-0 scale-95'
                            >
                                <Dialog.Panel className='w-[456px] h-auto min-h-[325px] rounded-md bg-white p-4 shadow-xl transition-all flex flex-col justify-center items-center gap-4'>
                                    <BioType className='inter text-left self-start px-4 text-[22px]'>
                                        Tag details
                                    </BioType>
                                    <form
                                        onSubmit={handleStatusTagInsert}
                                        className='flex flex-col gap-6'
                                    >
                                        <Select
                                            displayEmpty
                                            value={statusTagSelected}
                                            onChange={(e) => {
                                                setStatusTagSelected(
                                                    e.target.value
                                                );
                                            }}
                                            input={<OutlinedInput />}
                                            ref={selectRef}
                                            inputProps={{
                                                'aria-label': 'Without label',
                                            }}
                                            color='secondary'
                                            sx={{
                                                '& .MuiSelect-select': {
                                                    backgroundColor: '#FBFAFC',
                                                    textAlign: 'left',
                                                    paddingLeft: '16px',
                                                    fontFamily:
                                                        'Inter, sans-serif',
                                                },
                                                borderRadius: '12px',
                                                '& .MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderRadius: '12px',
                                                    },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor: '#191919',
                                                    },
                                            }}
                                        >
                                            {statuses.map((status) => {
                                                if (
                                                    status ==
                                                        'Lead Provider - Awaiting Response' &&
                                                    employee_type !=
                                                        'lead-provider'
                                                ) {
                                                    return null;
                                                }

                                                // status tags that should not be shown to providers while they are working through their tasks
                                                if (
                                                    path.includes('provider/intakes/') ||
                                                    path.includes('provider/tasks/') 
                                                ) {
                                                    if (
                                                        [
                                                            StatusTagSelectLabelProvider.CoordinatorCreateOrder,
                                                            StatusTagSelectLabelProvider.LeadProviderAwaitingResponse,
                                                            StatusTagSelectLabelProvider.FinalReview,
                                                            StatusTagSelectLabelProvider.SupplementaryVialRequest,
                                                            StatusTagSelectLabelProvider.CustomDosageRequest,
                                                        ].includes(
                                                            status as StatusTagSelectLabelProvider
                                                        )
                                                    ) {
                                                        return null;
                                                    }
                                                }

                                                return (
                                                    <MenuItem
                                                        key={status}
                                                        value={status}
                                                        disabled={
                                                            status ==
                                                                'Registered Nurse - Message Patient' &&
                                                            !shouldShowRNOption()
                                                        }
                                                    >
                                                        {status}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                        {statusTagSelected !==
                                        AllStatusTagSelectLabel.CoordinatorCreateOrder ? (
                                            <div className='flex flex-col'>
                                                <TextField
                                                    multiline
                                                    minRows={2}
                                                    placeholder='Note'
                                                    sx={{
                                                        width: '366px',
                                                        '& .MuiOutlinedInput-root':
                                                            {
                                                                backgroundColor:
                                                                    '#FBFAFC',
                                                                textAlign:
                                                                    'left',
                                                                paddingLeft:
                                                                    '16px',
                                                                borderRadius:
                                                                    '12px',
                                                                fontFamily:
                                                                    'Inter, sans-serif',
                                                                '&.MuiOutlinedInput-notchedOutline':
                                                                    {
                                                                        borderColor:
                                                                            '#000000',
                                                                        borderWidth:
                                                                            '2px',
                                                                    },
                                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                                    {
                                                                        borderColor:
                                                                            '#191919',
                                                                    },
                                                            },
                                                    }}
                                                    value={noteMessage}
                                                    onChange={(e) => {
                                                        setNoteMessage(
                                                            e.target.value
                                                        );
                                                        // Clear error when user types
                                                        if (noteError) {
                                                            setNoteError(false);
                                                            setNoteErrorMessage(
                                                                ''
                                                            );
                                                        }
                                                    }}
                                                    error={noteError}
                                                    helperText={
                                                        noteErrorMessage
                                                    }
                                                    required={
                                                        statusTagSelected !==
                                                        AllStatusTagSelectLabel.Resolved
                                                    }
                                                />
                                                {!statusTagsToIgnoreCharacterRequirement.includes(
                                                    statusTagSelected as AllStatusTagSelectLabel
                                                ) && (
                                                    <div className='flex justify-end mt-1'>
                                                        <BioType
                                                            className={`inter text-[12px] ${
                                                                noteMessage.length <
                                                                40
                                                                    ? 'text-gray-500'
                                                                    : 'text-green-500'
                                                            }`}
                                                        >
                                                            {noteMessage.length}
                                                            /40 characters
                                                        </BioType>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <Select
                                                    value={
                                                        selectedCreateOrderOption
                                                    }
                                                    onChange={(e) => {
                                                        setSelectedCreateOrderOption(
                                                            e.target.value
                                                        );
                                                    }}
                                                    input={<OutlinedInput />}
                                                    inputProps={{
                                                        'aria-label':
                                                            'Without label',
                                                    }}
                                                >
                                                    <MenuItem
                                                        value={'n/a'}
                                                        disabled
                                                    >
                                                        Please Select
                                                    </MenuItem>
                                                    {createOrderOptions.map(
                                                        (option) => {
                                                            return (
                                                                <MenuItem
                                                                    key={option}
                                                                    value={
                                                                        option
                                                                    }
                                                                >
                                                                    {option}
                                                                </MenuItem>
                                                            );
                                                        }
                                                    )}
                                                </Select>
                                                {selectedCreateOrderOption ===
                                                    'zofran' && (
                                                    <>
                                                        <ToggleButtonGroup
                                                            exclusive
                                                            fullWidth
                                                            value={
                                                                createOrderVariant
                                                            }
                                                            onChange={(
                                                                event,
                                                                newVal
                                                            ) => {
                                                                setCreateOrderVariant(
                                                                    newVal
                                                                );
                                                            }}
                                                        >
                                                            <ToggleButton
                                                                value={
                                                                    '10 pills'
                                                                }
                                                            >
                                                                10 pills
                                                            </ToggleButton>
                                                            <ToggleButton
                                                                value={
                                                                    '20 pills'
                                                                }
                                                            >
                                                                20 pills
                                                            </ToggleButton>
                                                        </ToggleButtonGroup>
                                                    </>
                                                )}
                                            </>
                                        )}
                                        <div className='flex justify-center gap-4'>
                                            <Button
                                                onClick={() =>
                                                    setIsModalOpen(false)
                                                }
                                                color='error'
                                                sx={{
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    padding: '12px 32px',
                                                }}
                                            >
                                                <BioType className='inter text-[#666666]'>
                                                    Cancel
                                                </BioType>
                                            </Button>
                                            <Button
                                                type='submit'
                                                variant='contained'
                                                sx={{
                                                    backgroundColor: '#000000',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#666666',
                                                    },
                                                    borderRadius: '12px',
                                                    textTransform: 'none',
                                                    padding: '12px 32px',
                                                }}
                                                disabled={
                                                    statusTagSelected ===
                                                        AllStatusTagSelectLabel.CoordinatorCreateOrder &&
                                                    selectedCreateOrderOption ===
                                                        'n/a'
                                                }
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
