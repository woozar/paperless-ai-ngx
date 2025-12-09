import { z } from 'zod';

/**
 * Schema for AI-suggested document metadata
 */
// Schema for suggested item - either id (existing) or name (new to create)
const SuggestedItemSchema = z.object({
  id: z.number().optional().describe('ID of existing item (omit for new items)'),
  name: z.string().describe('Name of the item'),
});

export const DocumentAnalysisResultSchema = z.object({
  suggestedTitle: z.string().describe('Suggested title for the document'),
  suggestedCorrespondent: SuggestedItemSchema.describe(
    'REQUIRED - Suggested correspondent - include id if existing, omit id for new'
  ),
  suggestedDocumentType: SuggestedItemSchema.describe(
    'REQUIRED - Suggested document type - include id if existing, omit id for new'
  ),
  suggestedTags: z
    .array(
      z.object({
        id: z.number().describe('ID of existing tag'),
        name: z.string().describe('Name of the tag'),
      })
    )
    .describe('Suggested tags for the document (only existing tags)'),
  confidence: z.number().min(0).max(1).describe('Confidence score from 0 to 1'),
  reasoning: z.string().describe('Explanation of why these suggestions were made'),
});

export type DocumentAnalysisResult = z.infer<typeof DocumentAnalysisResultSchema>;

/**
 * Schema for the analyze document request
 */
export const AnalyzeDocumentRequestSchema = z.object({
  aiBotId: z.string().describe('ID of the AI bot to use for analysis'),
});

export type AnalyzeDocumentRequest = z.infer<typeof AnalyzeDocumentRequestSchema>;
