import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { LoginPage } from './login-page';

const getSubmitBtn = () => screen.getByRole(/button/i, {name: /submit/i});
const getEmailLabel = () => screen.getByLabelText(/email/i);
const getPasswordLabel = () => screen.getByLabelText(/password/i);

test('it should render the login title', () => {
    render(<LoginPage />);
    const result = screen.getByRole('heading', {name: /login/i});
    expect(result).toBeInTheDocument();
});

test('it should render the form elements', () => {
    render(<LoginPage />);

    expect(getEmailLabel()).toBeInTheDocument();
    expect(getPasswordLabel()).toBeInTheDocument();
    expect(getSubmitBtn()).toBeInTheDocument();
});

test('it should validate the inputs as required', async() => {
    render(<LoginPage />);
    userEvent.click(getSubmitBtn());
    
    const emailRequired = await screen.findByText(/The email is required/i);
    const passwordRequired = await screen.findByText(/The password is required/i);
    expect(emailRequired).toBeInTheDocument();
    expect(passwordRequired).toBeInTheDocument();
});

test('it should validate the email format', async () => {
    render(<LoginPage />);

    userEvent.type(getEmailLabel(), 'invalid email');
    userEvent.click(getSubmitBtn());

    const emailInvalid = await screen.findByText(/The email is not valid/i);
    expect(emailInvalid).toBeInTheDocument();
});