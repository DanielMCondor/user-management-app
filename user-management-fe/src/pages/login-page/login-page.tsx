import React, { useState } from 'react';
import axios from 'axios';
import { 
    Typography,
    TextField,
    Button,
    Container,
    Box,
    Avatar,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

import { StyledLoadder } from 'components/loader';
import { useLoginMutation } from './user-login-mutation';
import { loginSchema } from './login-schema';
import { IInputs } from './login-page.interfaces';

export function LoginPage() {
    const [errorMessage, setErrorMessage] = useState('');
    const mutation = useLoginMutation();
    const { register, handleSubmit, formState: { errors } } = useForm<IInputs>({
        resolver: yupResolver(loginSchema)
    });

    const onSubmit: SubmitHandler<IInputs> = async ({ email, password }) => {
        mutation.mutate(
            {email, password},
            {
                onError: error => {
                    let internalErrorMessage = 'Unexpected error, please try again';
                    if (axios.isAxiosError(error) && error?.response?.status === 401) {
                        internalErrorMessage = 'The email or password are not correct';
                    }

                    setErrorMessage(internalErrorMessage);
                }
            }
        );
    };
    
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Avatar sx={{m:1, bgcolor: 'secondary.main'}}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>

                {mutation.isLoading && (
                    <StyledLoadder role="progressbar" aria-label="loading"><h3>loading</h3></StyledLoadder>
                )}

                {mutation.isError ? <Typography>{errorMessage}</Typography> : null}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 1}}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        {...register("email", {required: true})}
                        helperText={errors.email?.message}
                        error={!!errors.email}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        type="password"
                        {...register("password", {required: true})}
                        helperText={errors.password?.message}
                        error={!!errors.password}
                    />

                    <Button
                        disabled={mutation.isLoading}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        submit
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}