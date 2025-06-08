import Image from 'next/image';

interface Props {
    className: string;
    seals: string[];
}

export default function SealFactory({ className, seals }: Props) {
    return (
        <div className={className}>
            {seals && (
                <>
                    {seals.map((item: string, index: number) => (
                        <div
                            key={index}
                            className="relative w-[20vw] aspect-square md:w-[5.28vw]"
                        >
                            {/* <Image
                src={`/img/product-page/seals/${item}.png`}
                alt={`${item}-seal`}
                fill
                unoptimized
              /> */}
                        </div>
                    ))}
                </>
            )}
        </div>
    );
}
