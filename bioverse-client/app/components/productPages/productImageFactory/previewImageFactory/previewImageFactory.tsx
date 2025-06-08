import { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';

interface Props {
    productType: string;
    imageClassName: string;
    imageRefs: string[];
    setMainImageRef: Dispatch<SetStateAction<string>>;
    isMobile: boolean;
}

export default function PreviewImageFactory({
    productType,
    imageClassName,
    imageRefs,
    setMainImageRef,
    isMobile,
}: Props) {
    const handleClick = (imageReference: string) => {
        setMainImageRef(imageReference);
    };

    return (
        <div className="w-full flex flex-wrap items-center justify-start relative ">
            {imageRefs.map((imageReference, index) => (
                <div
                    className={imageClassName}
                    key={index}
                    style={{
                        marginBottom: isMobile ? '0px' : '25px',
                        marginRight: '10px',
                    }}
                >
                    <Image
                        src={`${process.env.NEXT_PUBLIC_PDP_MAIN_IMAGE_KEY}${imageReference}`}
                        alt="Preview Image"
                        onClick={() => handleClick(imageReference)}
                        fill
                        sizes="8.1vw"
                        unoptimized
                    />
                </div>
            ))}
        </div>
    );
}
