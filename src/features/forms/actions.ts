"use server";

import { contactSchema, partnerSchema, volunteerSchema } from "@/domain/schemas";
import { handleForm } from "./handleForm";
import type { FormState } from "./types";

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  return handleForm(contactSchema, formData, {
    subject: (d) => `Website enquiry: ${d.subject}`,
    replyTo: (d) => d.email,
    successMessage: "Thank you for reaching out. We will get back to you soon.",
  });
}

export async function submitVolunteer(_prev: FormState, formData: FormData): Promise<FormState> {
  return handleForm(volunteerSchema, formData, {
    subject: (d) => `New volunteer: ${d.name}`,
    replyTo: (d) => d.email,
    successMessage: "Thank you for offering your time! Our team will contact you about next steps.",
  });
}

export async function submitPartner(_prev: FormState, formData: FormData): Promise<FormState> {
  return handleForm(partnerSchema, formData, {
    subject: (d) => `Partnership enquiry: ${d.organisation}`,
    replyTo: (d) => d.email,
    successMessage: "Thank you for your interest in partnering with us. We will be in touch shortly.",
  });
}
