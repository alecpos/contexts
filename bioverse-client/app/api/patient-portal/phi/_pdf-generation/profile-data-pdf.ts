export function generateProfileSectionHTML(
    profileData: any,
    fieldOrder: any[]
) {
    let htmlContent = '';
    fieldOrder.forEach((field) => {
        let value = '';
        switch (field.key) {
            case 'updated_at':
                const dateObj = new Date(profileData[0][field.key]);
                const formattedDate = dateObj.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                });
                const formattedTime = dateObj.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });
                value = `${formattedDate} ${formattedTime}`;
                break;
            case 'first_name':
                value = `${profileData[0].first_name} ${profileData[0].last_name}`;
                break;
            case 'last_name':
                // Skip last name as it's included in the full name
                break;
            case 'date_of_birth':
                value = profileData[0][field.key];
                break;
            case 'sex_at_birth':
                value = profileData[0][field.key];
                break;
            case 'address':
                value = `${profileData[0].address_line1}, ${profileData[0].address_line2}, ${profileData[0].city}, ${profileData[0].state} ${profileData[0].zip}`;
                break;
            default:
                value = profileData[0][field.key];
        }
        if (value !== '') {
            htmlContent += `<tr><td>${field.display}:</td><td>${JSON.stringify(
                value
            )}</td></tr>`;
        }
    });
    return htmlContent;
}
