'use server';
import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';

interface Props {}

export default async function Page({}: Props) {
    return (
        <div className='flex flex-col items-center justify-center w-full p-4'>
            {/* Iterate over different typography styles */}
            {[
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'subtitle1',
                'subtitle2',
                'subtitle3',
                'body1',
                'body1bold',
                'body2',
                'body3',
                'label1',
                'label2',
                'label3',
                'caption',
                'overline',
            ].map((style) => (
                <div
                    key={style}
                    className='flex flex-row justify-between w-[60%] my-2'
                >
                    <BioType className={`${style} w-1/3`}>{style}:</BioType>
                    <BioType className={`${style} w-2/3 text-left`}>
                        Typography Test Lorem Ipsum
                    </BioType>
                </div>
            ))}
            <div>----------------------</div>
            <div>
                <BioType className='!text-black h5 w-full'>
                    Let us get to know you!!!
                </BioType>
                <BioType className='h5 !font-[900] w-full'>
                    Let us get to know you!!!
                </BioType>
            </div>
        </div>
    );
}
