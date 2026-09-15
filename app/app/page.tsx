import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your dashboard</h1>
        <UserButton />
      </div>

      <p className="mt-6 text-gray-600">
        Your repurposed content projects will appear here.
      </p>
    </main>
  );
}