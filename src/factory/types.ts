import type { GenerateurDocument } from "../core/GenerateurDocument.js";
import type { Renderer } from "../core/Renderer.js";

export type TypeDocument = "facture" | "devis" | "avoir" | "bon-livraison";

export type ConstructeurGenerateur = new (renderer: Renderer) => GenerateurDocument;
