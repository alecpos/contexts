import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    updateOrder,
    updateOrderDiscount,
} from '@/app/utils/database/controller/orders/orders-api';
import {
    Button,
    ButtonGroup,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';
import useSWR, { KeyedMutator } from 'swr';
import {
    SEMAGLUTIDE_VARIANT_DISPLAY_ARRAY,
    TIRZEPATIDE_VARIANT_DISPLAY_ARRAY,
} from '../../../../../../utils/glp-1-list';
import {
    getPriceVariantTableData,
    getProductVariantStripePriceIDsWithCadence,
} from '@/app/utils/database/controller/product_variants/product_variants';

interface ChangeOrderInformationDialogProps {
    open: boolean;
    onClose: () => void;
    orderData: OrderTabOrder;
    setSnackbarMessage: any;
    setShowSnackbar: any;
    setSnackbarStatus: any;
    mutate_orders: KeyedMutator<any>;
}

const MEDICATIONS = ['semaglutide', 'tirzepatide', 'nad-injection'];

export default function ChangeOrderInformationDialog({
    open,
    onClose,
    orderData,
    setSnackbarMessage,
    setShowSnackbar,
    setSnackbarStatus,
    mutate_orders,
}: ChangeOrderInformationDialogProps) {
    const [mode, setMode] = useState<'product' | 'variant'>('product');
    const [reason, setReason] = useState<string>('');
    // const [date, setDate] = useState<Date | null>(new Date());
    const [selectedMedication, setSelectedMedication] = useState<string>(
        orderData.product_href,
    );
    const [selectedVariant, setSelectedVariant] = useState<number>(0);

    const { data: product_variant_data } = useSWR(
        `${orderData.product_href}-prices`,
        () => getPriceVariantTableData(orderData.product_href),
    );

    const [buttonLoading, setButtonLoading] = useState<boolean>(false);

    const handleDeny = () => {
        onClose();
        // Additional actions on deny
    };

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedMedication(event.target.value);
    };

    const handleVariantChange = (event: SelectChangeEvent) => {
        setSelectedVariant(parseInt(event.target.value));
    };

    // TODO: Add handling for different variants
    const handleClick = async () => {
        setButtonLoading(true);
        try {
            // if (date?.getDay() === new Date().getDay()) {

            const stripe_price_ids =
                await getProductVariantStripePriceIDsWithCadence(
                    selectedMedication,
                    'monthly',
                );

            const new_price_id = stripe_price_ids?.prod;

            await updateOrder(orderData.id, {
                subscription_type: 'monthly',
                price_id: new_price_id,
                product_href: selectedMedication,
            });

            await updateOrderDiscount(orderData.id);

            setSnackbarMessage(
                `Successfuly updated order to ${selectedMedication}`,
            );
            setSnackbarStatus('success');
            setShowSnackbar(true);
            // }
        } catch (error) {
            setSnackbarMessage(
                `Error: Failed to update order. Please contact engineering.`,
            );
            setSnackbarStatus('error');
            setShowSnackbar(true);
        } finally {
            setButtonLoading(false);
            mutate_orders();
            onClose();
        }
    };

    const handleVariantClick = async () => {
        setButtonLoading(true);
        try {
            // const new_price_id =
            //     typeof product_variant_data!.data![selectedVariant][
            //         product_variant_data!.data![selectedVariant].cadence
            //     ].stripe_price_id === 'string'
            //         ? product_variant_data!.data![selectedVariant][
            //               product_variant_data!.data![selectedVariant].cadence
            //           ].stripe_price_id
            //         : product_variant_data!.data![selectedVariant][
            //               product_variant_data!.data![selectedVariant].cadence
            //           ].stripe_price_id[
            //               process.env
            //                   .NEXT_PUBLIC_ENVIRONMENT as keyof StripePriceId
            //           ];

            if (!product_variant_data || !product_variant_data.data) {
                return;
            }

            const variant_price_record = product_variant_data.data.find(
                (variant) => variant.variant_index == selectedVariant,
            );

            const new_price_id =
                variant_price_record?.stripe_price_ids[
                    process.env.NEXT_PUBLIC_ENVIRONMENT as 'dev' | 'prod'
                ];

            await updateOrder(orderData.id, {
                subscription_type: 'monthly',
                variant_index: selectedVariant,
                price_id: new_price_id,
            });
            await updateOrderDiscount(orderData.id);

            setSnackbarMessage(
                `Successfuly updated order to ${selectedMedication}`,
            );
            setSnackbarStatus('success');
            setShowSnackbar(true);
        } catch (error) {
            setSnackbarMessage(
                `Error: Failed to update order. Please contact engineering.`,
            );
            setSnackbarStatus('error');
            setShowSnackbar(true);
        } finally {
            setButtonLoading(false);
            mutate_orders();
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <BioType className="h4">
                    Change Order Information for Patient
                </BioType>
            </DialogTitle>
            <DialogContent className="flex flex-col items-start gap-4 px-8">
                <ButtonGroup>
                    <Button
                        variant={mode === 'product' ? 'contained' : 'outlined'}
                        onClick={() => {
                            setMode('product');
                        }}
                    >
                        Product
                    </Button>
                    <Button
                        variant={mode === 'variant' ? 'contained' : 'outlined'}
                        onClick={() => {
                            setMode('variant');
                        }}
                    >
                        Custom Price
                    </Button>
                </ButtonGroup>

                {mode === 'product' ? (
                    <>
                        {/* <div className='flex flex-col justify-center w-full'>
                            <InputLabel id='selected-medication-input'>
                                Select Date to Take Effect
                            </InputLabel>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={date}
                                    onChange={(newValue) => setDate(newValue)}
                                />
                            </LocalizationProvider>
                        </div> */}
                        <div className="flex justify-center w-full">
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="selected-medication-input">
                                    Product
                                </InputLabel>
                                <Select
                                    id="selected-medication-select"
                                    value={selectedMedication}
                                    onChange={handleChange}
                                    label="Product"
                                >
                                    <MenuItem value="semaglutide">
                                        Semaglutide Vial - Empower
                                    </MenuItem>
                                    <MenuItem value="tirzepatide">
                                        Tirzepatide Vial - Empower
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center w-full">
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="selected-medication-input">
                                    Variant
                                </InputLabel>
                                <Select
                                    id="selected-medication-select"
                                    value={selectedVariant.toString()}
                                    onChange={handleVariantChange}
                                    label="Variant"
                                >
                                    {product_variant_data?.data?.map(
                                        (variant_item, index: number) => {
                                            if (index > 0) {
                                                //index variant 0 for GLP-1 is not used properly, since it is the default flexible vial.
                                                return (
                                                    <MenuItem
                                                        value={
                                                            variant_item.variant_index
                                                        }
                                                        key={
                                                            variant_item.variant_index
                                                        }
                                                    >
                                                        {orderData.product_href ===
                                                        'semaglutide'
                                                            ? SEMAGLUTIDE_VARIANT_DISPLAY_ARRAY[
                                                                  index
                                                              ]
                                                            : TIRZEPATIDE_VARIANT_DISPLAY_ARRAY[
                                                                  index
                                                              ]}
                                                    </MenuItem>
                                                );
                                            } else {
                                                return;
                                            }
                                        },
                                    )}
                                </Select>
                            </FormControl>
                        </div>
                    </>
                )}
            </DialogContent>
            <DialogActions className="w-full flex justify-center">
                {mode === 'product' ? (
                    <>
                        <Button
                            onClick={handleDeny}
                            variant="contained"
                            color="error"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleClick}
                            autoFocus
                            variant="contained"
                            color="primary"
                        >
                            {buttonLoading ? (
                                <CircularProgress
                                    size={22}
                                    sx={{ color: 'white' }}
                                />
                            ) : (
                                'Change Medication'
                            )}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            onClick={handleDeny}
                            variant="contained"
                            color="error"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleVariantClick}
                            autoFocus
                            variant="contained"
                            color="primary"
                        >
                            {buttonLoading ? (
                                <CircularProgress
                                    size={22}
                                    sx={{ color: 'white' }}
                                />
                            ) : (
                                'Apply Custom Price'
                            )}
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}
