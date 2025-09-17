'use client';

import { Button } from '@acme/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acme/ui/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api.client';
import { signOut, useSession } from '@/lib/auth.client';

type GeolocationData = {
	ip: string | null;
	city: string | null;
	country: string | null;
	region: string | null;
	regionCode: string | null;
	timezone: string | null;
	latitude: number | null;
	longitude: number | null;
	colo: string | null;
	asn: number | null;
	asOrganization: string | null;
	continent: string | null;
	postalCode: string | null;
	metroCode: string | null;
	isEUCountry: boolean | null;
};

export default function App() {
	const router = useRouter();
	const session = useSession();

	// Geolocation query
	const {
		data: geolocationData,
		isLoading: isGeolocationLoading,
		isError: isGeolocationError,
	} = useQuery({
		queryKey: ['geolocation'],
		queryFn: async () => {
			const response = await api.geolocation.$get();
			if (!response.ok) {
				throw new Error('Failed to fetch geolocation data');
			}
			return (await response.json()) as GeolocationData;
		},
	});

	// User accounts query
	const {
		data: userAccounts,
		isLoading: isUserLoading,
		isError: isUserError,
	} = useQuery({
		queryKey: ['user-accounts'],
		queryFn: async () => {
			const response = await api.user.accounts.$get();
			if (!response.ok) {
				throw new Error('Failed to fetch user accounts');
			}
			return await response.json();
		},
	});

	const user = session.data?.user;

	const handleSignOut = async () => {
		try {
			await signOut();
			router.push('/sign-in');
		} catch (error) {
			console.error('Sign out failed', error);
		}
	};

	const renderGeolocationTab = () => (
		<div className='space-y-4'>
			<h3 className='font-semibold text-xl'>Your Location Information</h3>
			{isGeolocationLoading && <p>Loading geolocation data...</p>}
			{isGeolocationError && <p className='text-red-500'>Failed to load geolocation data</p>}
			{geolocationData && (
				<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
					<Card>
						<CardHeader>
							<CardTitle>Location Details</CardTitle>
						</CardHeader>
						<CardContent className='space-y-2'>
							<div>
								<strong>IP Address:</strong> {geolocationData.ip || 'N/A'}
							</div>
							<div>
								<strong>City:</strong> {geolocationData.city || 'N/A'}
							</div>
							<div>
								<strong>Country:</strong> {geolocationData.country || 'N/A'}
							</div>
							<div>
								<strong>Region:</strong> {geolocationData.region || 'N/A'}
							</div>
							<div>
								<strong>Postal Code:</strong> {geolocationData.postalCode || 'N/A'}
							</div>
							<div>
								<strong>Timezone:</strong> {geolocationData.timezone || 'N/A'}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Coordinates</CardTitle>
						</CardHeader>
						<CardContent className='space-y-2'>
							<div>
								<strong>Latitude:</strong> {geolocationData.latitude || 'N/A'}
							</div>
							<div>
								<strong>Longitude:</strong> {geolocationData.longitude || 'N/A'}
							</div>
							<div>
								<strong>Continent:</strong> {geolocationData.continent || 'N/A'}
							</div>
							<div>
								<strong>EU Country:</strong> {geolocationData.isEUCountry ? 'Yes' : 'No'}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Network Information</CardTitle>
						</CardHeader>
						<CardContent className='space-y-2'>
							<div>
								<strong>Colo:</strong> {geolocationData.colo || 'N/A'}
							</div>
							<div>
								<strong>ASN:</strong> {geolocationData.asn || 'N/A'}
							</div>
							<div>
								<strong>AS Organization:</strong> {geolocationData.asOrganization || 'N/A'}
							</div>
							<div>
								<strong>Metro Code:</strong> {geolocationData.metroCode || 'N/A'}
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);

	const renderUserTab = () => (
		<div className='space-y-4'>
			<h3 className='font-semibold text-xl'>Your Account Information</h3>
			{isUserLoading && <p>Loading user data...</p>}
			{isUserError && <p className='text-red-500'>Failed to load user data</p>}
			{user && (
				<div className='space-y-4'>
					<Card>
						<CardHeader>
							<CardTitle>Profile Information</CardTitle>
						</CardHeader>
						<CardContent className='space-y-2'>
							<div>
								<strong>Email:</strong> {user.email}
							</div>
							<div>
								<strong>Name:</strong> {user.name || 'N/A'}
							</div>
							<div>
								<strong>ID:</strong> {user.id}
							</div>
						</CardContent>
					</Card>

					{userAccounts && (
						<Card>
							<CardHeader>
								<CardTitle>Connected Accounts</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='space-y-2'>
									{userAccounts.length > 0 ? (
										userAccounts.map(account => (
											<div key={account.providerId} className='rounded bg-gray-100 p-2'>
												<strong>Provider:</strong> {account.providerId}
											</div>
										))
									) : (
										<p>No connected accounts</p>
									)}
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			)}
		</div>
	);

	return (
		<div className='flex min-h-screen flex-col items-center justify-center p-4'>
			<div className='w-full max-w-4xl'>
				<div className='mb-6 flex items-center justify-between'>
					<h1 className='font-bold text-3xl'>Dashboard</h1>
					<Button onClick={handleSignOut}>Sign Out</Button>
				</div>

				<Tabs defaultValue='geolocation' className='w-full'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='geolocation'>Geolocation</TabsTrigger>
						<TabsTrigger value='user'>User Info</TabsTrigger>
					</TabsList>

					<TabsContent value='geolocation' className='mt-6'>
						{renderGeolocationTab()}
					</TabsContent>

					<TabsContent value='user' className='mt-6'>
						{renderUserTab()}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
