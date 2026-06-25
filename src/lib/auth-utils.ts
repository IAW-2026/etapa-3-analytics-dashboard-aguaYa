import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function requireAnalyst() {
  const { userId, sessionId } = await auth()
  if (!userId) redirect('/sign-in')

  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const roles = (user.publicMetadata?.roles as string[]) || []

  if (!roles.includes('analyst')) {
    if (sessionId) {
      await client.sessions.revokeSession(sessionId)
    }
    redirect('/sign-out-session')
  }
}
