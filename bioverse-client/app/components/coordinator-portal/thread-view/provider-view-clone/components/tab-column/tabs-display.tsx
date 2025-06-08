import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface TabColumnProps {
    tabSelected: string;
    setTabSelected: React.Dispatch<React.SetStateAction<string>>;
}
const TabsDisplay = ({ tabSelected, setTabSelected }: TabColumnProps) => {
    const commonTabStyle = {
        borderBottom: '1.2px solid #e4e4e4',
        fontFamily: 'Inter Regular',
        fontSize: '14px',
    };

    return (
        <div className="flex w-full inter-basic py-1">
            <Tabs
                variant="fullWidth"
                className="flex-grow"
                value={tabSelected}
                textColor="inherit"
                aria-label="secondary tabs example"
                TabIndicatorProps={{
                    style: {
                        display: 'none',
                    },
                }}
            >
                <Tab
                    value="messages"
                    label={
                        <span
                            style={{
                                textDecoration:
                                    tabSelected === 'messages'
                                        ? 'underline'
                                        : 'none',
                                textUnderlineOffset: '4px',
                                color:
                                    tabSelected === 'messages'
                                        ? 'black'
                                        : 'inherit',
                                fontFamily: 'Inter Regular',
                                fontSize: '14px',
                            }}
                        >
                            Messages
                        </span>
                    }
                    onClick={() => {
                        setTabSelected('messages');
                    }}
                    className="flex-1 h-[17px] provider-tabs-display-title"
                    sx={{
                        ...commonTabStyle,
                        borderRight: '1px solid #BDBDBD',
                        textDecoration:
                            tabSelected === 'messages' ? 'underline' : 'none',
                        color: tabSelected === 'messages' ? 'black' : 'inherit',
                        textUnderlineOffset: '4px',
                    }}
                />
                <Tab
                    value="macros"
                    label={
                        <span
                            style={{
                                textDecoration:
                                    tabSelected === 'macros'
                                        ? 'underline'
                                        : 'none',
                                textUnderlineOffset: '4px',
                                color:
                                    tabSelected === 'macros'
                                        ? 'black'
                                        : 'inherit',
                                fontFamily: 'Inter Regular',
                                fontSize: '14px',
                            }}
                        >
                            Macros
                        </span>
                    }
                    onClick={() => {
                        setTabSelected('macros');
                    }}
                    className="flex-1 h-[17px] provider-tabs-display-title"
                    sx={{
                        ...commonTabStyle,
                        textDecoration:
                            tabSelected === 'macros' ? 'underline' : 'none',
                        color: tabSelected === 'macros' ? 'black' : 'inherit',
                        textUnderlineOffset: '4px',
                    }}
                />
            </Tabs>
        </div>
    );
};

export default TabsDisplay;
