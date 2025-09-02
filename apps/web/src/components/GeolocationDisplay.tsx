'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@acme/ui/components/ui/card';
import { useGeolocation } from '@/lib/hooks/use-geolocation';

export function GeolocationDisplay() {
	const { data, loading, error } = useGeolocation();

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>📍 Location Information</CardTitle>
					<CardDescription>Fetching your location data...</CardDescription>
				</CardHeader>
				<CardContent className='space-y-2'>
					<div className='h-4 w-full bg-gray-200 rounded animate-pulse' />
					<div className='h-4 w-3/4 bg-gray-200 rounded animate-pulse' />
					<div className='h-4 w-1/2 bg-gray-200 rounded animate-pulse' />
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>📍 Location Information</CardTitle>
					<CardDescription>Unable to fetch location data</CardDescription>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-red-600'>{error}</p>
				</CardContent>
			</Card>
		);
	}

	if (!data) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>📍 Location Information</CardTitle>
					<CardDescription>No location data available</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>📍 Location Information</CardTitle>
				<CardDescription>Your current location based on Cloudflare's network</CardDescription>
			</CardHeader>
			<CardContent className='space-y-2'>
				<div className='grid grid-cols-2 gap-4 text-sm'>
					<div>
						<span className='font-medium'>Country:</span>
						<p className='text-muted-foreground'>{data.country}</p>
					</div>
					<div>
						<span className='font-medium'>Region:</span>
						<p className='text-muted-foreground'>
							{data.region} ({data.regionCode})
						</p>
					</div>
					<div>
						<span className='font-medium'>City:</span>
						<p className='text-muted-foreground'>{data.city}</p>
					</div>
					<div>
						<span className='font-medium'>Timezone:</span>
						<p className='text-muted-foreground'>{data.timezone}</p>
					</div>
					<div>
						<span className='font-medium'>Coordinates:</span>
						<p className='text-muted-foreground'>
							{data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
						</p>
					</div>
					<div>
						<span className='font-medium'>Cloudflare Colo:</span>
						<p className='text-muted-foreground'>{data.colo}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
