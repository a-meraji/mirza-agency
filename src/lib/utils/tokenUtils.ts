/**
 * Utility functions for token counting and cost estimation
 */

// Token pricing constants (per 1K tokens)
const TOKEN_PRICING = {
  prompt: 0.01,    // $0.01 per 1K prompt tokens
  completion: 0.03 // $0.03 per 1K completion tokens
};

/**
 * Estimate the number of tokens in a text string
 * This is a simple estimation based on words and characters
 * For production, consider using a proper tokenizer library
 * 
 * @param text Text to estimate token count for
 * @returns Estimated token count
 */
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  
  // Simple estimation: roughly 4 characters per token for English text
  // This is a very rough approximation
  return Math.ceil(text.length / 4);
}

/**
 * Calculate cost for tokens
 * 
 * @param promptTokens Number of prompt tokens
 * @param completionTokens Number of completion tokens
 * @returns Cost in USD
 */
export function calculateCost(promptTokens: number, completionTokens: number): number {
  const promptCost = (promptTokens / 1000) * TOKEN_PRICING.prompt;
  const completionCost = (completionTokens / 1000) * TOKEN_PRICING.completion;
  
  return parseFloat((promptCost + completionCost).toFixed(6));
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
  
  // Calculate tokens for each message based on role
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