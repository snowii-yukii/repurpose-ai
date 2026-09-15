import { requireUser } from "@/lib/current-user";
import { ProjectForm } from "./project-form";

export default async function NewProjectPage() {
  await requireUser();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Create a project</h1>
      <p className="mt-2 text-gray-600">
        Start with one piece of content. We’ll turn it into multiple formats later.
      </p>

      <div className="mt-8">
        <ProjectForm />
      </div>
    </main>
  );
}