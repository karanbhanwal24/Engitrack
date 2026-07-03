"use client";

import { useActionState } from "react";

import { signUp, type FormState } from "@/app/actions";

const initialState: FormState = {};

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <form action={formAction} className="stack">
      <label className="field">
        <span>Name</span>
        <input type="text" name="name" required maxLength={80} />
      </label>
      <label className="field">
        <span>Email</span>
        <input type="email" name="email" required />
      </label>
      <label className="field">
        <span>Password</span>
        <input type="password" name="password" required minLength={8} />
      </label>
      {state.error ? <p className="error">{state.error}</p> : null}
      <button type="submit" className="button" disabled={pending}>
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
