import { requireUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GenerateForm } from "./generate-form";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{
    generation?: string | string[];
  }>;
}) {
  const user = await requireUser();
  const { projectId } = await params;
  const { generation: generationParam } = await searchParams;

  const generationId = Array.isArray(generationParam)
    ? generationParam[0]
    : generationParam;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) {
    notFound();
  }

  const generation = generationId
    ? await prisma.generation.findFirst({
        where: {
          id: generationId,
          projectId: project.id,
        },
      })
    : null;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">{project.title}</h1>

      <p className="mt-2 text-sm text-gray-500">
        Created {project.createdAt.toLocaleDateString()}
      </p>

      <section className="mt-8">
        <h2 className="font-medium">Source content</h2>

        <pre className="mt-3 whitespace-pre-wrap rounded p-4">
          {project.sourceText}
        </pre>

        <GenerateForm projectId={project.id} />

        {generation?.status === "FAILED" && (
          <p className="mt-6 text-red-600">
            Generation failed: {generation.errorMessage}
          </p>
        )}

        {generation?.result && (
          <pre className="mt-8 whitespace-pre-wrap rounded p-4">
            {JSON.stringify(generation.result, null, 2)}
          </pre>
        )}
      </section>
    </main>
  );
}