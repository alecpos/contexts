interface DosageCadenceEquivalence {
    [key: string]: number;
}

interface DosageChangeEquivalenceMap {
    //product href
    [key: string]: {
        //DosageChangeEquivalenceCodes
        [key: string]: DosageCadenceEquivalence;
    };
}
