import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Chip, Paper } from '@mui/material';
import {
    INTAKE_PAGE_BODY_TAILWIND,
    INTAKE_PAGE_HEADER_TAILWIND,
} from '../../styles/intake-tailwind-declarations';
import Image from 'next/image';
import { getImageRefUsingProductHref } from '@/app/utils/database/controller/products/products';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import WLProductItemDisplay from './wl-product-item-display';
import { VariantProductPrice } from '@/app/types/product-prices/product-prices-types';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import NewProductItemDisplay from './new-product-item-display';

interface Props {
    product_information: any;
    user_name: string;
    product_name: string;
    variantNumber: number;
    product_data: {
        product_href: string;
        variant: number;
        subscriptionType: string;
        discountable: boolean;
    };
    priceData: any;
    pricingStructure?: any;
    userProfileData: any;
    // variantPriceData: VariantProductPrice;
}

export default function NewOrderSummary({
    product_information,
    user_name,
    product_name,
    variantNumber,
    product_data,
    priceData,
    pricingStructure,
    userProfileData,
    // variantPriceData,
}: Props) {
    const params = useParams();
    const product_href = params.product as string;

    //getImageRefUsingProductHref
    const { data, error, isLoading } = useSWR(`${product_href}-image`, () =>
        getImageRefUsingProductHref(product_href)
    );

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <>
                <BioType>Error</BioType>
            </>
        );
    }

    const mainImageRef = data?.data[0];

    const banner_image_ref =
    userProfileData.sex_at_birth === 'Male'
        ? 'wl-checkout-male-doctor.png'
        : 'purple_banner.png';


        return (
            <>
              <div className='flex w-full md:max-w-[490px] mt-[1.25rem] md:mt-[48px]'>
                <div className='w-full'>
                  <div className='w-full'>
                    <Image
                      src={`/img/intake/wl/${banner_image_ref}`}
                      alt='product'
                      width={490}
                      height={0}
                      style={{ width: '100%', height: 'auto' }}
                      className='mx-auto'
                    />
                  </div>
                </div>
              </div>
              <p className={`inter_h5_regular mt-[1.25rem] md:mt-[46px] mb-[23px]`}>
                Save your payment details
              </p>
          
              {/* Conditionally render FSA/HSA banner */}
              {product_href !== 'sermorelin' && (
                <div>
                  <div className="flex flex-col justify-center mt-4 sm:mt-0 bg-[#D7E3EB] rounded-t-lg h-[31px]">
                    <div className='flex flex-row justify-center items-center gap-2'>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                      >
                        <path
                          d="M15.1693 8.19192V8.80525C15.1685 10.2429 14.7029 11.6417 13.8422 12.7931C12.9814 13.9446 11.7715 14.7869 10.3928 15.1945C9.01422 15.6021 7.54078 15.5532 6.19225 15.055C4.84372 14.5568 3.69237 13.636 2.90991 12.43C2.12745 11.2239 1.7558 9.79729 1.85039 8.36279C1.94498 6.92829 2.50074 5.5628 3.43479 4.46996C4.36884 3.37713 5.63113 2.6155 7.0334 2.29868C8.43567 1.98185 9.90278 2.12681 11.2159 2.71192M15.1693 3.47192L8.5026 10.1453L6.5026 8.14526"
                          stroke="black"
                          strokeOpacity="0.9"
                          strokeWidth="1.01733"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <BioType className="intake-subtitle text-strong underline underline-weak text-center">
                        FSA/HSA eligible for reimbursement
                      </BioType>
                    </div>
                  </div>
                </div>
              )}
          
              <div className='flex flex-col mx-[0.4px] border-[1px] border-solid border-[#dbd1d1] rounded-b-lg'>
                <div className='flex flex-col p-6 md:p-6 gap-6'>
                  {/* Product Data */}
                  <NewProductItemDisplay
                    user_name={user_name}
                    product_information={product_information}
                    product_name={product_name}
                    variantNumber={variantNumber}
                    product_data={product_data}
                    priceData={priceData}
                    pricingStructure={pricingStructure}
                    // variantPriceData={variantPriceData}
                  />
                </div>
              </div>
              <div className='w-full mb-4'>
              <div className='h-[1.25rem] md:h-[20px] flex flex-col justify-center w-fit px-3 py-1 rounded-b-lg bg-gradient-to-r from-cyan-200 to-pink-200 inter_body_small_regular  mx-auto'>
                  YOU WON&apos;T BE CHARGED UNTIL PRESCRIBED
                </div>
              </div>
            </>
          );
          }
