import { currentUser } from '@clerk/nextjs/server'
import { db } from './db'

/**
 * Gets the current authenticated user from Clerk and fetches their data from Prisma
 * @returns User object from database or null if not found/not authenticated
 */
export async function getCurrentUser() {
  try {
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return null
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: clerkUser.id,
      },
    })

    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Gets the current user's Clerk ID
 * @returns Clerk user ID or null if not authenticated
 */
export async function getCurrentUserId() {
  try {
    const clerkUser = await currentUser()
    return clerkUser?.id || null
  } catch (error) {
    console.error('Error getting current user ID:', error)
    return null
  }
}

