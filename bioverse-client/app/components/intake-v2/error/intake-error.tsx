import BioType from '../../global-components/bioverse-typography/bio-type/bio-type';

export default function IntakeErrorComponent() {
    return (
        <div className='flex flex-col justify-center items-center mt-8'>
            <BioType className='h4'>
                Error in loading data, please refresh the page.
            </BioType>
        </div>
    );
}
