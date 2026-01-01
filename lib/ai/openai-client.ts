/**
 * OpenAI API Client
 * Lightweight wrapper for AI-powered features
 */

interface FAQItem {
  question: string;
  answer: string;
}

interface GenerateFAQsResponse {
  faqs: FAQItem[];
  error?: string;
}

/**
 * Generate FAQs from article content using OpenAI
 */
export async function generateFAQs(
  title: string,
  description: string,
  content: string,
  count: number = 5
): Promise<GenerateFAQsResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      faqs: [],
      error: "OpenAI API key not configured. Add OPENAI_API_KEY to your .env file.",
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Cost-effective model for FAQ generation
        messages: [
          {
            role: "system",
            content: `Sei un esperto di marketing italiano che crea FAQ per articoli educativi.
Genera ${count} domande frequenti (FAQ) rilevanti e utili basate sul contenuto dell'articolo.

Requisiti:
- Scrivi in italiano perfetto
- Le domande devono essere quelle che un lettore si porrebbe REALMENTE
- Le risposte devono essere concise ma complete (2-4 frasi)
- Usa un tono professionale ma accessibile
- Concentrati sui concetti chiave e applicazioni pratiche
- Evita domande troppo generiche come "Cos'è questo articolo?"

Formato di risposta: JSON array con oggetti {question, answer}`,
          },
          {
            role: "user",
            content: `Titolo: ${title}

Descrizione: ${description}

Contenuto:
${content.substring(0, 3000)} ${content.length > 3000 ? "..." : ""}

Genera ${count} FAQ in formato JSON.`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return {
        faqs: [],
        error: `API Error: ${error.error?.message || "Unknown error"}`,
      };
    }

    const data = await response.json();
    const content_text = data.choices[0]?.message?.content;

    if (!content_text) {
      return {
        faqs: [],
        error: "No response from OpenAI",
      };
    }

    // Parse JSON response
    const parsed = JSON.parse(content_text);

    // Handle different response formats
    let faqs: FAQItem[] = [];
    if (Array.isArray(parsed)) {
      faqs = parsed;
    } else if (parsed.faqs && Array.isArray(parsed.faqs)) {
      faqs = parsed.faqs;
    } else if (parsed.faq && Array.isArray(parsed.faq)) {
      faqs = parsed.faq;
    }

    // Validate and clean FAQs
    const validFAQs = faqs
      .filter((item) => item.question && item.answer)
      .map((item) => ({
        question: item.question.trim(),
        answer: item.answer.trim(),
      }))
      .slice(0, count);

    if (validFAQs.length === 0) {
      return {
        faqs: [],
        error: "No valid FAQs generated",
      };
    }

    return {
      faqs: validFAQs,
    };
  } catch (error) {
    console.error("Error generating FAQs:", error);
    return {
      faqs: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Estimate cost of FAQ generation
 * GPT-4o-mini pricing: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
 * Average FAQ generation: ~1000 input tokens + ~500 output tokens = ~$0.0005 per request
 */
export function estimateFAQCost(articleLength: number): number {
  const inputTokens = Math.min(articleLength / 4, 3000); // ~4 chars per token, max 3000
  const outputTokens = 500; // Average for 5 FAQs
  const inputCost = (inputTokens / 1_000_000) * 0.15;
  const outputCost = (outputTokens / 1_000_000) * 0.6;
  return inputCost + outputCost;
}
