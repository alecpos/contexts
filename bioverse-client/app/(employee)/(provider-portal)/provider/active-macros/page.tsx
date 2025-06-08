'use server';

import AllPatientsPageContainer from '@/app/components/provider-coordinator-shared/all-patients/components/page-container';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { verifyUserPermission } from '@/app/utils/actions/auth/authorization';
import { redirect } from 'next/navigation';
import ActiveMacrosClientComponent from '@/app/components/provider-portal/active-macros/active-macros-component';
import { prodcutMacroMapping } from '@/app/components/provider-portal/intake-view/v2/components/containers/utils/post-prescribe-macro-selector/post-prescribe-macro-selector'
import { createSupabaseServiceClient } from '@/app/utils/clients/supabaseServerClient';

interface Props {}



async function getMacroName(macroId: number) {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
        .from('macros')
        .select('*')
        .eq('id', macroId)

    if (error) {
        return { error };
    }

    return data 
}

export default async function ActiveMacrosPage({}: Props) {
    const role_data = await verifyUserPermission(BV_AUTH_TYPE.ADMIN);

    if (!role_data.access_granted) {
        return redirect('/');
    }

    const mappedMacros = await Promise.all(
        Object.entries(prodcutMacroMapping).map(async ([product, macroValues]) => {
            const macroNames = await Promise.all(
                Object.values(macroValues).map(async (macroId) => await getMacroName(macroId))
            );
            return { [product]: new Set(macroNames) };
        })
    );

    let macros: {
        [key: string]: { //category
            [key: string]: any; //macro name : macroid
        };
    } = {};

    for (const macroObj of mappedMacros) {
        for (const [category, valueSet] of Object.entries(macroObj)) {
          if (!macros[category]) {
            macros[category] = {}; // Initialize the category if not exists
          }
      
          for (const obj of valueSet) {
            if (Array.isArray(obj) && obj[0]) {
              macros[category][obj[0].name] = obj[0].macroHtml; // Assign macro name to id
            }
          }
        }
      }


    return (
        <>
            <ActiveMacrosClientComponent 
                macros={macros}
            />
        </>
    );
}