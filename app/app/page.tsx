import { UserButton } from "@clerk/nextjs";
import { requireUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireUser();

  const projectCount = await prisma.project.count({
    where: {
      userId: user.id,
    },
  });

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your dashboard</h1>
        <UserButton />
      </div>

      <p className="mt-6 text-gray-600">
        You have {projectCount} project{projectCount === 1 ? "" : "s"}.
      </p>

      <Link
        href="/app/new"
        className="mt-6 inline-block rounded bg-black px-5 py-3 text-white"
      >
        Create a project
      </Link>

      <p className="mt-2 text-sm text-green-700">
        Your Clerk account is connected to Postgres.
      </p>
    </main>
  );
}