import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { VolunteerForm } from "@/features/forms";

export const metadata: Metadata = {
  title: "Volunteer",
  description: "Give your time, skills and experience to support community interventions.",
};

export default function VolunteerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Volunteer"
        title="Give your time. Change a life."
        intro="Anyone who shares our vision and is willing to contribute skills, knowledge and experience is welcome to join us as a volunteer."
      />
      <Section>
        <Card className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-extrabold">Volunteer sign-up</h2>
          <VolunteerForm />
        </Card>
      </Section>
    </>
  );
}
