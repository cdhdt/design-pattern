import { GenerateurDocument } from "../core/GenerateurDocument.js";

export class BonLivraisonGenerator extends GenerateurDocument {
  protected override titre(): string {
    return "Bon de livraison";
  }

  protected override calculerTotaux(): null {
    return null;
  }

  protected override afficherPrix(): boolean {
    return false;
  }

  protected override conditionsParticulieres(): readonly string[] {
    return [
      "Marchandise à vérifier en présence du livreur.",
      "Toute réserve doit être notée sur le bon et confirmée sous 3 jours.",
    ];
  }
}
