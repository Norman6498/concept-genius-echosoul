/**
 * EchoSoul Typography System & Script Detection
 * 
 * 1. English Display: Cormorant Garamond
 * 2. English UI: Manrope
 * 3. Hindi Literature: Tiro Devanagari Hindi
 * 4. Hindi UI: Hind
 * 5. Urdu Literature: Noto Nastaliq Urdu
 */

export type LiteratureScript = "Devanagari" | "Arabic" | "Latin" | "Bengali" | "Gurmukhi" | "Tamil" | "Telugu";

export interface TypographySelection {
  fontClass: string;
  isRtl: boolean;
  script: LiteratureScript;
}

/**
 * Detect script from character ranges
 */
export function detectScript(text: string): LiteratureScript {
  if (!text) return "Latin";

  // Devanagari Unicode block: \u0900-\u097F
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  if (hasDevanagari) return "Devanagari";

  // Arabic / Urdu Unicode block: \u0600-\u06FF, \u0750-\u077F, \u08A0-\u08FF, \uFB50-\uFDFF, \uFE70-\uFEFF
  const hasArabic = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
  if (hasArabic) return "Arabic";

  // Gurmukhi: \u0A00-\u0A7F
  if (/[\u0A00-\u0A7F]/.test(text)) return "Gurmukhi";

  // Bengali: \u0980-\u09FF
  if (/[\u0980-\u09FF]/.test(text)) return "Bengali";

  // Tamil: \u0B80-\u0BFF
  if (/[\u0B80-\u0BFF]/.test(text)) return "Tamil";

  // Telugu: \u0C00-\u0C7F
  if (/[\u0C00-\u0C7F]/.test(text)) return "Telugu";

  return "Latin";
}

/**
 * Get literary typography class for poetry, shayari, quotes, and books
 */
export function getLiteratureTypography(
  text: string,
  explicitLanguage?: string,
  explicitScript?: string
): TypographySelection {
  const script = (explicitScript as LiteratureScript) || detectScript(text);

  if (script === "Arabic" || explicitLanguage?.toLowerCase() === "urdu") {
    return {
      fontClass: "font-urdu text-base sm:text-lg leading-loose tracking-wide",
      isRtl: true,
      script: "Arabic",
    };
  }

  if (script === "Devanagari" || explicitLanguage?.toLowerCase() === "hindi") {
    return {
      fontClass: "font-hindi-lit text-base sm:text-lg leading-relaxed tracking-normal",
      isRtl: false,
      script: "Devanagari",
    };
  }

  return {
    fontClass: "font-cormorant text-base sm:text-xl italic leading-relaxed",
    isRtl: false,
    script: "Latin",
  };
}
