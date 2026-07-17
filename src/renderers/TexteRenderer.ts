import type { Renderer } from "../core/Renderer.js";
import type { DocumentProps, EnTeteProps, SectionProps, TableauProps } from "../core/types.js";

export class TexteRenderer implements Renderer {
  public readonly extension = "txt";

  public enTete({ titre, numero, date }: EnTeteProps): string {
    const barre = "=".repeat(titre.length);
    return `${titre.toUpperCase()}\n${barre}\nN° ${numero} — ${date}`;
  }

  public section({ titre, lignes }: SectionProps): string {
    const contenu = lignes.map((l) => `  - ${l}`).join("\n");
    return `${titre} :\n${contenu}`;
  }

  public tableau({ entetes, lignes }: TableauProps): string {
    const toutes = [entetes, ...lignes];
    const largeurs = entetes.map((_, colonne) =>
      Math.max(...toutes.map((ligne) => (ligne[colonne] ?? "").length)),
    );

    const formater = (ligne: readonly string[]): string =>
      ligne
        .map((cellule, i) => cellule.padEnd(largeurs[i] ?? 0))
        .join(" | ")
        .trimEnd();

    const separateur = largeurs.map((l) => "-".repeat(l)).join("-+-");

    return [formater(entetes), separateur, ...lignes.map(formater)].join("\n");
  }

  public paragraphe(texte: string): string {
    return texte;
  }

  public assembler({ sections }: DocumentProps): string {
    return sections.join("\n\n");
  }
}
