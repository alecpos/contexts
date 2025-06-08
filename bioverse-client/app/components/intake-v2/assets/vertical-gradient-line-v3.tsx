interface VGProps {
    height: string;
    key: string;
    custom_gradient_stop?: string;
}
export default function VerticalGradientLineSVGV3({
    height,
    key,
    custom_gradient_stop,
}: VGProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="136"
                viewBox="0 0 7 156"
                fill="none"
            >
                <path
                    d="M3 2.47144L4 153.032"
                    stroke="url(#paint0_linear_19888_44333)"
                    stroke-width="4"
                    stroke-linecap="square"
                />
                <defs>
                    <linearGradient
                        id="paint0_linear_19888_44333"
                        x1="3.5"
                        y1="2.47144"
                        x2="3.5"
                        y2="153.032"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop offset="0.53" stop-color="#6DB0CC" />
                        <stop offset="1" stop-color="#D7E3EB" />
                    </linearGradient>
                </defs>
            </svg>
        </>
    );
}
