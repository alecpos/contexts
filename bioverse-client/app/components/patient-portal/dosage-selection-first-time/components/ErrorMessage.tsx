import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

export default function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="flex justify-center">
            <BioType className="intake-subtitle">{message}</BioType>
        </div>
    );
}
