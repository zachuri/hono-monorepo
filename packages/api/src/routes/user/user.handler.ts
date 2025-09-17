import type { AppRouteHandler } from '@acme/api/lib/app-context';
import * as HttpStatusCodes from '@acme/api/lib/http-status-codes';
import * as HttpStatusPhrases from '@acme/api/lib/http-status-phrases';
import type { GetUserAccountsRoute, GetUserRoute, GetUserSessionRoute } from './user.route';

export const getUser: AppRouteHandler<GetUserRoute> = async c => {
	const user = c.get('user');
	if (!user) {
		return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
	}

	return c.json(user, HttpStatusCodes.OK);
};

export const getUserSession: AppRouteHandler<GetUserSessionRoute> = async c => {
	const session = c.get('session');

	if (!session) {
		return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
	}

	return c.json(session, HttpStatusCodes.OK);
};

export const getUserAccounts: AppRouteHandler<GetUserAccountsRoute> = async c => {
	const db = c.get('db');
	const user = c.get('user');
	const session = c.get('session');

	if (!user || !session) {
		return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
	}

	const accounts = await db.query.account.findMany({
		columns: { providerId: true },
		where: (accounts, { eq }) => eq(accounts.userId, user.id),
	});

	if (!accounts) {
		return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
	}

	return c.json(accounts, HttpStatusCodes.OK);
};
