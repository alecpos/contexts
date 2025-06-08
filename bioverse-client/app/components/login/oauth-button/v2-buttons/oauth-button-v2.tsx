'use client';

import { Button, SvgIcon } from '@mui/material';
import Image from 'next/image';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import FacebookIcon from '@mui/icons-material/Facebook';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface Props {
    type: string;
}

export default function OauthButton({ type }: Props) {
    return (
        <>
            {type == 'google' && (
                <Button
                    className='h5'
                    sx={{
                        borderColor: '#D8D8D8',
                        height: '52px',
                    }}
                    variant='outlined'
                    startIcon={
                        <>
                            <SvgIcon color='primary' fontSize='large'>
                                <svg
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <g
                                        id='Google - Original'
                                        clipPath='url(#clip0_1661_56287)'
                                    >
                                        <path
                                            id='Vector'
                                            d='M23.7663 12.2765C23.7663 11.4608 23.7001 10.6406 23.559 9.83813H12.2402V14.4591H18.722C18.453 15.9495 17.5888 17.2679 16.3233 18.1056V21.104H20.1903C22.4611 19.014 23.7663 15.9274 23.7663 12.2765Z'
                                            fill='#4285F4'
                                        />
                                        <path
                                            id='Vector_2'
                                            d='M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z'
                                            fill='#34A853'
                                        />
                                        <path
                                            id='Vector_3'
                                            d='M5.50277 14.3002C5.00011 12.8099 5.00011 11.196 5.50277 9.70569V6.61475H1.51674C-0.185266 10.0055 -0.185266 14.0004 1.51674 17.3912L5.50277 14.3002Z'
                                            fill='#FBBC04'
                                        />
                                        <path
                                            id='Vector_4'
                                            d='M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z'
                                            fill='#EA4335'
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id='clip0_1661_56287'>
                                            <rect
                                                width='24'
                                                height='24'
                                                fill='white'
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </SvgIcon>
                        </>
                    }
                >
                    Continue with Google
                </Button>
            )}
            {type == 'apple' && (
                <Button
                    className='h5'
                    variant='outlined'
                    sx={{
                        borderColor: '#D8D8D8',
                        height: '52px',
                        borderRadius: '12px',
                    }}
                    startIcon={
                        <svg
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <g
                                id='Apple - Original'
                                clipPath='url(#clip0_1661_56290)'
                            >
                                <path
                                    id='Vector'
                                    d='M21.792 18.7035C21.429 19.542 20.9994 20.3139 20.5016 21.0235C19.8231 21.9908 19.2676 22.6605 18.8395 23.0323C18.1758 23.6426 17.4647 23.9552 16.7032 23.973C16.1566 23.973 15.4973 23.8175 14.73 23.5019C13.9601 23.1878 13.2525 23.0323 12.6056 23.0323C11.9271 23.0323 11.1994 23.1878 10.4211 23.5019C9.64153 23.8175 9.01355 23.9819 8.53342 23.9982C7.80322 24.0293 7.07539 23.7078 6.3489 23.0323C5.88521 22.6279 5.30523 21.9345 4.61043 20.9524C3.86498 19.9035 3.25211 18.6872 2.77198 17.3006C2.25777 15.8029 2 14.3526 2 12.9484C2 11.3401 2.34754 9.95284 3.04367 8.79035C3.59076 7.8566 4.31859 7.12003 5.22953 6.57931C6.14046 6.03858 7.12473 5.76304 8.18469 5.74541C8.76467 5.74541 9.52524 5.92481 10.4704 6.27739C11.4129 6.63116 12.0181 6.81056 12.2834 6.81056C12.4817 6.81056 13.154 6.60079 14.2937 6.18258C15.3714 5.79474 16.281 5.63415 17.0262 5.69741C19.0454 5.86037 20.5624 6.65634 21.5712 8.09037C19.7654 9.18456 18.8721 10.7171 18.8898 12.6831C18.9061 14.2145 19.4617 15.4888 20.5535 16.5006C21.0483 16.9703 21.6009 17.3332 22.2156 17.591C22.0823 17.9776 21.9416 18.348 21.792 18.7035ZM17.161 0.480381C17.161 1.68066 16.7225 2.80135 15.8484 3.83865C14.7937 5.0718 13.5179 5.78437 12.1343 5.67193C12.1167 5.52793 12.1065 5.37638 12.1065 5.21713C12.1065 4.06487 12.6081 2.83172 13.4989 1.82345C13.9436 1.31295 14.5092 0.888472 15.1951 0.54986C15.8796 0.216299 16.5269 0.0318332 17.1358 0.000244141C17.1536 0.160702 17.161 0.32117 17.161 0.480365V0.480381Z'
                                    fill='black'
                                />
                            </g>
                            <defs>
                                <clipPath id='clip0_1661_56290'>
                                    <rect width='24' height='24' fill='white' />
                                </clipPath>
                            </defs>
                        </svg>
                    }
                >
                    <BioType className='h5 text-[#393939] text-[16px] normal-case border-[#D8D8D8]'>
                        Continue with Apple
                    </BioType>
                </Button>
            )}
            {type == 'facebook' && (
                <Button
                    className='h5'
                    variant='outlined'
                    sx={{
                        borderColor: '#D8D8D8',
                        height: '52px',
                        borderRadius: '12px',
                    }}
                    startIcon={
                        <svg
                            width='25'
                            height='24'
                            viewBox='0 0 25 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <g
                                id='Facebook - Original'
                                clipPath='url(#clip0_1661_56293)'
                            >
                                <path
                                    id='Vector'
                                    d='M24.5 12C24.5 5.37258 19.1274 0 12.5 0C5.87258 0 0.5 5.37258 0.5 12C0.5 17.9895 4.8882 22.954 10.625 23.8542V15.4688H7.57812V12H10.625V9.35625C10.625 6.34875 12.4166 4.6875 15.1576 4.6875C16.4701 4.6875 17.8438 4.92188 17.8438 4.92188V7.875H16.3306C14.84 7.875 14.375 8.80008 14.375 9.75V12H17.7031L17.1711 15.4688H14.375V23.8542C20.1118 22.954 24.5 17.9895 24.5 12Z'
                                    fill='#1877F2'
                                />
                                <path
                                    id='Vector_2'
                                    d='M17.1711 15.4688L17.7031 12H14.375V9.75C14.375 8.80102 14.84 7.875 16.3306 7.875H17.8438V4.92188C17.8438 4.92188 16.4705 4.6875 15.1576 4.6875C12.4166 4.6875 10.625 6.34875 10.625 9.35625V12H7.57812V15.4688H10.625V23.8542C11.8674 24.0486 13.1326 24.0486 14.375 23.8542V15.4688H17.1711Z'
                                    fill='white'
                                />
                            </g>
                            <defs>
                                <clipPath id='clip0_1661_56293'>
                                    <rect
                                        width='24'
                                        height='24'
                                        fill='white'
                                        transform='translate(0.5)'
                                    />
                                </clipPath>
                            </defs>
                        </svg>
                    }
                >
                    <BioType className='h5 text-[#393939] text-[16px] normal-case border-[#D8D8D8]'>
                        Continue with Facebook
                    </BioType>
                </Button>
            )}
        </>
    );
}
