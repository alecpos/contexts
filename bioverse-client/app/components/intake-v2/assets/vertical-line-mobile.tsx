interface VGProps {
    height: string;
    color?: string;
}

export default function VerticalLineSVGMobile({
    height,
    color = '#286BA2',
}: VGProps) {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            width='6'
            height={height}
            viewBox={`0 0 6 ${height}`}
            fill='none'
        >
            <path
                d={`M3 3L3 ${height}`}
                stroke={color}
                strokeWidth='4'
                strokeLinecap='square'
            />
        </svg>
    );
}
