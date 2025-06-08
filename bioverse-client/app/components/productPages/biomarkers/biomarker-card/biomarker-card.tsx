import { Paper, Typography } from '@mui/material';

interface Props {
    name: string;
    unit?: string;
    description: string;
}

export default function BiomarkerCard({ name, unit, description }: Props) {
    return (
        <>
            <Paper className=" md:h-[300px] flex flex-col items-center gap-[.347vw] p-[1.67vw] md:p-[1.11vw]">
                <Typography className={`text-gray-800 font-medium body1`}>
                    {name} {unit && <>({unit})</>}
                </Typography>

                <Typography className={`body2 font-light`}>
                    {description}
                </Typography>
            </Paper>
        </>
    );
}
