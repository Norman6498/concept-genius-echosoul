/**
 * EchoSoul — AI Provider Factory
 *
 * Returns the configured AI provider instance.
 * Application code imports from here — never from individual adapter files.
 *
 * SECURITY: This file is server-side only.
 * Never import it in client components or the browser bundle.
 *
 * To add a new provider:
 * 1. Create src/lib/ai/<provider-name>.ts implementing AIProvider
 * 2. Add a case to the switch below
 * 3. Update OPENROUTER_CHAT_MODEL (or add a new env var) in .env.example
 */

import type { AIProvider } from "./types";
import { OpenRouterAdapter } from "./openrouter";

export type { AIProvider } from "./types";
export * from "./types";

let _provider: AIProvider | null = null;

/**
 * Returns the singleton AI provider instance.
 * Currently only OpenRouter is supported; the switch allows future expansion.
 */
export function getAIProvider(): AIProvider {
  if (_provider) return _provider;

  const providerName = process.env.AI_PROVIDER ?? "openrouter";

  switch (providerName) {
    case "openrouter":
      _provider = new OpenRouterAdapter();
      break;
    default:
      throw new Error(
        `Unknown AI provider: "${providerName}". ` +
          `Set AI_PROVIDER in .env.local to one of: openrouter`
      );
  }

  return _provider;
}
