import { db } from './db'
import { getCurrentUser } from './user'

/**
 * Get transaction history for the current user
 */
export async function getUserTransactions() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return null
    }

    const transactions = await db.transaction.findMany({
      where: {
        userId: user.clerkUserId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        generation: {
          select: {
            id: true,
            prompt: true,
            resultUrl: true,
            createdAt: true,
          },
        },
      },
    })

    return transactions
  } catch (error) {
    console.error('Error fetching user transactions:', error)
    return null
  }
}

/**
 * Get total credits used by the current user
 */
export async function getUsedCredits() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return 0
    }

    const usedCredits = await db.transaction.aggregate({
      where: {
        userId: user.clerkUserId,
        type: 'generation',
        status: 'completed',
      },
      _count: {
        id: true,
      },
    })

    return usedCredits._count.id
  } catch (error) {
    console.error('Error calculating used credits:', error)
    return 0
  }
}


