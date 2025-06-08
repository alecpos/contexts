/**
 * MACROS type object for supabase.
 */

interface MacrosSBR {
    id?: number;
    responder?: string;
    category?: string;
    name?: string;
    macroText?: string;
    macroHtml?: string;
    contains_phi?: boolean;
    tags?: string[];
}
