/**
 * EchoSoul Validators
 * 
 * Functions to validate the response payload before passing to the judge.
 */

import { EchoSoulCanonicalResponse } from "@/ai/contracts/response-schema";

export function validateSchema(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data) {
    return { valid: false, errors: ["Data is null or undefined"] };
  }

  if (typeof data.content !== "string") {
    errors.push("Missing or invalid 'content'");
  }

  if (typeof data.presentation_mode !== "string") {
    errors.push("Missing or invalid 'presentation_mode'");
  }

  if (typeof data.tone !== "string") {
    errors.push("Missing or invalid 'tone'");
  }

  if (typeof data.intent !== "string") {
    errors.push("Missing or invalid 'intent'");
  }

  if (typeof data.need !== "string") {
    errors.push("Missing or invalid 'need'");
  }

  if (typeof data.safety_level !== "number") {
    errors.push("Missing or invalid 'safety_level'");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
