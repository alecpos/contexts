'use client'
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function ActiveRenewalOptionsComponent({ dosingOptions, doubleDosingOptions }: { dosingOptions: any, doubleDosingOptions: any }) {

  return (
    <div className='max-w-[1200px] mx-auto pt-2'>
        <p className='my-4'>* SELECTED PATIENT STATE: OHIO</p>
      <p className='text-2xl font-bold'>If one dosage is suggested:</p>
      {dosingOptions.map((dosingOption: any) => (
        <>
            <div key={dosingOption.dosing} className='my-5'>
                <span className='font-bold text-lg'>Recommended Dosage: {dosingOption.dosing}</span>
                {dosingOption.variants.map((variant: any) => (
                    <div className='flex flex-row gap-2 my-1 bg-slate-200 p-2 rounded-lg' key={variant.variant_index}>
                        
                        <p className=''>{variant.cadence}</p>
                        <p className=''>{variant.dosages}</p>
                        <p className={`font-bold ${
                            variant.pharmacy === 'hallandale' ? 'text-green-500' :
                            variant.pharmacy === 'revive' ? 'text-red-500' :
                            variant.pharmacy === 'empower' ? 'text-red-300' :
                            variant.pharmacy === 'boothwyn' ? 'text-blue-500' :
                            'text-gray-500'
                        }`}>{capitalizeFirstLetter(variant.pharmacy)}</p>
                        <p className=''>${variant.price_data.product_price}</p>
                    </div>
                ))}
            </div>
          </>
      ))}

      <p className='text-2xl font-bold mt-10'>If two dosages are suggested:</p>
      {doubleDosingOptions.map((dosingOption: any) => (
        <>
            <div key={dosingOption.dosing} className='my-5'>
                <span className='font-bold text-lg'>Recommended Dosage: {dosingOption.dosing}</span>
                {dosingOption.variants.map((variant: any) => (
                    <div className='flex flex-row gap-2 my-1 bg-blue-100 p-2 rounded-lg' key={variant.variant_index}>
                        
                        <p className=''>{variant.cadence}</p>
                        <p className=''>{variant.dosages}</p>
                        <p className={`font-bold ${
                            variant.pharmacy === 'hallandale' ? 'text-green-500' :
                            variant.pharmacy === 'revive' ? 'text-red-500' :
                            variant.pharmacy === 'empower' ? 'text-red-300' :
                            variant.pharmacy === 'boothwyn' ? 'text-blue-500' :
                            'text-gray-500'
                        }`}>{capitalizeFirstLetter(variant.pharmacy)}</p>
                        <p className=''>${variant.price_data.product_price}</p>
                    </div>
                ))}
            </div>
            
          </>

      ))}

    </div>
  );
}
