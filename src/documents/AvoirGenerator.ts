import { GenerateurDocument } from "../core/GenerateurDocument.js";
import type { DonneesDocument, Totaux } from "../domain/types.js";

export class AvoirGenerator extends GenerateurDocument {
  protected override titre(): string {
    return "Avoir";
  }

  protected override calculerTotaux(donnees: DonneesDocument): Totaux {
    return this.finaliserTotaux("Total HT à rembourser", -this.sousTotalHT(donnees));
  }

  protected override mentionLegale(): string {
    return "Avoir à valoir sur une prochaine commande ou remboursable sous 15 jours.";
  }
}
