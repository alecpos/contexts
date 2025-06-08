import {
    TextField,
    InputAdornment,
    IconButton,
    InputBase,
    Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
    handleSearch: (searchTerm: string) => void;
}

export default function ProviderSearchBar({ handleSearch }: SearchBarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Effect to focus the input field when it is expanded
    useEffect(() => {
        if (isExpanded) {
            inputRef.current?.focus(); // Focus the input field if isExpanded is true
        }
    }, [isExpanded]);

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        if (event.target.value.length > 0) {
            setIsExpanded(true);
        }
        handleSearch(event.target.value);
    };

    const handleBlur = () => {
        if (searchTerm.length === 0) {
            setIsExpanded(false);
        }
    };

    return (
        <Paper
            component='form'
            sx={{
                display: 'flex',
                alignItems: 'center',
                borderRadius: '20px',
                boxShadow: 'none',
                border: '1px solid #ced4da',
                maxWidth: isExpanded ? '30%' : '48px',
                width: '30%', // Adjust this if you need the unexpanded state to have a different width
                transition: 'max-width 0.3s ease-in-out',
                marginRight: '16px',
                marginTop: '16px',
                '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                },
                '& .MuiInputBase-root': {
                    marginRight: '8px',
                },
                '& .MuiInputBase-input': {
                    transition: 'width 0.3s ease-in-out',
                    width: isExpanded ? '100%' : 0,
                    '&:focus': {
                        width: '100%',
                    },
                },
            }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                className='body1'
                placeholder='Search patients by name or prescription'
                inputProps={{
                    'aria-label': 'search patients by name or prescription',
                }}
                startAdornment={
                    <InputAdornment position='end'>
                        <IconButton
                            aria-label='toggle search'
                            onClick={() => setIsExpanded(true)}
                            edge='start'
                        >
                            <SearchIcon />
                        </IconButton>
                    </InputAdornment>
                }
                autoFocus={isExpanded}
                inputRef={inputRef}
                onBlur={handleBlur}
                onChange={handleInput}
                value={searchTerm}
                fullWidth
            />
        </Paper>
    );
}
