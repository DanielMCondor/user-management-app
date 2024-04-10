import { Typography, TextField, Button } from '@mui/material';
import { useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

import { StyledLoadder } from 'components/loader';
import { useLoginMutation } from './user-login-mutation';
import { loginSchema } from './login-schema';
import { IInputs } from './login-page.interfaces';

export function LoginPage() {
    const mutation = useLoginMutation();
    const { register, handleSubmit, formState: { errors } } = useForm<IInputs>({
        resolver: yupResolver(loginSchema)
    });

    const onSubmit: SubmitHandler<IInputs> = async ({ email, password }) => {
        mutation.mutate({email, password});
    };
    
    return (
        <>
            <Typography component="h1">Login</Typography>
            
            {mutation.isLoading && (
                <StyledLoadder role="progressbar" aria-label="loading"><h3>loading</h3></StyledLoadder>
            )}

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

                <Button disabled={mutation.isLoading} type="submit">submit</Button>
            </form>

        </>
    );
}