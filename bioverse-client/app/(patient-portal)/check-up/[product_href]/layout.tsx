import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
    return (
        <div className='w-full flex justify-center flex-grow'>
            <div className='flex flex-col md:max-w-[520px] px-5 flex-grow'>
                {children}
            </div>
        </div>
    );
}
