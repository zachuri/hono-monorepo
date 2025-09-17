import { account } from '@acme/api/db/auth.schema';
import * as HttpStatusCodes from '@acme/api/lib/http-status-codes';
import jsonContent from '@acme/api/lib/openapi/helpers/json-content';
import { notFoundSchema } from '@acme/api/lib/zod';
import { createRoute, z } from '@hono/zod-openapi';
import { createSelectSchema } from 'drizzle-zod';

const tags = ['User'];

export const getUserAccountsSchema = createSelectSchema(account);

export type GetUserAccountsRoute = typeof getUserAccounts;

export const getUserAccounts = createRoute({
	path: '/user/accounts',
	method: 'get',
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			z.array(getUserAccountsSchema.pick({ providerId: true })),
			'The requested accounts',
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Session not found'),
	},
});
