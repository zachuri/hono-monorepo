import { createMessageObjectSchema } from '@acme/api/lib/openapi/schemas';
import type { ZodError } from 'zod';
import type { ErrorMessageOptions } from 'zod-error';
import { generateErrorMessage } from 'zod-error';
import * as HttpStatusPhrases from './http-status-phrases';

const zodErrorOptions: ErrorMessageOptions = {
	transform: ({ errorMessage, index }) => `Error #${index + 1}: ${errorMessage}`,
};

export const generateZodErrorMessage = (error: ZodError): string => {
	// Type assertion to handle Zod v4 compatibility with zod-error
	return generateErrorMessage(error.issues as any, zodErrorOptions);
};

export const ZOD_ERROR_MESSAGES = {
	REQUIRED: 'Required',
	EXPECTED_NUMBER: 'Expected number, received nan',
	NO_UPDATES: 'No updates provided',
};

export const ZOD_ERROR_CODES = {
	INVALID_UPDATES: 'invalid_updates',
};

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
