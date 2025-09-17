import { NOT_FOUND } from '@acme/api/lib/http-status-codes.js';
import { NOT_FOUND as NOT_FOUND_MESSAGE } from '@acme/api/lib/http-status-phrases.js';
import type { NotFoundHandler } from 'hono';

const notFound: NotFoundHandler = c => {
	return c.json(
		{
			message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`,
		},
		NOT_FOUND,
	);
};

export default notFound;
