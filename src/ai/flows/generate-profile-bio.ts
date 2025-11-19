// Author: rauneetsingh1@gmail.com
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a user profile bio based on specified skills and interests.
 *
 * - generateProfileBio - A function that generates a user profile bio.
 * - GenerateProfileBioInput - The input type for the generateProfileBio function.
 * - GenerateProfileBioOutput - The return type for the generateProfileBio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProfileBioInputSchema = z.object({
  skills: z
    .string()
    .describe('A comma-separated list of the user skills.'),
  interests: z.string().describe('A comma-separated list of the user interests.'),
});
export type GenerateProfileBioInput = z.infer<typeof GenerateProfileBioInputSchema>;

const GenerateProfileBioOutputSchema = z.object({
  bio: z.string().describe('The generated user profile bio.'),
});
export type GenerateProfileBioOutput = z.infer<typeof GenerateProfileBioOutputSchema>;

export async function generateProfileBio(input: GenerateProfileBioInput): Promise<GenerateProfileBioOutput> {
  return generateProfileBioFlow(input);
}

const generateProfileBioPrompt = ai.definePrompt({
  name: 'generateProfileBioPrompt',
  input: {schema: GenerateProfileBioInputSchema},
  output: {schema: GenerateProfileBioOutputSchema},
  prompt: `You are an expert profile writer. Generate a profile bio based on the following skills and interests.

Skills: {{{skills}}}
Interests: {{{interests}}}

Write a compelling bio that highlights the user's skills and interests, and is no more than 150 words.`,
});

const generateProfileBioFlow = ai.defineFlow(
  {
    name: 'generateProfileBioFlow',
    inputSchema: GenerateProfileBioInputSchema,
    outputSchema: GenerateProfileBioOutputSchema,
  },
  async input => {
    const {output} = await generateProfileBioPrompt(input);
    return output!;
  }
);
