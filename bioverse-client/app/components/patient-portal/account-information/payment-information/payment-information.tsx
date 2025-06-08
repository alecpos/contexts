import { Button, Drawer, Paper } from '@mui/material';
import BioType from '../../../global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '../../../global-components/dividers/horizontalDivider/horizontalDivider';
import { useState } from 'react';
import PaymentChangeDrawer from './payment-change-drawer';

interface Props {}

export default function PortalPaymentInformation({}: Props) {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const payment_information_main_container_class =
        'flex flex-col mx-4 gap-4 md:mr-1 md:w-[60%]';
    const payment_info_display_content_class =
        'flex flex-col p-4 gap-4 md:mb-[10px]';
    const card_information_box_class =
        'flex flex-col md:flex-row md:justify-between gap-8';
    const horizontal_divider_container_class = 'h-[1px] py-2';

    const toggleDrawer = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <>
            <Paper
                id='payment-information-main-container'
                className={payment_information_main_container_class}
            >
                <div
                    id='payment-info-display-content'
                    className={payment_info_display_content_class}
                >
                    <BioType className='body1bold'>Payment Method</BioType>

                    <div className={horizontal_divider_container_class}>
                        <HorizontalDivider
                            backgroundColor='#e3e3e3'
                            height={1}
                        />
                    </div>

                    <div
                        id='card-information-box'
                        className={card_information_box_class}
                    >
                        <div>
                            <BioType>Default Card</BioType>

                            <BioType>•••• •••• •••• 2005</BioType>
                        </div>

                        <div>
                            <Button
                                variant='contained'
                                onClick={toggleDrawer}
                                className='rubik-large'
                                fullWidth
                            >
                                update payment method
                            </Button>
                        </div>
                    </div>
                </div>
            </Paper>

            <Drawer anchor='right' open={menuOpen} onClose={toggleDrawer}>
                <PaymentChangeDrawer setMenuOpen={setMenuOpen} />
            </Drawer>
        </>
    );
}
