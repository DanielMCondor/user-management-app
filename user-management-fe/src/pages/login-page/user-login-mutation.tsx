import axios from 'axios';
import { useMutation } from 'react-query';

import { IInputs } from './login-page.interfaces';

const baseUrl = 'http://localhost:8080';

const loginService = async (email: string, password: string): Promise<void> =>
    axios.post( `${baseUrl}/login`, {
        email,
        password
    });

export const useLoginMutation = () => useMutation((payload: IInputs) => loginService(payload.email, payload.password));