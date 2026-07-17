import type { GenerateurDocument } from "../core/GenerateurDocument.js";
import type { Renderer } from "../core/Renderer.js";
import { AvoirGenerator } from "../documents/AvoirGenerator.js";
import { BonLivraisonGenerator } from "../documents/BonLivraisonGenerator.js";
import { DevisGenerator } from "../documents/DevisGenerator.js";
import { FactureGenerator } from "../documents/FactureGenerator.js";
import type { ConstructeurGenerateur, TypeDocument } from "./types.js";

const REGISTRE: Record<TypeDocument, ConstructeurGenerateur> = {
  facture: FactureGenerator,
  devis: DevisGenerator,
  avoir: AvoirGenerator,
  "bon-livraison": BonLivraisonGenerator,
};

export function creerGenerateur(type: TypeDocument, renderer: Renderer): GenerateurDocument {
  return new REGISTRE[type](renderer);
}

export function typesDisponibles(): TypeDocument[] {
  return Object.keys(REGISTRE) as TypeDocument[];
}
