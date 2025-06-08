import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { Button, IconButton, Paper, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MacrosTiptap from './macros-tiptap';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import TagManagerDialog from './dialog-menu/tag-manager-dialog';
import { KeyedMutator, MutatorCallback, MutatorOptions } from 'swr';
import { BV_AUTH_TYPE } from '@/app/types/auth/authorization-types';
import { verifyUserPermission } from '@/app/utils/actions/auth/authorization';

const MacroView = ({
    macroContent,
    macroId,
    macroTags,
    mutateMacroList,
}: {
    macroContent: string;
    macroId: string | number;
    macroTags: string[];
    mutateMacroList: KeyedMutator<{
        macros: MacrosSBR[];
        categories: any[];
    } | null>;
}) => {
    const [tagManagerOpen, setTagManagerOpen] = useState<boolean>(false);
    const [userIsLeadProvider, setUserIsLeadProvider] =
        useState<boolean>(false);

    useEffect(() => {
        const checkPermission = async () => {
            const result = await verifyUserPermission(
                BV_AUTH_TYPE.LEAD_PROVIDER
            );

            if (result.access_granted) {
                setUserIsLeadProvider(true);
            }
        };
        checkPermission();
    }, []);

    useEffect(() => {
        console.log('tagManagerOpen state changed: ', tagManagerOpen);
    }, [tagManagerOpen]);

    return (
        <Paper className='flex flex-col self-center w-full py-2  overflow-y-scroll min-h-[90%] h-full ' style={{boxShadow: 'none'}}>
            <div className='right-align w-full flex justify-end '>
                {userIsLeadProvider && macroContent && (
                    <>
                        <Tooltip title='Manage Tags'>
                            <IconButton
                                onClick={() => {
                                    setTagManagerOpen(true);
                                }}
                            >
                                <LocalOfferOutlinedIcon color='primary' />
                            </IconButton>
                        </Tooltip>
                        <TagManagerDialog
                            open={tagManagerOpen}
                            onClose={() => {
                                setTagManagerOpen(false);
                            }}
                            macroId={macroId}
                            mutateMacroList={mutateMacroList}
                            tags={macroTags}
                        />
                    </>
                )}
            </div>
            <BioType className='provider-tabs-macro-title text-weak pl-1'>
                {macroContent ? (
                    <MacrosTiptap content={macroContent} />
                ) : (
                    'Select a template to preview.'
                )}
            </BioType>
        </Paper>
    );
};

export default MacroView;
