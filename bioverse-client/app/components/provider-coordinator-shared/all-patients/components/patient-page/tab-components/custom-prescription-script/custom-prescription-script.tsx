import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { getEligiblePharmacy } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/approval-pharmacy-scripts/approval-pharmacy-product-map';
import {
    ALL_GLP1_VARIANTS,
    getDisplayNameForVariantGLP1Swap,
} from '@/app/services/pharmacy-integration/variant-swap/glp1-variant-index-swap';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { PRODUCT_HREF } from '@/app/types/global/product-enumerator';
import { PHARMACY } from '@/app/types/pharmacy-integrations/pharmacy-types';
import { getProductName } from '@/app/utils/functions/formatting';
import {
    Button,
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextareaAutosize,
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { generateCustomScript } from './custom-prescription-script-utils';
import CustomPrescriptionConfirmationDialog from './components/CustomPrescriptionConfirmationDialog';
import LoadingScreen from '@/app/components/global-components/loading-screen/loading-screen';
import BioverseSnackbarMessage from '@/app/components/global-components/snackbar/bioverse-snackbar';

interface CustomPrescriptionScriptProps {
    access_type: BV_AUTH_TYPE | null;
    profile_data: APProfileData;
    user_id: string;
}

export default function CustomPrescriptionScript({
    access_type,
    profile_data,
    user_id,
}: CustomPrescriptionScriptProps) {
    const [selectedProduct, setSelectedProduct] = useState<string>('n/a');
    const [selectedVariant, setSelectedVariant] = useState<number>(0);
    const [availableVariantIndexes, setAvailableVariantIndexes] = useState<
        number[]
    >([]);
    const [script, setScript] = useState<EmpowerGeneratedScript | undefined>(
        undefined,
    );
    const [showConfirmationDialog, setShowConfirmationDialog] =
        useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);
    const [openSnackBar, setOpenSnackbar] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
        'success',
    );
    const [pharmacy, setPharmacy] = useState<string>('');

    const mutateSnackbar = (message: string, type: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarType(type);
    };

    const ALLOWED_PRODUCTS = [
        PRODUCT_HREF.SEMAGLUTIDE,
        PRODUCT_HREF.TIRZEPATIDE,
    ];

    useEffect(() => {
        if (selectedProduct && selectedVariant) {
            const pharmacy = getEligiblePharmacy(
                selectedProduct,
                selectedVariant,
            );

            if (pharmacy) {
                setPharmacy(pharmacy);
            } else {
                setPharmacy('');
            }
        } else {
            setPharmacy('');
        }
    }, [selectedProduct, selectedVariant]);

    useEffect(() => {
        const all_variants =
            ALL_GLP1_VARIANTS[
                selectedProduct as keyof typeof ALL_GLP1_VARIANTS
            ];

        setAvailableVariantIndexes(all_variants);
    }, [selectedProduct]);

    // Populate the scripts textfield
    useEffect(() => {
        const loadScriptData = async () => {
            setLoading(true);
            try {
                const scriptData = await generateCustomScript(
                    profile_data,
                    selectedProduct,
                    selectedVariant,
                );
                setScript(scriptData);
            } catch (error) {
                // ERROR STUFF HERE
            } finally {
                setLoading(false);
            }
        };
        if (!selectedProduct || !selectedVariant) {
            return;
        }

        loadScriptData();
    }, [selectedVariant]);

    const handleRemoveRx = (index: number) => {
        if (!script) return;
        const updatedNewRxs = script.script.newRxs.filter(
            (_, i) => i !== index,
        );
        setScript({
            ...script,
            script: { ...script.script, newRxs: updatedNewRxs },
        });
    };

    const handleChangeQuantity = (index: number, newQuantity: string) => {
        if (!script) return;
        const updatedNewRxs = script.script.newRxs.map((rx, i) =>
            i === index
                ? {
                      ...rx,
                      medication: { ...rx.medication, quantity: newQuantity },
                  }
                : rx,
        );
        setScript({
            ...script,
            script: { ...script.script, newRxs: updatedNewRxs },
        });
    };

    const handleChangeDaysSupply = (index: number, newDaysSupply: string) => {
        if (!script) return;
        const updatedNewRxs = script.script.newRxs.map((rx, i) =>
            i === index
                ? {
                      ...rx,
                      medication: {
                          ...rx.medication,
                          daysSupply: newDaysSupply,
                      },
                  }
                : rx,
        );
        setScript({
            ...script,
            script: { ...script.script, newRxs: updatedNewRxs },
        });
    };

    const handleClear = () => {
        setScript(undefined);
        setSelectedVariant(0);
    };

    const handleSendScript = () => {
        setShowConfirmationDialog(true);
    };

    return (
        <div className="flex justify-start mt-4 w-full">
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between w-full">
                    <div className="flex space-x-4">
                        <FormControl>
                            <InputLabel id="demo-simple-select-label">
                                Select Product
                            </InputLabel>
                            <Select
                                label="Select Product"
                                value={selectedProduct}
                                onChange={(e) =>
                                    setSelectedProduct(e.target.value)
                                }
                            >
                                <MenuItem value="n/a" disabled>
                                    Select Product
                                </MenuItem>
                                {ALLOWED_PRODUCTS.map(
                                    (product: string, index: number) => (
                                        <MenuItem key={index} value={product}>
                                            {getProductName(product)}
                                        </MenuItem>
                                    ),
                                )}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel id="demo-simple-select-label-variant">
                                Select Variant
                            </InputLabel>
                            <Select
                                label="Select Variant"
                                value={selectedVariant}
                                onChange={(e) =>
                                    setSelectedVariant(e.target.value as number)
                                }
                            >
                                <MenuItem value={0} disabled>
                                    Select Variant
                                </MenuItem>
                                {availableVariantIndexes?.map(
                                    (variantIndex: number) => (
                                        <MenuItem
                                            key={variantIndex}
                                            value={variantIndex}
                                        >
                                            {getDisplayNameForVariantGLP1Swap(
                                                selectedProduct,
                                                variantIndex,
                                            )}
                                        </MenuItem>
                                    ),
                                )}
                            </Select>
                        </FormControl>
                    </div>
                    {selectedVariant && script && (
                        <div className="flex space-x-4">
                            <Button
                                color="error"
                                variant="contained"
                                onClick={handleClear}
                            >
                                <BioType className="intake-v3-question-text font-bold">
                                    Clear
                                </BioType>
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={handleSendScript}
                            >
                                <BioType className="intake-v3-question-text font-bold">
                                    Send Script
                                </BioType>
                            </Button>
                        </div>
                    )}
                </div>
                <div className="">
                    <BioType className="inter-h5-question-header-bold md:text-[28px] mb-6">
                        Generated Script
                    </BioType>
                    {loading && <LoadingScreen />}
                    <div className="flex flex-col space-y-4">
                        {script?.script.newRxs.map((rx, index) => (
                            <div
                                key={index}
                                className="p-4 border rounded-lg shadow-md flex justify-between items-center"
                            >
                                <div className="flex flex-col space-y-2">
                                    <BioType className="inter-h5-question-header-bold">
                                        {rx.medication.drugDescription}
                                    </BioType>
                                    <BioType className="intake-v3-question-text">
                                        Quantity: {rx.medication.quantity}
                                    </BioType>
                                    <BioType className="intake-v3-question-text">
                                        Days Supply: {rx.medication.daysSupply}
                                    </BioType>
                                    <BioType className="intake-v3-question-text underline">
                                        Sig
                                    </BioType>
                                    <BioType className="intake-v3-question-text">
                                        {rx.medication.sigText}
                                    </BioType>
                                </div>
                                <div className="flex space-x-2">
                                    <TextField
                                        label="Quantity"
                                        variant="outlined"
                                        size="small"
                                        type="number"
                                        value={rx.medication.quantity}
                                        onChange={(e) =>
                                            handleChangeQuantity(
                                                index,
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <TextField
                                        label="Days Supply"
                                        variant="outlined"
                                        size="small"
                                        type="number"
                                        value={rx.medication.daysSupply}
                                        onChange={(e) =>
                                            handleChangeDaysSupply(
                                                index,
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleRemoveRx(index)}
                                    >
                                        <BioType className="intake-v3-question-text font-bold">
                                            Remove
                                        </BioType>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <CustomPrescriptionConfirmationDialog
                    open={showConfirmationDialog}
                    setOpen={setShowConfirmationDialog}
                    script={script}
                    profile_data={profile_data}
                    product_href={selectedProduct}
                    mutateSnackbar={mutateSnackbar}
                    setOpenSnackbar={setOpenSnackbar}
                    user_id={user_id}
                    pharmacy={pharmacy}
                />
                <BioverseSnackbarMessage
                    color={snackbarType}
                    open={openSnackBar}
                    setOpen={setOpenSnackbar}
                    message={snackbarMessage}
                />
            </div>
        </div>
    );
}
