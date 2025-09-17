import {
	getUserAccountsSchema,
	getUserSchema,
	getUserSessionSchema,
} from '@acme/api/db/auth.schema';
import * as HttpStatusCodes from '@acme/api/lib/http-status-codes';
import jsonContent from '@acme/api/lib/openapi/helpers/json-content';
import { notFoundSchema } from '@acme/api/lib/zod';
import { createRoute, z } from '@hono/zod-openapi';

const tags = ['User'];

export const getUser = createRoute({
	path: '/user',
	method: 'get',
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(getUserSchema, 'The requested user'),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'User not found'),
	},
});

export const getUserSession = createRoute({
	path: '/user/session',
	method: 'get',
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(getUserSessionSchema, 'The requested session'),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Session not found'),
	},
});

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
