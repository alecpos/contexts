import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';
import { CircularProgress } from '@mui/material';

export default function IntakeLoadingComponent() {
    return (
        <div className='flex flex-row justify-center items-center mt-8 gap-2'>
            <div className='h4'>Loading </div>
            <CircularProgress />
        </div>
    );
}
