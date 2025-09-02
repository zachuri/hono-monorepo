'use client';

import { Button } from '@acme/ui/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { GeolocationDisplay } from '@/components/GeolocationDisplay';
import { api } from '@/lib/api.client';
import { signOut, useSession } from '@/lib/auth.client';

export default function App() {
	const router = useRouter();
	const session = useSession();

	const {
		data: test,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['hello'],
		queryFn: async () => {
			const response = await api.user.accounts.$get();
			if (!response.ok) {
				return null;
			}

			return await response.json();
		},
	});

	const user = session.data?.user;

	// TODO: update use of useSession with useQueryClient
	const handleSignOut = async () => {
		try {
			await signOut();
			router.push('/sign-in');
		} catch (error) {
			console.error('Sign out failed', error);
		}
	};

	return (
		<div className='flex flex-col items-center justify-center min-h-screen p-8'>
			{isLoading && <p>Loading</p>}
			{isError && <p>User not found</p>}
			{!isLoading && user && (
				<div className='flex flex-col items-center justify-center gap-8 max-w-4xl w-full'>
					<div className='text-center'>
						<h2 className='text-2xl mb-2'>Logged in as: {user.email}</h2>
						{test && (
							<p className='text-lg text-muted-foreground'>
								Providers: {test.map(provider => provider.providerId).join(', ')}
							</p>
						)}
					</div>

					{/* Geolocation Display */}
					<div className='w-full max-w-2xl'>
						<GeolocationDisplay />
					</div>

					<Button onClick={handleSignOut}>Sign Out</Button>
				</div>
			)}
		</div>
	);
}
