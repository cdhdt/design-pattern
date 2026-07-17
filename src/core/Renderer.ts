import type { DocumentProps, EnTeteProps, SectionProps, TableauProps } from "./types.js";

export interface Renderer {
  readonly extension: string;

  enTete(props: EnTeteProps): string;
  section(props: SectionProps): string;
  tableau(props: TableauProps): string;
  paragraphe(texte: string): string;
  assembler(props: DocumentProps): string;
}
