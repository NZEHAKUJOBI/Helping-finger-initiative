import type { z } from "zod";
import { mail } from "@/lib/mail";
import type { FormState } from "./types";

/**
 * Template method for every form submission:
 * read FormData → validate with Zod → notify → return a typed FormState.
 */
export async function handleForm<S extends z.ZodType<Record<string, unknown>>>(
  schema: S,
  formData: FormData,
  options: {
    subject: (data: z.infer<S>) => string;
    replyTo?: (data: z.infer<S>) => string | undefined;
    successMessage: string;
  },
): Promise<FormState> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$")) values[key] = value;
  }

  // Honeypot: real users never fill this hidden field.
  if (values.company_website) {
    return { status: "success", message: options.successMessage };
  }

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      (errors[key] ??= []).push(issue.message);
    }
    return { status: "error", message: "Please correct the highlighted fields.", errors, values };
  }

  try {
    const data = parsed.data;
    await mail.send({
      subject: options.subject(data),
      replyTo: options.replyTo?.(data),
      fields: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v == null ? undefined : String(v)])),
    });
    return { status: "success", message: options.successMessage };
  } catch (error) {
    console.error("[form] delivery failed", error);
    return {
      status: "error",
      message: "Sorry, we could not send your message. Please call us instead.",
      values,
    };
  }
}
