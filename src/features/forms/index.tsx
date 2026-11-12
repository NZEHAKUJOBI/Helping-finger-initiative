import { submitContact, submitPartner, submitVolunteer } from "./actions";
import { FormRenderer } from "./FormRenderer";
import type { FieldConfig } from "./types";

const contactFields: FieldConfig[] = [
  { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "subject", label: "Subject", type: "text", required: true },
  { name: "message", label: "Message", type: "textarea", required: true, wide: true },
];

const volunteerFields: FieldConfig[] = [
  { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel" },
  { name: "location", label: "Town / LGA", type: "text", required: true, placeholder: "e.g. Birnin Kebbi" },
  {
    name: "interests",
    label: "Programmes you'd like to support",
    type: "text",
    required: true,
    wide: true,
    placeholder: "e.g. Education, health outreach, women's empowerment",
  },
  { name: "skills", label: "Skills and experience", type: "textarea", wide: true },
];

const partnerFields: FieldConfig[] = [
  { name: "organisation", label: "Organisation", type: "text", required: true, autoComplete: "organization" },
  {
    name: "partnerType",
    label: "Organisation type",
    type: "select",
    required: true,
    options: [
      { value: "government", label: "Government ministry / agency" },
      { value: "ngo", label: "Local or international NGO" },
      { value: "corporate", label: "Corporate / business" },
      { value: "foundation", label: "Philanthropist / foundation" },
      { value: "community", label: "Community-based organisation" },
      { value: "faith-based", label: "Faith-based organisation" },
      { value: "other", label: "Other" },
    ],
  },
  { name: "contactName", label: "Contact person", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "message", label: "How would you like to work together?", type: "textarea", required: true, wide: true },
];

export const ContactForm = () => (
  <FormRenderer action={submitContact} fields={contactFields} submitLabel="Send message" />
);
export const VolunteerForm = () => (
  <FormRenderer action={submitVolunteer} fields={volunteerFields} submitLabel="Sign up to volunteer" />
);
export const PartnerForm = () => (
  <FormRenderer action={submitPartner} fields={partnerFields} submitLabel="Send partnership enquiry" />
);
