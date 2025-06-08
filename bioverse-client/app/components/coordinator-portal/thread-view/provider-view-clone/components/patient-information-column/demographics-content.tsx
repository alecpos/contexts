'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Tooltip } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

interface DemographicsProps {
    patient_data: DBPatientData;
}

export default function DemographicsAccordionContent({
    patient_data,
}: DemographicsProps) {
    const convertDOB = (dob: string) => {
        const date = new Date(dob);
        const formattedDate = `${
            date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`;
        return formattedDate;
    };

    const convertPatientSince = (date: string) => {
        const dateObj = new Date(date);
        const formattedDate = `${
            dateObj.getMonth() + 1
        }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
        return formattedDate;
    };

    return (
        <div className='flex flex-col gap-4 px-2'>
            <div className='flex flex-row gap-10'>
                <div className='flex flex-col gap-4 w-1/2'>
                    <div>
                        <BioType className='font-inter text-[14px] text-gray-400 itd-input'>
                            Patient Name
                        </BioType>
                        <BioType className='font-inter text-[14px] text-black   itd-body'>
                            {patient_data.last_name}, {patient_data.first_name}
                        </BioType>
                    </div>
                    <div>
                        <BioType className='font-inter text-[14px]  itd-input'>
                            DOB
                        </BioType>
                        <BioType className='font-inter text-[14px] text-black  itd-body'>
                            {convertDOB(patient_data.date_of_birth)}
                        </BioType>
                    </div>
                    <div className='flex flex-col'>
                        <BioType className='font-inter text-[14px] text-gray-400 itd-input'>
                            Email Address
                        </BioType>
                        <BioType className='font-inter text-[14px] text-black  itd-body'>
                            {patient_data.email}
                        </BioType>
                    </div>
                    <div className='flex flex-col'>
                        <BioType className='font-inter text-[14px] text-gray-400 itd-input'>
                            Cell phone number
                        </BioType>
                        <BioType className='font-inter text-[14px] text-black  itd-body flex items-center'>
                            {patient_data.phone_number}
                            <Tooltip
                                title={<>Call patient</>}
                                placement='right'
                            >
                                <a
                                    href={`tel:${patient_data.phone_number}`}
                                    className='cursor-pointer'
                                >
                                    <LocalPhoneIcon
                                        className='ml-2 text-green-500'
                                        sx={{ fontSize: 20 }}
                                    />
                                </a>
                            </Tooltip>
                        </BioType>
                    </div>
                </div>
                <div className='flex flex-col gap-4 items-start w-1/2'>
                    <div>
                        <BioType className='font-inter text-[14px] text-gray-400 itd-input'>
                            Sex Assigned at Birth
                        </BioType>
                        <BioType className='font-inter text-[14px] text-black  itd-body'>
                            {patient_data.sex_at_birth}
                        </BioType>
                    </div>
                    <div className='flex flex-col items-center'>
                        <BioType className='font-inter text-[14px] text-gray-400 itd-input'>
                            Patient Since
                        </BioType>
                        <BioType className='font-inter text-[14px] text-black  itd-body'>
                            {convertPatientSince(patient_data.created_at)}
                        </BioType>
                    </div>
                    <div className='flex flex-col'>
                        <BioType className='font-inter text-[14px] text-gray-400 itd-input'>
                            Mailing Address
                        </BioType>
                        <div className='flex flex-col'>
                            <BioType className='font-inter text-[14px] text-black itd-body'>
                                {patient_data.address_line1}
                            </BioType>
                            {patient_data.address_line2 && (
                                <BioType>{patient_data.address_line2}</BioType>
                            )}
                            <BioType className='font-inter text-[14px] text-black  itd-body'>
                                {patient_data.city}, {patient_data.state}{' '}
                                {patient_data.zip}
                            </BioType>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
