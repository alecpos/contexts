type EmployeeMap = {
    [key: string]: string;
};

export const engineerMap: EmployeeMap = {
    Nathan: '025668ab-3f9e-4839-a0c5-75790305cfe9',
    Olivier: '1313a649-2299-4bd2-b584-eab040ce872f',
    Kevin: 'f001e774-7887-49f4-8950-d0651808a9f7',
};

export function getEmployeeIdByName(name: string): string | undefined {
    return engineerMap[name];
}

export function getEmployeeNameById(id: string): string | undefined {
    return Object.keys(engineerMap).find((key) => engineerMap[key] === id);
}
