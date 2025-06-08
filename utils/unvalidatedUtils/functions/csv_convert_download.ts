export function convertToCSV(
    data: any[],
    excludeColumns: string[] = []
): string {
    if (!data || data.length === 0) return '';

    const allHeaders = Object.keys(data[0]);
    const headers = allHeaders.filter(
        (header) => !excludeColumns.includes(header)
    );

    const csvRows = [
        headers.join(','),
        ...data.map((row) =>
            headers.map((header) => JSON.stringify(row[header] ?? '')).join(',')
        ),
    ];

    return csvRows.join('\n');
}

export function downloadCSV(
    data: any[],
    filename: string,
    excludeColumns: string[] = []
): void {
    const csvContent = convertToCSV(data, excludeColumns);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
