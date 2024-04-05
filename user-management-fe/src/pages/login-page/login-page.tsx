import React, { useState } from 'react';
import axios from 'axios';
import { Typography, TextField, Button } from '@mui/material';
import { useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

import { loginSchema } from './login-schema';

interface IInputs {
    email: string;
    password: string;
}

const loginService = async (email: string, password: string) => {
    await axios.post('/login', {
        email,
        password
    });
}

export function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<IInputs>({
        resolver: yupResolver(loginSchema)
    });

    const onSubmit: SubmitHandler<IInputs> = async ({ email, password }) => {
        setIsLoading(true);
        await loginService(email, password);
    };
    
    return (
        <>
            <Typography component="h1">Login</Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField 
                    {...register("email", {required: true})}
                    label="Email"
                    helperText={errors.email?.message}
                />

                <TextField
                    {...register("password", {required: true})}
                    label="Password"
                    type="password"
                    helperText={errors.password?.message}
                />

                <Button disabled={isLoading} type="submit">submit</Button>
            </form>

        </>
    );
}