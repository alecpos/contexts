import { Box } from '@mui/material';
import BioType from '../../bioverse-typography/bio-type/bio-type';

export default function IntakeFlowError() {
    return (
        <>
            <div className='flex flex-row justify-center items-center mt-10 gap-4'>
                <BioType className='h4'>
                    There was an error with the intake. Please refresh the page.
                </BioType>
            </div>
        </>
    );
}
