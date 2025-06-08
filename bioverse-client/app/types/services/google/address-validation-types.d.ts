interface ComponentName {
    text: string;
    languageCode?: string;
}

interface AddressComponent {
    componentName: ComponentName;
    componentType: string;
    confirmationLevel: string;
    inferred?: boolean;
}

interface PostalAddress {
    regionCode: string;
    languageCode: string;
    postalCode: string;
    administrativeArea: string;
    locality: string;
    addressLines: string[];
}

interface Address {
    formattedAddress: string;
    postalAddress: PostalAddress;
    addressComponents: AddressComponent[];
    unconfirmedComponentTypes: string[];
}

interface Location {
    latitude: number;
    longitude: number;
}

interface Bounds {
    low: Location;
    high: Location;
}

interface Geocode {
    location: Location;
    plusCode: { globalCode: string };
    bounds: Bounds;
    placeId: string;
    placeTypes: string[];
}
interface Metadata {
    business: boolean;
    poBox: boolean;
    residential: boolean;
}

interface USPSData {
    standardizedAddress: StandardizedAddress;
    dpvConfirmation: string;
    dpvFootnote: string;
    carrierRouteIndicator: string;
    postOfficeCity: string;
    postOfficeState: string;
    fipsCountyCode: string;
    county: string;
    dpvEnhancedDeliveryCode: string;
}

interface Result {
    verdict: Verdict;
    address: Address;
    geocode: Geocode;
    metadata:Metadata;
    uspsData: USPSData;
}

interface AddressVerificationRequest {
    data: {
        result: Result;
        responseId: string;
    };
}

interface Verdict {
    inputGranularity: ValidationResult;
    validationGranularity: Granularity;
    geocodeGranularity: Granularity;
    addressComplete: boolean;
    hasUnconfirmedComponents: boolean;
    hasInferredComponents: boolean;
}

enum Granularity {
    GRANULARITY_UNSPECIFIED = 'GRANULARITY_UNSPECIFIED',
    SUB_PREMISE = 'SUB_PREMISE',
    PREMISE = 'PREMISE',
    PREMISE_PROXIMITY = 'PREMISE_PROXIMITY',
    BLOCK = 'BLOCK',
    ROUTE = 'ROUTE',
    OTHER = 'OTHER',
}

enum ValidationLevel {
    FIX_ADDRESS,
    CONFIRM_ADDRESS,
}

interface StandardizedAddress {
    firstAddressLine: string;
    cityStateZipAddressLine: string;
    city: string;
    state: string;
    zipCode: string;
}

interface ResponsePayload {
    standardizedAddress: StandardizedAddress;
    responseId: string;
    isPoBox:boolean;
}

interface AddressValidationResponse {
    success: boolean;
    data?: ResponsePayload;
}
