'use client';
import SignUpFormV2 from './forms/v2/sign-up-form-v2';

interface Props {
    url: string;
    onComplete?: () => Promise<void>;
    forProvider?: boolean;
}

export default function SignUpPageContents({ url, forProvider }: Props) {
    return (
        <>
            <div className='w-full h-[100vh] flex flex-row'>
                <div className='flex w-[95%] md:w-[25%] min-w-[400px] items-center m-auto'>
                    <SignUpFormV2 url={url} forProvider={forProvider} />
                </div>
                {/* <div className='w-[60%] h-full relative hidden lg:block'>
                    <div className='image-container'>
                        <Image src={'/img/login-image/login-image-2.jpeg'} alt='Login Banner Splash' fill unoptimized className={'image'} sizes="60vw" priority quality={50} style={{ objectFit: 'cover' }} />
                    </div>
                </div> */}
            </div>
        </>
    );
}
