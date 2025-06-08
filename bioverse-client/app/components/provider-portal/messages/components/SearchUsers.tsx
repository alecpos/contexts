import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import { UserMessage } from '@/app/types/provider-portal/messages/message-types';
import { TextField } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';

interface SearchUsersProps {
    availableUsers: UserMessage[];
    selectedUser: UserMessage;
    setSelectedUser: Dispatch<SetStateAction<UserMessage>>;
}

export default function SearchUsers({
    availableUsers,
    selectedUser,
    setSelectedUser,
}: SearchUsersProps) {
    const [search, setSearch] = useState('');

    // State to manage the filtered list of users
    const [filteredUsers, setFilteredUsers] = useState(availableUsers);

    // Function to filter users based on the search input
    const handleSearch = (event: any) => {
        const keyword = event.target.value;
        if (keyword !== '') {
            const results = availableUsers.filter((user: UserMessage) =>
                `${user.first_name} ${user.last_name} ${user.email} ${user.user_id}`
                    .toLowerCase()
                    .includes(keyword.toLowerCase())
            );
            setFilteredUsers(results);
        } else {
            setFilteredUsers(availableUsers);
        }
        setSearch(keyword);
    };
    return (
        <div className='w-full mt-4 flex flex-col '>
            <TextField
                type='search'
                value={search}
                onChange={handleSearch}
                label='Search Users'
                variant='outlined'
                fullWidth
            />
            <div className='flex flex-col'>
                {filteredUsers.map((user: UserMessage, index: number) => (
                    <div
                        key={index}
                        className={`w-full min-h-[50px] flex flex-col space-y-2 border-b border-l-0 border-r-0 border-solid border-gray-800 py-4 px-2 ${
                            index === 0 ? 'border-t' : 'border-t-0'
                        }  cursor-pointer ${
                            selectedUser.user_id === user.user_id
                                ? 'bg-[#CEE1F1]'
                                : 'hover:bg-[#286aa21a]'
                        }`}
                        onClick={() => setSelectedUser(user)}
                    >
                        <BioType className='body1 text-[18px]'>
                            {user.first_name} {user.last_name}
                        </BioType>
                        <BioType className='body1 text-[16px] text-gray-400'>
                            {user.email}
                        </BioType>
                    </div>
                ))}
            </div>
        </div>
    );
}
