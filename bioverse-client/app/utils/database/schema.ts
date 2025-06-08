export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            prescriptions: {
                Row: {
                    benefits_long: Json | null;
                    benefits_short: Json | null;
                    biomarkers: Json | null;
                    category: Database['public']['Enums']['flow_type'] | null;
                    chips: string[] | null;
                    citations: Json | null;
                    created_at: string;
                    description_long: string | null;
                    description_short: string | null;
                    discountable: number | null;
                    faq_answers: string[] | null;
                    faq_questions: string[] | null;
                    hero_review: string | null;
                    href: string | null;
                    id: number;
                    image_ref: string[] | null;
                    instructions: string | null;
                    last_modified: string | null;
                    name: string;
                    price: number[] | null;
                    rating: number | null;
                    safety_information: string | null;
                    scientific_research: string | null;
                    seals: string[] | null;
                    type: Database['public']['Enums']['product_type'] | null;
                    variants: string[] | null;
                };
                Insert: {
                    benefits_long?: Json | null;
                    benefits_short?: Json | null;
                    biomarkers?: Json | null;
                    category?: Database['public']['Enums']['flow_type'] | null;
                    chips?: string[] | null;
                    citations?: Json | null;
                    created_at?: string;
                    description_long?: string | null;
                    description_short?: string | null;
                    discountable?: number | null;
                    faq_answers?: string[] | null;
                    faq_questions?: string[] | null;
                    hero_review?: string | null;
                    href?: string | null;
                    id?: number;
                    image_ref?: string[] | null;
                    instructions?: string | null;
                    last_modified?: string | null;
                    name: string;
                    price?: number[] | null;
                    rating?: number | null;
                    safety_information?: string | null;
                    scientific_research?: string | null;
                    seals?: string[] | null;
                    type?: Database['public']['Enums']['product_type'] | null;
                    variants?: string[] | null;
                };
                Update: {
                    benefits_long?: Json | null;
                    benefits_short?: Json | null;
                    biomarkers?: Json | null;
                    category?: Database['public']['Enums']['flow_type'] | null;
                    chips?: string[] | null;
                    citations?: Json | null;
                    created_at?: string;
                    description_long?: string | null;
                    description_short?: string | null;
                    discountable?: number | null;
                    faq_answers?: string[] | null;
                    faq_questions?: string[] | null;
                    hero_review?: string | null;
                    href?: string | null;
                    id?: number;
                    image_ref?: string[] | null;
                    instructions?: string | null;
                    last_modified?: string | null;
                    name?: string;
                    price?: number[] | null;
                    rating?: number | null;
                    safety_information?: string | null;
                    scientific_research?: string | null;
                    seals?: string[] | null;
                    type?: Database['public']['Enums']['product_type'] | null;
                    variants?: string[] | null;
                };
                Relationships: [];
            };
            supplements: {
                Row: {
                    benefits: Json | null;
                    created_at: string;
                    description: string | null;
                    id: number;
                    ingredients: Json | null;
                    instructions: string | null;
                    last_modified: string;
                    name: string;
                    price: number;
                    rating: number | null;
                    tags: Json | null;
                };
                Insert: {
                    benefits?: Json | null;
                    created_at?: string;
                    description?: string | null;
                    id?: number;
                    ingredients?: Json | null;
                    instructions?: string | null;
                    last_modified?: string;
                    name: string;
                    price?: number;
                    rating?: number | null;
                    tags?: Json | null;
                };
                Update: {
                    benefits?: Json | null;
                    created_at?: string;
                    description?: string | null;
                    id?: number;
                    ingredients?: Json | null;
                    instructions?: string | null;
                    last_modified?: string;
                    name?: string;
                    price?: number;
                    rating?: number | null;
                    tags?: Json | null;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            flow_type:
                | 'prescriptions'
                | 'supplements'
                | 'testkits'
                | 'consulting';
            product_type:
                | 'consultation'
                | 'cream'
                | 'injection'
                | 'patch'
                | 'pill'
                | 'powder'
                | 'spray'
                | 'testkit';
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
