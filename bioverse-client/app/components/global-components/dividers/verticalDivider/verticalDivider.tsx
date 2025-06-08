interface VerticalDividerProps {
    backgroundColor?: string;
    width?: string; // The '?' makes the prop optional
}

const VerticalDivider: React.FC<VerticalDividerProps> = ({
    backgroundColor = '',
    width = '',
}) => {
    return (
        <div
            style={{
                height: '100%',
                width: `${width}px`,
                backgroundColor: backgroundColor,
            }}
        ></div>
    );
};

export default VerticalDivider;
