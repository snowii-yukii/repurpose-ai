import OpenAI from "openai";
import { z } from "zod";
import type { OutputFormat } from "./generation";

const outputSchema = z.record(
  z.string(),
  z.union([z.string(), z.array(z.string())]),
);

export async function repurposeContent(input: {
  sourceText: string;
  formats: OutputFormat[];
}) {
  if (process.env.AI_MODE === "mock") {
    return {
        linkedin_post: "Mock LinkedIn post for development.",
        x_thread: [
        "Mock thread opening.",
        "Mock thread follow-up.",
        ],
        newsletter: "Mock newsletter draft.",
        short_video_script: "Mock short video script.",
    };
    }
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_TEXT_MODEL;

  if (!apiKey || !model) {
    throw new Error("AI configuration is missing.");
  }

  const client = new OpenAI({ apiKey });

  const response = await client.responses.create({
    model,
    instructions: `
You are an expert content repurposing assistant.
Return only valid JSON.
Use exactly the requested format identifiers as keys.
Use a string for linkedin_post, newsletter, and short_video_script.
Use an array of individual posts for x_thread.
Do not invent facts that are not present in the source.
    `,
    input: JSON.stringify({
      requestedFormats: input.formats,
      sourceText: input.sourceText,
    }),
  });

  const text = response.output_text.trim();

  if (!text) {
    throw new Error("The AI returned an empty response.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("The AI returned invalid JSON.");
  }

  return outputSchema.parse(parsed);
}