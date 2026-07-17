import { GenerateurDocument } from "../core/GenerateurDocument.js";
import { euros } from "../domain/monnaie.js";
import type { DonneesDocument, Totaux } from "../domain/types.js";

const SEUIL_REMISE = 1000;
const TAUX_REMISE = 0.05;

export class DevisGenerator extends GenerateurDocument {
  protected override titre(): string {
    return "Devis";
  }

  protected override calculerTotaux(donnees: DonneesDocument): Totaux {
    const brut = this.sousTotalHT(donnees);
    const remise = brut > SEUIL_REMISE ? brut * TAUX_REMISE : 0;
    const libelleBase = remise > 0 ? `Total HT après remise de ${euros(remise)}` : "Total HT";

    return this.finaliserTotaux(libelleBase, brut - remise);
  }

  protected override conditionsParticulieres(): readonly string[] {
    return [
      "Devis valable 30 jours à compter de sa date d'émission.",
      "Remise commerciale de 5 % appliquée au-delà de 1 000 € HT.",
      "À retourner signé avec la mention « bon pour accord ».",
    ];
  }
}
