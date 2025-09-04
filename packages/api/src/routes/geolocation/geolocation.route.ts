import type { AppRouteHandler } from '@acme/api/types/app-context';
import { createRoute, z } from '@hono/zod-openapi';

const geolocationResponseSchema = z.object({
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

const geolocationRoute = createRoute({
	method: 'get',
	path: '/geolocation',
	tags: ['Geolocation'],
	summary: 'Get geolocation data',
	description:
		'Returns geolocation data from Cloudflare including IP address, location, and other metadata',
	responses: {
		200: {
			content: {
				'application/json': {
					schema: geolocationResponseSchema,
				},
			},
			description: 'Geolocation data retrieved successfully',
		},
	},
});

const geolocationHandler: AppRouteHandler<typeof geolocationRoute> = c => {
	const geolocation = c.get('geolocation');
	const data = geolocation.getGeolocation();

	return c.json(data);
};

export default geolocationRoute;
export { geolocationHandler };
