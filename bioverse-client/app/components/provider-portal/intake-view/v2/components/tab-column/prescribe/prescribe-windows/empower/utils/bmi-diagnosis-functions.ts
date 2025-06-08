export function getDiagnosisWithBMIData(bmi_data: any) {
    const bmi = bmi_data.bmi;

    if (bmi >= 40) {
        return { code: 'E66.01', description: 'Morbid Obesity' };
    } else if (bmi >= 30 && bmi < 40) {
        return { code: 'E66.9', description: 'Obesity' };
    } else if (bmi >= 25 && bmi < 30) {
        return { code: 'E66.3', description: 'Overweight' };
    } else if (bmi < 25) {
        return { code: '', description: '' };
    }
    return { code: '', description: '' };
}
