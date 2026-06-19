import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function getAuthRoles(): Promise<string[]> {
  const { sessionClaims } = await auth()
  const metadata = sessionClaims?.public_metadata as Record<string, unknown> | undefined
  return (metadata?.roles as string[]) || []
}

export async function requireAnalyst() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const roles = await getAuthRoles()
  if (!roles.includes('analyst')) redirect('/sign-in')
}
