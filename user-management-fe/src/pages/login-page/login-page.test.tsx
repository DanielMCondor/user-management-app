import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from 'mocks/render-with-providers';
import { LoginPage } from './login-page';


const getSubmitBtn = () => screen.getByRole('button', {name: /submit/i})
const getEmailLabel = () => screen.getByLabelText(/email/i);
const getPasswordLabel = () => screen.getByLabelText(/password/i);

test('it should render the login title', () => {
    renderWithProviders(<LoginPage />)
    const result = screen.getByRole('heading', {name: /login/i});
    expect(result).toBeInTheDocument();
});

test('it should render the form elements', () => {
    renderWithProviders(<LoginPage />)

    expect(getEmailLabel()).toBeInTheDocument();
    expect(getPasswordLabel()).toBeInTheDocument();
    expect(getSubmitBtn()).toBeInTheDocument();
});

test('it should validate the inputs as required', async() => {
    renderWithProviders(<LoginPage />)
    await userEvent.click(getSubmitBtn());
    
    const emailRequired = await screen.findByText(/The email is required/i);
    const passwordRequired = await screen.findByText(/The password is required/i);
    expect(emailRequired).toBeInTheDocument();
    expect(passwordRequired).toBeInTheDocument();
});

test('it should validate the email format', async () => {
    renderWithProviders(<LoginPage />)

    await userEvent.type(getEmailLabel(), 'invalid email');
    await userEvent.click(getSubmitBtn());

    const emailInvalid = await screen.findByText(/The email is not valid/i);
    expect(emailInvalid).toBeInTheDocument();
});

test('it should disable the submit button while is fetching', async () => {
    renderWithProviders(<LoginPage />)

    expect(getSubmitBtn()).not.toBeDisabled();

    await userEvent.type(getEmailLabel(), 'daniel.soft@gmail.com');
    await userEvent.type(getPasswordLabel(), '123');
    await userEvent.click(getSubmitBtn());
    
    await waitFor(() => expect(getSubmitBtn()).toBeDisabled());
});

test('it should show a loading indicator while is fetching the login', async () => {
    renderWithProviders(<LoginPage />);

    const notloading = screen.queryByRole('progressbar', {name: /loading/i});
    expect(notloading).not.toBeInTheDocument();

    await userEvent.type(getEmailLabel(), 'daniel.soft@gmail.com');
    await userEvent.type(getPasswordLabel(), '123');
    await userEvent.click(getSubmitBtn());

    const loading = await screen.findByRole('progressbar', {name: /loading/i});
    expect(loading).toBeInTheDocument();
});