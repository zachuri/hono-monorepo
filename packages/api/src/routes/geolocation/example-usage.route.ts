import type { AppRouteHandler } from '@acme/api/types/app-context';
import { createRoute, z } from '@hono/zod-openapi';

const exampleResponseSchema = z.object({
	message: z.string(),
	userIP: z.string().nullable(),
	userLocation: z.object({
		city: z.string().nullable(),
		country: z.string().nullable(),
		timezone: z.string().nullable(),
	}),
	cloudflareData: z.object({
		colo: z.string().nullable(),
		asn: z.number().nullable(),
		asOrganization: z.string().nullable(),
	}),
});

const exampleUsageRoute = createRoute({
	method: 'get',
	path: '/geolocation/example',
	tags: ['Geolocation'],
	summary: 'Example usage of geolocation service',
	description: 'Demonstrates how to use the geolocation service in your routes',
	responses: {
		200: {
			content: {
				'application/json': {
					schema: exampleResponseSchema,
				},
			},
			description: 'Example geolocation usage',
		},
	},
});

const exampleUsageHandler: AppRouteHandler<typeof exampleUsageRoute> = c => {
	const geolocation = c.get('geolocation');
	const data = geolocation.getGeolocation();

	return c.json({
		message: 'This is an example of how to use the geolocation service',
		userIP: data.ip,
		userLocation: {
			city: data.city,
			country: data.country,
			timezone: data.timezone,
		},
		cloudflareData: {
			colo: data.colo,
			asn: data.asn,
			asOrganization: data.asOrganization,
		},
	});
};

export default exampleUsageRoute;
export { exampleUsageHandler };
