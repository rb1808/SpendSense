"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { revalidatePath } from "next/cache"
import { Expense } from "@/lib/types"

export async function addExpenseAction(expense: Omit<Expense, 'id'>) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return

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
}

export async function deleteExpenseAction(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return

  await prisma.expense.delete({
    where: { id }
  })
  
  revalidatePath("/")
}

export async function updateBudgetGoalAction(category: string, limit: number) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return

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
}

export async function updateSettingsAction(data: { dailySpendingLimit: number, receiveDailyAlerts: boolean, receiveMonthlyReports: boolean }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return
  
  await prisma.user.update({
    where: { email: session.user.email },
    data
  })
  
  revalidatePath("/")
}
