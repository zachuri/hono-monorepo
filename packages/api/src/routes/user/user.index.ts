import { createRouter } from '@acme/api/lib/create-app';
import * as handlers from './user.handler';
import * as routes from './user.route';

const router = createRouter().openapi(routes.getUserAccounts, handlers.getUserAccounts);

export default router;
