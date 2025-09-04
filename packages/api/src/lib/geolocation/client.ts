import type { GeolocationData } from './types';

/**
 * Client-side utility to fetch geolocation data from the API
 */
export async function fetchGeolocationData(apiBaseUrl: string): Promise<GeolocationData> {
	const response = await fetch(`${apiBaseUrl}/geolocation`, {
		method: 'GET',
		credentials: 'include', // Include cookies for authentication
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch geolocation data: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Client-side utility to get IP address only
 */
export async function fetchIPAddress(apiBaseUrl: string): Promise<string | null> {
	const data = await fetchGeolocationData(apiBaseUrl);
	return data.ip;
}
