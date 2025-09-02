'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth.client';

type GeolocationData = {
	timezone: string;
	city: string;
	country: string;
	region: string;
	regionCode: string;
	colo: string;
	latitude: number;
	longitude: number;
};

type GeolocationState = {
	data: GeolocationData | null;
	loading: boolean;
	error: string | null;
};

export function useGeolocation() {
	const [state, setState] = useState<GeolocationState>({
		data: null,
		loading: true,
		error: null,
	});

	useEffect(() => {
		const fetchGeolocation = async () => {
			try {
				setState(prev => ({ ...prev, loading: true, error: null }));

				const result = await authClient.cloudflare.geolocation();

				if (result.error) {
					setState(prev => ({
						...prev,
						loading: false,
						error: result.error.message || 'Failed to fetch geolocation data',
					}));
				} else if (result.data && !('error' in result.data)) {
					setState(prev => ({
						...prev,
						loading: false,
						data: result.data as unknown as GeolocationData,
					}));
				}
			} catch (err) {
				setState(prev => ({
					...prev,
					loading: false,
					error: err instanceof Error ? err.message : 'Unknown error occurred',
				}));
			}
		};

		fetchGeolocation();
	}, []);

	return state;
}
