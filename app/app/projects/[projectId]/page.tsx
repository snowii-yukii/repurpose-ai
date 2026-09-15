import { requireUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireUser();
  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) {
    notFound();
  }

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
      </section>
    </main>
  );
}