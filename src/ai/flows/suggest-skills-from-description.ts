'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest relevant skills based on a user's description of their project preferences and interests.
 *
 * - suggestSkillsFromDescription - A function that takes a user's description and suggests relevant skills.
 * - SuggestSkillsFromDescriptionInput - The input type for the suggestSkillsFromDescription function.
 * - SuggestSkillsFromDescriptionOutput - The return type for the suggestSkillsFromDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSkillsFromDescriptionInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A description of the user project preferences and interests.'
    ),
});
export type SuggestSkillsFromDescriptionInput = z.infer<
  typeof SuggestSkillsFromDescriptionInputSchema
>;

const SuggestSkillsFromDescriptionOutputSchema = z.object({
  suggestedSkills: z
    .array(z.string())
    .describe('An array of skills suggested based on the description.'),
});
export type SuggestSkillsFromDescriptionOutput = z.infer<
  typeof SuggestSkillsFromDescriptionOutputSchema
>;

export async function suggestSkillsFromDescription(
  input: SuggestSkillsFromDescriptionInput
): Promise<SuggestSkillsFromDescriptionOutput> {
  return suggestSkillsFromDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSkillsFromDescriptionPrompt',
  input: {schema: SuggestSkillsFromDescriptionInputSchema},
  output: {schema: SuggestSkillsFromDescriptionOutputSchema},
  prompt: `Based on the following description of project preferences and interests, suggest a list of relevant skills that the user may want to add to their profile.  The skills should be comma separated.\n\nDescription: {{{description}}}`,
});

const suggestSkillsFromDescriptionFlow = ai.defineFlow(
  {
    name: 'suggestSkillsFromDescriptionFlow',
    inputSchema: SuggestSkillsFromDescriptionInputSchema,
    outputSchema: SuggestSkillsFromDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
