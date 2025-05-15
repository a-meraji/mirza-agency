import { encoding_for_model } from "tiktoken";

const encoding = encoding_for_model("gpt-4o");

/**
 * Utility functions for token counting and cost estimation
 */

// Token pricing constants (per 1K tokens)
const TOKEN_PRICING = {
    prompt: 0.005,    // GPT-4o pricing: $0.005 per 1K prompt tokens
    completion: 0.015 // GPT-4o pricing: $0.015 per 1K completion tokens
  };
  
  // Markup multiplier (e.g., 2 = 2x the cost, 3 = 3x, etc.)
  const MARKUP_MULTIPLIER = 2;
  
  /**
   * Estimate the number of tokens in a text string.
   * This is a simple estimation; use a proper tokenizer for production accuracy.
   * 
   * @param text Text to estimate token count for
   * @returns Estimated token count
   */
  export function estimateTokenCount(text: string): number {
    if (!text) return 0;
    const tokens = encoding.encode(text);
  return tokens.length;
  }
  
  /**
   * Calculate cost for tokens with markup applied.
   * 
   * @param promptTokens Number of prompt tokens
   * @param completionTokens Number of completion tokens
   * @returns Cost in USD (markup included)
   */
  export function calculateCost(promptTokens: number, completionTokens: number): number {
    const promptCost = (promptTokens / 1000) * TOKEN_PRICING.prompt;
    const completionCost = (completionTokens / 1000) * TOKEN_PRICING.completion;
  
    const total = promptCost + completionCost;
    const markedUp = total * MARKUP_MULTIPLIER;
  
    return parseFloat(markedUp.toFixed(6));
  }
  
  /**
   * Calculate token and cost information for a set of messages
   * 
   * @param messages Array of messages with text and role
   * @returns Token and cost information
   */
  export function calculateTokensAndCost(messages: Array<{ text: string, role: 'user' | 'assistant' }>): {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    costEstimated: number;
  } {
    let promptTokens = 0;
    let completionTokens = 0;
  
    messages.forEach(message => {
      const tokenCount = estimateTokenCount(message.text);
  
      if (message.role === 'user') {
        promptTokens += tokenCount;
      } else {
        completionTokens += tokenCount;
      }
    });
  
    const totalTokens = promptTokens + completionTokens;
    const costEstimated = calculateCost(promptTokens, completionTokens);
  
    return {
      promptTokens,
      completionTokens,
      totalTokens,
      costEstimated
    };
  }
  