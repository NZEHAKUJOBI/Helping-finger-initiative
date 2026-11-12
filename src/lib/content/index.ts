import type { ContentRepository } from "./ContentRepository";
import { StaticContentRepository } from "./StaticContentRepository";

/** The one place that decides which content source the app uses. */
export const content: ContentRepository = new StaticContentRepository();

export type { ContentRepository };
