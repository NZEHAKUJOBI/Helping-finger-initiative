import type { ContactInfo } from "@/domain/types";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/Section";

export function TopBar({ contact }: { contact: ContactInfo }) {
  const phone = contact.phones[0];
  return (
    <div className="hidden bg-brand-950 text-xs text-white/75 md:block">
      <Container className="flex h-10 items-center justify-between gap-6">
        <p className="flex items-center gap-2">
          <Icon name="map" className="size-4 text-accent-400" />
          {contact.address.at(-1)}
        </p>
        <div className="flex items-center gap-6">
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-white">
            <Icon name="phone" className="size-4 text-accent-400" />
            {phone}
          </a>
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-white">
              <Icon name="mail" className="size-4 text-accent-400" />
              {contact.email}
            </a>
          )}
        </div>
      </Container>
    </div>
  );
}
