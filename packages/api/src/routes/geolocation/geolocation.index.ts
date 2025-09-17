import { createRouter } from '@acme/api/lib/create-app';
import * as handlers from './geolocation.handler';
import * as routes from './geolocation.route';

const router = createRouter().openapi(routes.getCurrentLocation, handlers.getCurrentLocation);

export default router;
