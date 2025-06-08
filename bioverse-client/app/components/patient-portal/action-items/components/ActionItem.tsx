import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { ItemConfig } from '@/app/types/action-items/action-items-types';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Link from 'next/link';
import ActionItemFactory from '../utils/ActionItemFactory';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface ActionItemProps {
    type: string;
    product_href: string;
}

export default function ActionItem({ type, product_href }: ActionItemProps) {
    const itemConfig: Record<string, ItemConfig> = {
        checkup: {
            title: 'Complete your weight loss check-in.',
            description:
                'Track your progress and adjust your weight loss medication.',
            button: {
                text: 'Complete check-in',
                href: `/check-up/${type}`,
            },
        },
        injection: {
            title: 'Complete your weight loss check-in.',
            description:
                'Track your progress and adjust your weight loss medication.',
            button: {
                text: 'Complete check-in',
                href: `/check-up/${type}`,
            },
        },
        dosage_selection: {
            title: 'Confirm your preferred dosing protocol',
            description:
                'Your provider is giving you two treatment options for your next shipment. Confirm your preferred option today.',
            button: {
                text: 'Complete dosage selection',
                href: `/dosage-selection/${product_href}`,
            },
        },
        id_verification: {
            title: 'Complete your ID verification.',
            description:
                'A provider can not review your responses or create treatment plan until you have verified your identity, as required by telehealth laws.',
            button: {
                text: 'COMPLETE YOUR ID VERIFICATION',
                href: `/portal/account-information/id-verification`,
            },
        },
    };

    const ActionItemInstance = new ActionItemFactory(type);
    const actionItemType = ActionItemInstance.getType();
    const content = itemConfig[actionItemType as keyof typeof itemConfig];

    console.log('AI:', type, ActionItemInstance, actionItemType, content);

    return (
        <div className='mx-auto bg-[#FFF4E5] flex flex-col space-y-4 py-[17px] px-4 rounded-[4px]'>
            <div className='flex space-x-4 items-start'>
                <WarningAmberIcon sx={{ color: '#EF6C00', fontSize: 22 }} />
                <div className='w-full flex flex-col space-y-2'>
                    <BioType className='body1bold text-[#663C00] text-[16px]'>
                        {content.title}
                    </BioType>
                    <BioType className='body1 text-[#663C00] text-[16px]'>
                        {content.description}
                    </BioType>
                </div>
            </div>
            <Link className='decoration-[#663C00]' href={content.button.href}>
                <BioType className='body1 text-[#663C00] text-[13px] text-center'>
                    {content.button.text}
                </BioType>
            </Link>
        </div>
    );
}
