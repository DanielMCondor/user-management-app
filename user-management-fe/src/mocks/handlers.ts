import { rest } from 'msw'

import { baseUrl } from 'config';

export const handlers = [
  rest.post(`${baseUrl}/login`, (req, res, ctx) => res(ctx.delay(2), ctx.status(200))),
]