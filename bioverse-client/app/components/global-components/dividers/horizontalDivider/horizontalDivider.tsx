interface Props {
    backgroundColor: string;
    height: number;
}

/**
 *
 * Properties:
 * backgroundColor - string name for color or hexcode.
 * width - number representing width in %
 * height - number representing height in px.
 *
 * @returns
 */
export default function HorizontalDivider({ backgroundColor, height }: Props) {
    return (
        <div
            style={{
                height: `${height}px`,
                backgroundColor: `${backgroundColor}`,
                flex: 1,
            }}
        ></div>
    );
}
