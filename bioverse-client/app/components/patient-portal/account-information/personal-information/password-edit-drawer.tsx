import BioType from '@/app/components/global-components/bioverse-typography/bio-type/bio-type';
import {
    Alert,
    Button,
    CircularProgress,
    FormControl,
    Snackbar,
    TextField,
    useMediaQuery,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { changeUserPassword } from '@/app/utils/actions/membership/membership-portal-actions';
import DrawerConfirmationSuccess from './components/DrawerConfirmationSuccess';

interface Props {
    togglePasswordEditDrawer: () => void;
    userID: string | undefined;
    userEmail: string | undefined;
    setPasswordEditDrawer: Dispatch<SetStateAction<boolean>>;
}

export default function PasswordEditDrawer({
    togglePasswordEditDrawer,
    userID,
    userEmail,
    setPasswordEditDrawer,
}: Props) {
    const [screen, setScreen] = useState<number>(0);
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [successAlertOpen, setSuccessAlertOpen] = useState(false);
    const [errorAlertOpen, setErrorAlertOpen] = useState(false);

    //check for if the screen is mobile
    const isNotMobile = useMediaQuery('(min-width:640px)');

    const handleClose = () => {
        togglePasswordEditDrawer();
    };

    const handleCloseSuccessAlert = () => {
        setSuccessAlertOpen(false);
    };

    const handleCloseErrorAlert = () => {
        setErrorAlertOpen(false);
    };

    const handlePasswordInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { id, value } = event.target;

        switch (id) {
            case 'previous_password':
                setOldPassword(value);
                break;
            case 'new_password':
                setNewPassword(value);
                break;
            case 'confirm_new_password':
                setNewPasswordConfirm(value);
                break;
        }
    };

    const handleSubmitPasswordChange = async () => {
        setIsLoading(true);
        setErrorMessage(null);

        if (newPassword !== newPasswordConfirm) {
            setErrorMessage('The new passwords you have input do not match.');
            setIsLoading(false);
            return;
        }

        if (!userEmail) {
            setErrorAlertOpen(true);
            setIsLoading(false);
            return;
        }

        const resultMessage = await changeUserPassword(
            oldPassword,
            newPassword,
            userEmail
        );

        if (resultMessage === 'new_password_issue') {
            setErrorMessage('There was an issue with changing your password.');
            setErrorAlertOpen(true);
        }

        if (resultMessage === 'success') {
            setIsLoading(false);
            setScreen(1);
        }

        setIsLoading(false);
    };

    return (
        <div className='w-full'>
            <div
                className='flex justify-end items-center h-[50px] px-6'
                onClick={handleClose}
            >
                <BioType className='body1 text-[14px] cursor-pointer'>
                    CLOSE
                </BioType>
                <CloseIcon
                    sx={{
                        fontSize: 24,
                        color: '#1B1B1B8F',
                        cursor: 'pointer',
                    }}
                />
            </div>
            <div className='w-full h-[1px] bg-[#1B1B1B1F]'></div>

            <div className='flex flex-col w-[90%] mx-auto'>
                {screen === 0 ? (
                    <>
                        {' '}
                        <div className='mb-4 mt-6'>
                            <BioType className='h6 text-[24px] text-black'>
                                Change Password
                            </BioType>
                        </div>
                        <div className='flex flex-col gap-2 w-full space-y-4'>
                            {/* <FormControl className="gap-4">
                        <TextField
                            id="previous_password"
                            label="Previous Password"
                            type="password"
                            value={oldPassword}
                            variant="standard"
                            onChange={handlePasswordInputChange}
                        />
                    </FormControl> */}

                            <FormControl>
                                <TextField
                                    id='new_password'
                                    label='New Password'
                                    type='password'
                                    value={newPassword}
                                    onChange={handlePasswordInputChange}
                                />
                            </FormControl>

                            <FormControl>
                                <TextField
                                    id='confirm_new_password'
                                    label='Confirm New Password'
                                    type='password'
                                    value={newPasswordConfirm}
                                    onChange={handlePasswordInputChange}
                                />
                            </FormControl>
                        </div>
                        <div
                            id='action-button-container'
                            className='mt-4 flex flex-col space-y-4'
                        >
                            <Button
                                onClick={handleSubmitPasswordChange}
                                fullWidth
                                sx={{ height: 52 }}
                                variant='contained'
                            >
                                {isLoading ? (
                                    <CircularProgress
                                        size={22}
                                        sx={{ color: 'white' }}
                                    />
                                ) : (
                                    <BioType className='body1 text-[16px] text-white'>
                                        CHANGE PASSWORD
                                    </BioType>
                                )}
                            </Button>
                            <Button
                                variant='outlined'
                                fullWidth
                                sx={{ height: 52 }}
                                onClick={() => togglePasswordEditDrawer()} // Save button now triggers validation
                            >
                                <BioType className='body1 text-[16px] text-[#286BA2]'>
                                    CANCEL
                                </BioType>
                            </Button>
                        </div>
                        {errorMessage && (
                            <div className='body1 text-red-600 mt-2 flex justify-end'>
                                {errorMessage}
                            </div>
                        )}
                        <Snackbar
                            open={successAlertOpen}
                            autoHideDuration={6000}
                            onClose={handleCloseSuccessAlert}
                        >
                            <Alert
                                onClose={handleCloseSuccessAlert}
                                severity='success'
                                sx={{ width: '100%' }}
                            >
                                Your account information has been updated.
                            </Alert>
                        </Snackbar>
                        <Snackbar
                            open={errorAlertOpen}
                            autoHideDuration={6000}
                            onClose={handleCloseErrorAlert}
                        >
                            <Alert
                                onClose={handleCloseErrorAlert}
                                severity='error'
                                sx={{ width: '100%' }}
                            >
                                There was an issue with updating your account.
                                Please try again later.
                            </Alert>
                        </Snackbar>
                    </>
                ) : (
                    <DrawerConfirmationSuccess
                        buttonText='Continue to Profile'
                        message='Thank you! Your password has been successfully updated.'
                        setOpenDrawer={setPasswordEditDrawer}
                    />
                )}
            </div>
        </div>
    );
}
