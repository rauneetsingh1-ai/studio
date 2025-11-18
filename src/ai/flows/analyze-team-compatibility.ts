'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the compatibility between two user profiles.
 *
 * The flow takes two user profiles and a match score as input and generates a short summary
 * explaining why the two users are a good potential match.
 *
 * - analyzeTeamCompatibility - The function to analyze team compatibility.
 * - AnalyzeTeamCompatibilityInput - The input type for the analyzeTeamCompatibility function.
 * - AnalyzeTeamCompatibilityOutput - The output type for the analyzeTeamCompatibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTeamCompatibilityInputSchema = z.object({
  user1Profile: z.string().describe('The profile of the first user.'),
  user2Profile: z.string().describe('The profile of the second user.'),
  matchScore: z.number().describe('The match score between the two users.'),
});

export type AnalyzeTeamCompatibilityInput = z.infer<
  typeof AnalyzeTeamCompatibilityInputSchema
>;

const AnalyzeTeamCompatibilityOutputSchema = z.object({
  summary: z.string().describe('A short summary of why the two users are a good potential match.'),
});

export type AnalyzeTeamCompatibilityOutput = z.infer<
  typeof AnalyzeTeamCompatibilityOutputSchema
>;

export async function analyzeTeamCompatibility(
  input: AnalyzeTeamCompatibilityInput
): Promise<AnalyzeTeamCompatibilityOutput> {
  return analyzeTeamCompatibilityFlow(input);
}

const analyzeTeamCompatibilityPrompt = ai.definePrompt({
  name: 'analyzeTeamCompatibilityPrompt',
  input: {schema: AnalyzeTeamCompatibilityInputSchema},
  output: {schema: AnalyzeTeamCompatibilityOutputSchema},
  prompt: `You are an AI assistant designed to analyze the compatibility between two user profiles and generate a short summary explaining why they would be a good match.

  User 1 Profile: {{{user1Profile}}}
  User 2 Profile: {{{user2Profile}}}
  Match Score: {{{matchScore}}}

  Based on the provided profiles and match score, generate a concise summary (1-2 sentences) highlighting the key reasons why these two users would be a good fit as teammates.
  `,
});

const analyzeTeamCompatibilityFlow = ai.defineFlow(
  {
    name: 'analyzeTeamCompatibilityFlow',
    inputSchema: AnalyzeTeamCompatibilityInputSchema,
    outputSchema: AnalyzeTeamCompatibilityOutputSchema,
  },
  async input => {
    const {output} = await analyzeTeamCompatibilityPrompt(input);
    return output!;
  }
);
