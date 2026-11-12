/** Shared contract between server actions and the client form renderer. */
export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[] | undefined>;
  /** Echo submitted values back so fields keep their input after a failed submit. */
  values?: Record<string, string>;
}

export const initialFormState: FormState = { status: "idle" };

export type FieldType = "text" | "email" | "tel" | "textarea" | "select";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  options?: { value: string; label: string }[];
  /** Spans both columns on wide screens. */
  wide?: boolean;
}
