import ExpandMore from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from 'next/image';

interface LicenseSelfiePhotosAccordionProps {
    files: { url: string; created_at: string; name: string }[] | undefined;
}

export default function LicenseSelfiePhotosAccordion({
    files,
}: LicenseSelfiePhotosAccordionProps) {
    const renderPhotos = () => {
        return (
            <div className="flex flex-col space-y-4">
                {files?.map((file, index) => (
                    <div
                        key={index}
                        className="relative w-[90%] aspect-[1.5] cursor-pointer"
                    >
                        <Image
                            src={file.url}
                            alt={''}
                            // width={313.5}
                            // height={196}
                            fill
                            quality={50}
                            unoptimized
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <Accordion
                sx={{
                    boxShadow: 'none',
                    width: '100%',
                    padding: 0,
                    position: 'sticky',
                }}
                disableGutters
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id="license-accordion"
                    sx={{ padding: 0 }}
                >
                    <p className={`text-black  provider-tabs-subtitle`}>
                        Past License and Selfie Uploads
                    </p>
                </AccordionSummary>
                <AccordionDetails>{renderPhotos()}</AccordionDetails>
            </Accordion>
        </div>
    );
}
