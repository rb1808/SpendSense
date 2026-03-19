'use server';
/**
 * @fileOverview An AI agent for automatically suggesting and pre-filling expense categories for new transactions.
 *
 * - aiCategorizeTransaction - A function that handles the AI-powered transaction categorization process.
 * - AICategorizeTransactionInput - The input type for the aiCategorizeTransaction function.
 * - AICategorizeTransactionOutput - The return type for the aiCategorizeTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HistoricalTransactionSchema = z.object({
  description: z.string().describe('The description of a past transaction.'),
  category: z.string().describe('The category assigned to the past transaction.'),
  amount: z.number().describe('The amount of the past transaction.'),
});

const AICategorizeTransactionInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the new transaction to be categorized.'),
  historicalTransactions: z
    .array(HistoricalTransactionSchema)
    .optional()
    .describe(
      'An optional array of historical transactions, including description, category, and amount, to infer user spending habits.'
    ),
});
export type AICategorizeTransactionInput = z.infer<
  typeof AICategorizeTransactionInputSchema
>;

const AICategorizeTransactionOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .describe('The AI-suggested category for the transaction.'),
  confidenceScore: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('An optional score from 0 to 1 indicating the AI\'s confidence in the suggestion.'),
});
export type AICategorizeTransactionOutput = z.infer<
  typeof AICategorizeTransactionOutputSchema
>;

export async function aiCategorizeTransaction(
  input: AICategorizeTransactionInput
): Promise<AICategorizeTransactionOutput> {
  return aiCategorizeTransactionFlow(input);
}

const aiCategorizeTransactionPrompt = ai.definePrompt({
  name: 'aiCategorizeTransactionPrompt',
  input: {schema: AICategorizeTransactionInputSchema},
  output: {schema: AICategorizeTransactionOutputSchema},
  prompt: `You are an expert financial assistant specialized in categorizing expenses.
Your task is to analyze a new transaction and suggest an appropriate category based on its description and, if provided, the user's past spending habits.

New Transaction Description: {{{transactionDescription}}}

{{#if historicalTransactions}}
Based on the user's recent spending habits below, provide a relevant category for the new transaction:

User's Recent Spending Habits:
{{#each historicalTransactions}}
- Description: "{{{description}}}", Category: "{{{category}}}", Amount: {{{amount}}}
{{/each}}
{{else}}
If no historical transactions are provided, categorize the new transaction based solely on its description.
{{/if}}

Suggest a concise and relevant category (e.g., "Groceries", "Dining Out", "Utilities", "Transportation", "Shopping", "Entertainment", "Rent", "Salary").
Also, provide a confidence score between 0 (not confident) and 1 (very confident) for your suggestion. If you are very unsure, you may omit the confidence score.
`,
});

const aiCategorizeTransactionFlow = ai.defineFlow(
  {
    name: 'aiCategorizeTransactionFlow',
    inputSchema: AICategorizeTransactionInputSchema,
    outputSchema: AICategorizeTransactionOutputSchema,
  },
  async input => {
    const {output} = await aiCategorizeTransactionPrompt(input);
    return output!;
  }
);
