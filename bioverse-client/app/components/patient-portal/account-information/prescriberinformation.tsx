import { Paper } from '@mui/material';
import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '../../global-components/dividers/horizontalDivider/horizontalDivider';
import {
    prescriberInformationDrE,
    prescriberInformationMaylin,
} from '@/public/static-ts/members-portal/prescriber-information';
import Image from 'next/image';

interface Props {}

export default function PrescriberInformationDisplay({}: Props) {
    const prescriber_information_container_class =
        'flex flex-col gap-4 mx-4 md:ml-1 md:w-[40%]';
    const prescriber_text_data_container_class = 'flex flex-col p-4 gap-2';
    const horizontal_divider_container_class = 'h-[1px] py-2';

    return (
        <>
            <Paper
                id='prescriber-information-container'
                className={prescriber_information_container_class}
            >
                <div
                    id='prescriber-text-data-container'
                    className={prescriber_text_data_container_class}
                >
                    <BioType className='body1bold'>
                        Prescriber Information
                    </BioType>

                    <div className={horizontal_divider_container_class}>
                        <HorizontalDivider
                            backgroundColor='#e3e3e3'
                            height={1}
                        />
                    </div>

                    <div className='flex flex-row'>
                        <div className='w-[104px] h-[104px] relative'>
                            <Image
                                fill
                                src={
                                    '/img/patient-portal/provider-information-image.png'
                                }
                                alt={'practitioner-image'}
                                unoptimized
                            />
                        </div>
                        <div className='flex flex-col ml-4 justify-center'>
                            <BioType className='body1bold'>
                                {prescriberInformationMaylin.prescriberName}
                            </BioType>
                            <BioType className='body1'>
                                {prescriberInformationMaylin.prescriberRole}
                            </BioType>
                        </div>
                    </div>

                    <BioType className='body1'>
                        {prescriberInformationMaylin.informationText}
                    </BioType>
                </div>
            </Paper>
        </>
    );
}
