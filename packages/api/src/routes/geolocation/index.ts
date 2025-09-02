import { createRouter } from '@acme/api/lib/create-app';
import exampleUsageRoute, { exampleUsageHandler } from './example-usage.route';
import geolocationRoute, { geolocationHandler } from './geolocation.route';

const geolocation = createRouter()
	.openapi(geolocationRoute, geolocationHandler)
	.openapi(exampleUsageRoute, exampleUsageHandler);

export default geolocation;
