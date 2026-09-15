"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Please enter a project title.")
    .max(100, "The title must be 100 characters or fewer."),
  sourceText: z
    .string()
    .trim()
    .min(50, "Please enter at least 50 characters of source content.")
    .max(100_000, "The source content is too long."),
});

export type ProjectActionState = {
  error?: string;
};

export async function createProject(
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    sourceText: formData.get("sourceText"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Please check your input.",
    };
  }

  const user = await requireUser();

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      title: parsed.data.title,
      sourceText: parsed.data.sourceText,
    },
  });

  revalidatePath("/app");
  redirect(`/app/projects/${project.id}`);
}