export function getProviderNameFromId(provider_id: string | undefined): string {
    if (!provider_id) {
        return 'Not Tracked';
    }

    switch (provider_id) {
        case '025668ab-3f9e-4839-a0c5-75790305cfe9':
            return 'Nathan (Engineer)';
        case '1313a649-2299-4bd2-b584-eab040ce872f':
            return 'Olivier (Engineer)';
        case '24138d35-e26f-4113-bcd9-7f275c4f9a47':
            return 'Maylin Chen';
        case '28e2a459-2805-425f-96f3-a3d7f39c0528':
            return 'Kristin Curcio';
        case '3bc131b7-b978-4e21-8fbc-73809ee9fcce':
            return 'Lea Thomas';
        case '4122d7b8-fd9f-4605-a3e7-796b8be75fda':
            return 'Daniel Fortunato';
        case '6d920c41-4fa8-46c6-94f9-c97e6e3c5219':
            return 'Lara (Operations)';
        case '84e3e542-6dba-4826-9e64-fab60ac64eed':
            return 'Morgan Edwards';
        case 'e756658d-785d-46d5-85ab-22bf11256a59':
            return 'Customer Support';
        case 'c39ca73e-a750-4be1-a098-af7e6d72d508':
            return 'Kathy Agiri';
        case '9afc3d1d-a9d0-46aa-8598-d2ac3d6ab928':
            return 'Ben Hebert (Engineer)';
        case '7cf6a976-fce4-443e-be9c-f265adfb67e7':
            return 'Kayla Doran';
        case '4a1356ed-627e-4488-b085-2374099c4809':
            return 'Veronica Marshall';
        case '2585f937-4b9e-42c5-b0b3-1ea002fe64fd':
            return 'Angie Chang';
        case '14579c20-3bdd-40da-b490-6d3ffa1c2cbb':
            return 'Amanda Gaddis';
        default:
            return 'No Name, add to Clinical Note Provider Map';
    }
}
