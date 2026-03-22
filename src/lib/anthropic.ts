import Anthropic from '@anthropic-ai/sdk';

export const anthropic = new Anthropic({
  apiKey: import.meta.env.ANTHROPIC_API_KEY,
});

export const MODEL = 'claude-haiku-4-5-20251001';
export const MAX_OUTPUT_TOKENS = 1024;
