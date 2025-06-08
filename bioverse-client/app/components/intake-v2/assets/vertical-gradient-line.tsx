interface VGProps {
    height: string;
    key: string;
    custom_gradient_stop?: string;
}
export default function VerticalGradientLineSVG({
    height,
    key,
    custom_gradient_stop,
}: VGProps) {
    return (
        <>
            <svg
                xmlns='http://www.w3.org/2000/svg'
                width='6'
                height={`${parseInt(height)}`}
                viewBox={`0 0 6 ${height}`}
                fill='none'
            >
                <path
                    d={`M2.5 3L3.5 500`}
                    stroke='url(#paint0_linear_8455_24966)'
                    stroke-width='4'
                    stroke-linecap='square'
                />
                <defs>
                    <linearGradient
                        id='paint0_linear_8455_24966'
                        x1='3'
                        y1='3'
                        x2='3'
                        y2={custom_gradient_stop ?? '152'}
                        gradientUnits='userSpaceOnUse'
                    >
                        <stop offset='0.53' stop-color='#286BA2' />
                        <stop offset='1' stop-color='#AFAFAF' />
                    </linearGradient>
                </defs>
            </svg>
        </>
    );
}
