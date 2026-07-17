import { GenerateurDocument } from "../core/GenerateurDocument.js";
import type { DonneesDocument, Totaux } from "../domain/types.js";

export class FactureGenerator extends GenerateurDocument {
  protected override titre(): string {
    return "Facture";
  }

  protected override calculerTotaux(donnees: DonneesDocument): Totaux {
    return this.finaliserTotaux("Total HT", this.sousTotalHT(donnees));
  }

  protected override mentionLegale(): string {
    return "Paiement à 30 jours. Pénalités de retard : 3 fois le taux d'intérêt légal. Indemnité forfaitaire pour frais de recouvrement : 40 €.";
  }
}
