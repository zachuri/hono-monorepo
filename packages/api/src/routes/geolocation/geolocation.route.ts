import * as HttpStatusCodes from '@acme/api/lib/http-status-codes';
import jsonContent from '@acme/api/lib/openapi/helpers/json-content';
import { notFoundSchema } from '@acme/api/lib/zod';
import { createRoute, z } from '@hono/zod-openapi';

const tags = ['Geolocation'];

// Schema for geolocation response
export const geolocationResponseSchema = z.object({
	ip: z.string().nullable(),
	city: z.string().nullable(),
	country: z.string().nullable(),
	region: z.string().nullable(),
	regionCode: z.string().nullable(),
	timezone: z.string().nullable(),
	latitude: z.number().nullable(),
	longitude: z.number().nullable(),
	colo: z.string().nullable(),
	asn: z.number().nullable(),
	asOrganization: z.string().nullable(),
	continent: z.string().nullable(),
	postalCode: z.string().nullable(),
	metroCode: z.string().nullable(),
	isEUCountry: z.boolean().nullable(),
});

// Get current location route
export type GetCurrentLocationRoute = typeof getCurrentLocation;

export const getCurrentLocation = createRoute({
	path: '/geolocation',
	method: 'get',
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(geolocationResponseSchema, 'Current location data'),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Location not found'),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(notFoundSchema, 'User not authenticated'),
	},
});
