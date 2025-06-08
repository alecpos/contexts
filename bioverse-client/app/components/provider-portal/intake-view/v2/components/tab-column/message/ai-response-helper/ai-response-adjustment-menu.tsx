'use client';

import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import HorizontalDivider from '@/app/components/global-components/dividers/horizontalDivider/horizontalDivider';
import { Menu, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';

interface AiResponseAdjustmentMenuProps {
    open: boolean;
    handleClose: () => void;
    anchorEl: string;
    handleRevsion: (type: string, customString?: string) => void;
}

export default function AiResopnseAdjustmentMenu({
    open,
    handleClose,
    anchorEl,
    handleRevsion,
}: AiResponseAdjustmentMenuProps) {
    const [customRevisionText, setCustomRevisionText] = useState<
        string | undefined
    >(undefined);

    return (
        <>
            <Menu
                id='basic-menu'
                open={open}
                anchorEl={document.getElementById(anchorEl.slice(1))}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                slotProps={{
                    paper: {
                        style: {
                            width: '290px',
                            maxHeight: '292px',
                            backgroundColor: '#ffffff',
                            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                            borderRadius: '8px',
                            padding: '12px',
                            background: '#F6F9FB',
                        },
                    },
                }}
            >
                <BioType className='provider-message-tab-input-bar-text text-strong'>Adjust Tone</BioType>
                <MenuItem onClick={() => handleRevsion('empathetic')}>
                    <span className='provider-message-tab-input-bar-text'>😇 Make it empathetic</span>
                </MenuItem>
                <BioType className='provider-message-tab-input-bar-text text-strong'>Rewrite</BioType>
                <MenuItem onClick={() => handleRevsion('detailed')}>
                    <span className='provider-message-tab-input-bar-text'>🖼️ Make it mode detailed</span>
                </MenuItem>
                <div className='flex flex-col my-2 h-[1px]'>
                    <HorizontalDivider backgroundColor={'#DCDEE0'} height={1} />
                </div>
                <MenuItem onClick={() => handleRevsion('simplify')}>
                    <span className='provider-message-tab-input-bar-text'> 🧹 Simplify it</span>
                </MenuItem>
                <div className='flex flex-col my-2 h-[1px]'>
                    <HorizontalDivider backgroundColor={'#DCDEE0'} height={1} />
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleRevsion('custom', customRevisionText);
                    }}
                >
                    <TextField
                        fullWidth
                        value={customRevisionText}
                        onChange={(e) => setCustomRevisionText(e.target.value)}
                        label={<span className='provider-message-tab-input-bar-text'>Or enter a custom revision...</span>}
                        InputLabelProps={{
                            style: { color: '#9E9E9E', 

                            fontFamily: 'Inter Regular',
                            },
                            className: 'provider-message-tab-input-bar-text',
                        }}
                        className='provider-message-tab-input-bar-text'
                        inputProps={{
                            style: { color: '#989898', fontFamily: 'Inter Regular' },
                            className: 'provider-message-tab-input-bar-text',
                        }}

                        sx={{
                            '& .MuiInputBase-root': {
                                borderRadius: '12px',
                                paddingTop: '6px',
                             
                            },
                            
                        }}
                    />
                </form>
            </Menu>
        </>
    );
}
