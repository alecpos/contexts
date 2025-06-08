interface ProvidersSBR {
    id: string;
    created_at: string;
    dose_spot_clinicain_id: string;
    name: string;
    role: string;
    profile_picture_url: string;
    licensed_states: string[];
    turnaround_time: number;
    dose_spot_clinician_id_v2: string;
    credentials: string;
    intake_counter: number;
}

interface Provider {
    id: string;
    created_at: string;
    dose_spot_clinicain_id: string;
    name: string;
    role: string;
    profile_picture_url: string;
}
