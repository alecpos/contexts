interface VGProps {
    height: string;
    key: string;
    color?: string;
}
export default function VerticalSolidLineSVG({ height, key, color }: VGProps) {
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
                    d={`M3 3L3 ${parseInt(height)}`}
                    stroke={color}
                    strokeWidth='4'
                    strokeLinecap='square'
                />
            </svg>
        </>
    );
}
