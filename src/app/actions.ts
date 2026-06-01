"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { Expense } from "@/lib/types"

async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return null
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return user
}

export async function addExpenseAction(expense: Omit<Expense, 'id'>) {
  const user = await getAuthenticatedUser()
  if (!user) return { success: false, error: "Not authenticated" }

  await prisma.expense.create({
    data: {
      userId: user.id,
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
    }
  })
  
  revalidatePath("/")
  return { success: true }
}

export async function editExpenseAction(id: string, data: Omit<Expense, 'id'>) {
  const user = await getAuthenticatedUser()
  if (!user) return { success: false, error: "Not authenticated" }

  // Verify ownership
  const expense = await prisma.expense.findUnique({ where: { id } })
  if (!expense || expense.userId !== user.id) {
    return { success: false, error: "Expense not found" }
  }

  await prisma.expense.update({
    where: { id },
    data: {
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: data.date,
    }
  })
  
  revalidatePath("/")
  return { success: true }
}

export async function deleteExpenseAction(id: string) {
  const user = await getAuthenticatedUser()
  if (!user) return { success: false, error: "Not authenticated" }

  // Verify ownership before deleting
  const expense = await prisma.expense.findUnique({ where: { id } })
  if (!expense || expense.userId !== user.id) {
    return { success: false, error: "Expense not found or not owned by you" }
  }

  await prisma.expense.delete({
    where: { id }
  })
  
  revalidatePath("/")
  return { success: true }
}

export async function updateBudgetGoalAction(category: string, limit: number) {
  const user = await getAuthenticatedUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const existing = await prisma.budget.findFirst({
    where: { userId: user.id, category }
  })

  if (existing) {
    await prisma.budget.update({
      where: { id: existing.id },
      data: { limit }
    })
  } else {
    await prisma.budget.create({
      data: {
        userId: user.id,
        category,
        limit
      }
    })
  }
  
  revalidatePath("/")
  return { success: true }
}

export async function deleteBudgetGoalAction(category: string) {
  const user = await getAuthenticatedUser()
  if (!user) return { success: false, error: "Not authenticated" }

  const existing = await prisma.budget.findFirst({
    where: { userId: user.id, category }
  })

  if (!existing) return { success: false, error: "Budget goal not found" }

  await prisma.budget.delete({
    where: { id: existing.id }
  })
  
  revalidatePath("/")
  return { success: true }
}

export async function updateSettingsAction(data: { dailySpendingLimit: number, receiveDailyAlerts: boolean, receiveMonthlyReports: boolean }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return { success: false, error: "Not authenticated" }
  
  await prisma.user.update({
    where: { email: session.user.email },
    data
  })
  
  revalidatePath("/")
  return { success: true }
}
