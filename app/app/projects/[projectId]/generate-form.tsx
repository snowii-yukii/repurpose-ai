"use client";

import { useActionState } from "react";
import {
  outputFormats,
  outputFormatLabels,
} from "@/lib/generation";
import {
  generateProject,
  type GenerateState,
} from "./actions";

const initialState: GenerateState = {};

export function GenerateForm({ projectId }: { projectId: string }) {
  const [state, formAction, pending] = useActionState(
    generateProject,
    initialState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="projectId" value={projectId} />

      <h2 className="font-medium">Choose outputs</h2>

      {outputFormats.map((format) => (
        <label key={format} className="block">
          <input
            type="checkbox"
            name="formats"
            value={format}
            defaultChecked
            className="mr-2"
          />
          {outputFormatLabels[format]}
        </label>
      ))}

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
        {pending ? "Generating..." : "Generate content"}
      </button>
    </form>
  );
}