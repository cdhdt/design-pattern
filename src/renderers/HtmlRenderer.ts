import type { Renderer } from "../core/Renderer.js";
import type { DocumentProps, EnTeteProps, SectionProps, TableauProps } from "../core/types.js";

export class HtmlRenderer implements Renderer {
  public readonly extension = "html";

  public enTete({ titre, numero, date }: EnTeteProps): string {
    return `<header>
  <h1>${echapper(titre)}</h1>
  <p class="meta">N° ${echapper(numero)} — ${echapper(date)}</p>
</header>`;
  }

  public section({ titre, lignes }: SectionProps): string {
    const contenu = lignes.map((l) => `    <li>${echapper(l)}</li>`).join("\n");
    return `<section>
  <h2>${echapper(titre)}</h2>
  <ul>
${contenu}
  </ul>
</section>`;
  }

  public tableau({ entetes, lignes }: TableauProps): string {
    const thead = entetes.map((e) => `<th>${echapper(e)}</th>`).join("");
    const tbody = lignes
      .map((ligne) => {
        const cellules = ligne.map((c) => `<td>${echapper(c)}</td>`).join("");
        return `    <tr>${cellules}</tr>`;
      })
      .join("\n");

    return `<table>
  <thead><tr>${thead}</tr></thead>
  <tbody>
${tbody}
  </tbody>
</table>`;
  }

  public paragraphe(texte: string): string {
    return `<p>${echapper(texte)}</p>`;
  }

  public assembler({ titre, sections }: DocumentProps): string {
    return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>${echapper(titre)}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 46rem; margin: 2rem auto; color: #222; }
    h1 { margin-bottom: 0; }
    .meta { color: #666; margin-top: .25rem; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: .5rem; text-align: left; }
    th { background: #f5f5f5; }
    ul { list-style: none; padding: 0; }
  </style>
</head>
<body>
${sections.join("\n\n")}
</body>
</html>`;
  }
}

function echapper(texte: string): string {
  return texte
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
