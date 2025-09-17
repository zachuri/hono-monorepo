'use client';

import { Button } from '@acme/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@acme/ui/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api.client';
import { signOut, useSession } from '@/lib/auth.client';

export default function App() {
	const router = useRouter();
	const session = useSession();

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

					<TabsContent value='user' className='mt-6'>
						{renderUserTab()}
					</TabsContent>

					<TabsContent value='geolocation' className='mt-6'>
						{/* {renderGeolocationTab()} */}
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
