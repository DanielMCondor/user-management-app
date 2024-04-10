import axios from 'axios';
import { useMutation } from 'react-query';

import { IInputs } from './login-page.interfaces';

const loginService = async (email: string, password: string): Promise<void> =>
    axios.post('/login', {
        email,
        password
    });

export const useLoginMutation = () => useMutation((payload: IInputs) => loginService(payload.email, payload.password));