"use client";

import { useActionState } from "react";
import {
  createProject,
  type ProjectActionState,
} from "./actions";

const initialState: ProjectActionState = {};

export function ProjectForm() {
  const [state, formAction, pending] = useActionState(
    createProject,
    initialState,
  );

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="title" className="block font-medium">
          Project title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={100}
          placeholder="My weekly marketing ideas"
          className="mt-2 w-full rounded border p-3"
        />
      </div>

      <div>
        <label htmlFor="sourceText" className="block font-medium">
          Source content
        </label>
        <textarea
          id="sourceText"
          name="sourceText"
          required
          minLength={50}
          maxLength={100000}
          rows={14}
          placeholder="Paste an article, transcript, notes, or other source content..."
          className="mt-2 w-full rounded border p-3"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-5 py-3 text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : "Create project"}
      </button>
    </form>
  );
}