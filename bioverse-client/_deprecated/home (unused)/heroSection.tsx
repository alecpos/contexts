import { Button } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
    const catalogHref = '/collections';

    return (
        <div className="">
            <div className="">
                <div className="">
                    <div className="">
                        <p className="">
                            Science-backed solutions for vibrant living
                        </p>
                        <p className="">
                            Enhance your longevity and enrich daily living.
                            Advanced science-backed longevity solutions
                            delivered to your door.
                        </p>
                    </div>
                    <Link href={catalogHref}>
                        <Button variant="contained">
                            Explore all Treatments
                        </Button>
                    </Link>
                    {/* onClickAction="redirect" redirectHref="collections" */}
                    <div className="">
                        <div className="">
                            <div className="">80%</div>
                            <div className="">
                                of patients improved quality of life in their
                                first 3 months
                            </div>
                        </div>
                        <div className="">
                            <div className="">58%</div>
                            <div className="">
                                of patients saw improvements in diabetic markers
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="">
                <div className="flex relative w-full h-[31.25vw]">
                    <Image
                        src={'/img/home-page/hero-placeholder1.jpg'}
                        alt="placeholder"
                        fill
                        className=""
                        sizes="(min-width: 860px) 60vw, calc(95.38vw - 297px)"
                        priority
                        unoptimized
                    />
                </div>
            </div>
        </div>
    );
}
