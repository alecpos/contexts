import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function ActiveMacrosClientComponent({ macros }: { macros: any }) {
  return (
    <div className='max-w-[1000px] mx-auto'>
      {Object.entries(macros).map(([category, macrosList]) => (
        <>
        <div key={category} className="mb-4 p-4 border ">
          <h2 className="text-xl font-bold">{category}</h2>
          <ul className="list-disc pl-5">
            {Object.entries(macrosList as Record<string, string>).map(([macroName, macroHtml]) => (
              <li key={macroName} className="text-gray-700 mt-5 bg-slate-200 p-2 rounded-lg">
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ArrowDownwardIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    >
                    <Typography component="span"> <span className='font-bold'>{macroName}</span></Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>
                        <div dangerouslySetInnerHTML={{ __html: macroHtml }} />
                    </Typography>
                    </AccordionDetails>
                </Accordion>
              </li>
            ))}
          </ul>
        </div>
            
          </>

      ))}

    </div>
  );
}
