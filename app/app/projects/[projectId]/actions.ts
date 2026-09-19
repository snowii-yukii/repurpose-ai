"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { repurposeContent } from "@/lib/ai";
import { outputFormats } from "@/lib/generation";

const requestSchema = z.object({
  projectId: z.string().min(1),
  formats: z.array(z.enum(outputFormats)).min(1),
});

export type GenerateState = {
  error?: string;
};

export async function generateProject(
  _previousState: GenerateState,
  formData: FormData,
): Promise<GenerateState> {
  const parsed = requestSchema.safeParse({
    projectId: formData.get("projectId"),
    formats: formData
      .getAll("formats")
      .filter((value): value is string => typeof value === "string"),
  });

  if (!parsed.success) {
    return { error: "Choose at least one output format." };
  }

  const user = await requireUser();

  const project = await prisma.project.findFirst({
    where: {
      id: parsed.data.projectId,
      userId: user.id,
    },
  });

  if (!project || !project.sourceText) {
    return { error: "Project not found or has no source content." };
  }

  const generation = await prisma.generation.create({
    data: {
      projectId: project.id,
      status: "PENDING",
      formats: parsed.data.formats,
      model: process.env.OPENAI_TEXT_MODEL,
    },
  });

  try {
    const result = await repurposeContent({
      sourceText: project.sourceText,
      formats: parsed.data.formats,
    });

    await prisma.generation.update({
      where: { id: generation.id },
      data: {
        status: "COMPLETED",
        result,
      },
    });
    } catch (error) {
    console.error("AI generation failed:", error);

    await prisma.generation.update({
        where: { id: generation.id },
        data: {
        status: "FAILED",
        errorMessage:
            error instanceof Error ? error.message : "Generation failed.",
        },
    });

    return {
        error:
        error instanceof Error
            ? `Generation failed: ${error.message}`
            : "Generation failed.",
    };
    }

  revalidatePath(`/app/projects/${project.id}`);
  redirect(`/app/projects/${project.id}?generation=${generation.id}`);
}
