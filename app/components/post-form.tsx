"use client";

import { useActionState } from "react";

import type { FormState } from "@/app/actions";

const initialState: FormState = {};

export function PostForm({
  action,
  submitLabel,
  defaultValues,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  defaultValues?: {
    title?: string;
    body?: string;
  };
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="stack">
      <label className="field">
        <span>Title</span>
        <input
          type="text"
          name="title"
          minLength={1}
          maxLength={200}
          defaultValue={defaultValues?.title ?? ""}
          required
        />
      </label>
      <label className="field">
        <span>Body</span>
        <textarea
          name="body"
          minLength={1}
          maxLength={10000}
          rows={18}
          defaultValue={defaultValues?.body ?? ""}
          required
        />
      </label>
      {state.error ? <p className="error">{state.error}</p> : null}
      <button type="submit" className="button" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
