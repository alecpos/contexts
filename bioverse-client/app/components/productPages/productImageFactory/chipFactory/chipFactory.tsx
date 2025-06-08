import { Chip } from './chip/chip';

interface Props {
    className: string;
    chips: string[];
}

export default function ChipFactory({ className, chips }: Props) {
    return (
        <>
            {chips && (
                <div className={className}>
                    {chips.map((item) => (
                        <div
                            className="inline-flex items-start gap-[4px] px-[8px] py-0 relative flex-[0_0_auto]"
                            key={item}
                        >
                            <Chip
                                className="!flex-[0_0_auto] !bg-[#f1e67b]"
                                color="secondary"
                                label={item}
                                size="small"
                                stateProp="enabled"
                                variant="filled"
                                delete1={false}
                                thumbnail={false}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
