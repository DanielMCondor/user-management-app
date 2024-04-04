import React from 'react';
import { Typography, TextField, Button } from '@mui/material';
import { useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

import { loginSchema } from './login-schema';



interface IInputs {
    email: string;
    password: string;
}

export function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<IInputs>({
        resolver: yupResolver(loginSchema)
    });

    const onSubmit: SubmitHandler<IInputs> = (data) => console.log(data)
    
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

                <Button type="submit">submit</Button>
            </form>

        </>
    );
}