import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { requireUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await requireUser();

  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      _count: {
        select: {
          generations: true,
        },
      },
    },
  });

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your projects</h1>
        <UserButton />
      </div>

      <Link
        href="/app/new"
        className="mt-6 inline-block rounded bg-black px-5 py-3 text-white"
      >
        Create a project
      </Link>

      {projects.length === 0 ? (
        <p className="mt-10 text-gray-600">
          You have no projects yet. Create your first one above.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/app/projects/${project.id}`}
              className="block rounded border p-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{project.title}</h2>
                <span className="text-sm text-gray-500">
                  {project._count.generations} generation
                  {project._count.generations === 1 ? "" : "s"}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {project.createdAt.toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}