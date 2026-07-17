#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { creerGenerateur, typesDisponibles } from "./factory/DocumentFactory.js";
import { creerRenderer, formatsDisponibles } from "./renderers/RendererFactory.js";
import type { DonneesDocument } from "./domain/types.js";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");

function chargerDonnees(): DonneesDocument {
  const chemin = join(RACINE, "data", "exemple.json");
  return JSON.parse(readFileSync(chemin, "utf8")) as DonneesDocument;
}

const rl = createInterface({ input, output });

const arret = new AbortController();
rl.once("close", () => {
  arret.abort();
});

async function choisir<T extends string>(libelle: string, options: readonly T[]): Promise<T> {
  const liste = options.map((option, i) => `  ${(i + 1).toString()}) ${option}`).join("\n");

  // le ;; sert a créer une boucle infinie, on sort de la boucle uniquement avec un return
  for (;;) {
    const reponse = (
      await rl.question(`${libelle} :\n${liste}\n> `, { signal: arret.signal })
    ).trim();

    const parNumero = options[Number(reponse) - 1];
    if (parNumero !== undefined) {
      return parNumero;
    }
    if ((options as readonly string[]).includes(reponse)) {
      return reponse as T;
    }

    console.log(`Choix invalide : ${reponse}\n`);
  }
}

try {
  const type = await choisir("Type de document", typesDisponibles());
  const format = await choisir("Format de sortie", formatsDisponibles());
  const destination = await choisir("Sortie", ["écran", "fichier"] as const);

  const renderer = creerRenderer(format);
  const document = creerGenerateur(type, renderer).generer(chargerDonnees());

  if (destination === "fichier") {
    const dossier = join(RACINE, "out");
    mkdirSync(dossier, { recursive: true });
    const chemin = join(dossier, `${type}.${renderer.extension}`);
    writeFileSync(chemin, document, "utf8");
    console.log(`\nÉcrit : ${chemin}`);
  } else {
    console.log(`\n${document}`);
  }
} catch (erreur) {
  if (!arret.signal.aborted) {
    throw erreur;
  }
  output.write("\n");
} finally {
  rl.close();
}
