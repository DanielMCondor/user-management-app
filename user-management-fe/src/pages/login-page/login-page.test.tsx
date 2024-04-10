import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';

import { renderWithProviders } from 'mocks/render-with-providers';
import { server } from 'mocks/server';
import { LoginPage } from './login-page';


const getSubmitBtn = () => screen.getByRole('button', {name: /submit/i})

const getEmailLabel = () => screen.getByLabelText(/email/i);
const getPasswordLabel = () => screen.getByLabelText(/password/i);

const mockServerWithError = (statusCode: number) => server.use(
    rest.post('/login', (req, res, ctx) => res(ctx.delay(2), ctx.status(statusCode)))
);

const fillAndSendLoginForm = async () => {
    await userEvent.type(getEmailLabel(), 'daniel.soft@gmail.com');
    await userEvent.type(getPasswordLabel(), '123');
    await userEvent.click(getSubmitBtn());    
};

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

    await fillAndSendLoginForm();
    
    await waitFor(() => expect(getSubmitBtn()).toBeDisabled());
});

test('it should show a loading indicator while is fetching the login', async () => {
    renderWithProviders(<LoginPage />);

    const notloading = screen.queryByRole('progressbar', {name: /loading/i});
    expect(notloading).not.toBeInTheDocument();

    await fillAndSendLoginForm();

    const loading = await screen.findByRole('progressbar', {name: /loading/i});
    expect(loading).toBeInTheDocument();
});

test('it should display "Unexpected error, please try again" when there is an error from the api login', async () => {
    mockServerWithError(500);
    renderWithProviders(<LoginPage />);

    await fillAndSendLoginForm();

    const message = await screen.findByText('Unexpected error, please try again');
    expect(message).toBeInTheDocument();
});

test('it should display "The email or password are not correct" when the credentials are invalid', async () => {
    mockServerWithError(401);
    renderWithProviders(<LoginPage />);

    await fillAndSendLoginForm();

    const message = await screen.findByText('The email or password are not correct');
    expect(message).toBeInTheDocument();
});