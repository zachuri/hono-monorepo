import { UNPROCESSABLE_ENTITY } from '@acme/api/lib/http-status-codes.js';
import type { Hook } from '@hono/zod-openapi';

const defaultHook: Hook<any, any, any, any> = (result, c) => {
	if (!result.success) {
		return c.json(
			{
				success: result.success,
				error: result.error,
			},
			UNPROCESSABLE_ENTITY,
		);
	}
};

export default defaultHook;
