interface VGProps {
    height: string;
    key: string;
    custom_gradient_stop?: string;
}
export default function VerticalGradientLineSVGMobileV4({
    height,
    key,
    custom_gradient_stop,
}: VGProps) {
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="5"
                height="9rem"
                viewBox="0 0 5 214"
                fill="none"
            >
                <path
                    d="M2 2.47144L3 211.032"
                    stroke="url(#paint0_linear_19888_44376)"
                    stroke-width="4"
                    stroke-linecap="square"
                />
                <defs>
                    <linearGradient
                        id="paint0_linear_19888_44376"
                        x1="2.5"
                        y1="2.47144"
                        x2="2.5"
                        y2="211.032"
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
