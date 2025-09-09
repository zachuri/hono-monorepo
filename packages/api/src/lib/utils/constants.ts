import { createMessageObjectSchema } from '../openapi/schemas';
import * as HttpStatusPhrases from './http-status-phrases';

export const ZOD_ERROR_MESSAGES = {
	REQUIRED: 'Required',
	EXPECTED_NUMBER: 'Expected number, received nan',
	NO_UPDATES: 'No updates provided',
};

export const ZOD_ERROR_CODES = {
	INVALID_UPDATES: 'invalid_updates',
};

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
