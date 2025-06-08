// Utils for Google Maps Address Verificaitons

export const determineAddressValidationLevel = (
    verdict: Verdict,
): ValidationLevel => {
    // 1. Determine if needs to FIX ADDRESS

    if (verdict.validationGranularity === 'OTHER' || !verdict.addressComplete) {
        return 0;
    }

    // TODO: Provide more in depth feedback about incorrect address

    return 1;
};

export const determineIsPoBox = (
    metadata: Metadata,
): boolean => {
    if (
        metadata && metadata.poBox
    ) {
        return true;
    }

    return false;
};
