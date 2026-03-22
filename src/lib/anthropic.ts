import Anthropic from '@anthropic-ai/sdk';

export const MODEL = 'claude-haiku-4-5-20251001';
export const MAX_OUTPUT_TOKENS = 1024;

// モジュールレベルでの初期化を避け、リクエスト時に生成する
export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY が設定されていません');
  }
  return new Anthropic({ apiKey });
}
