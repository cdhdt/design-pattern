import type { DonneesDocument, LigneDocument, Totaux } from "../domain/types.js";
import type { Renderer } from "./Renderer.js";
import { euros, TAUX_TVA } from "../domain/monnaie.js";

export abstract class GenerateurDocument {
  constructor(protected readonly renderer: Renderer) {}

  public generer(donnees: DonneesDocument): string {
    const titre = this.titre();
    const sections: string[] = [
      this.renderer.enTete({ titre, numero: donnees.numero, date: donnees.date }),
      this.sectionClient(donnees),
      this.sectionLignes(donnees),
    ];

    const totaux = this.calculerTotaux(donnees);
    if (totaux !== null) {
      sections.push(this.sectionTotaux(totaux));
    }

    const conditions = this.conditionsParticulieres();
    if (conditions !== null) {
      sections.push(this.renderer.section({ titre: "Conditions", lignes: conditions }));
    }

    const mention = this.mentionLegale();
    if (mention !== null) {
      sections.push(this.renderer.paragraphe(mention));
    }

    sections.push(this.renderer.paragraphe(this.piedDePage()));

    return this.renderer.assembler({ titre, sections });
  }

  protected abstract titre(): string;
  protected abstract calculerTotaux(donnees: DonneesDocument): Totaux | null;

  protected afficherPrix(): boolean {
    return true;
  }

  protected conditionsParticulieres(): readonly string[] | null {
    return null;
  }

  protected mentionLegale(): string | null {
    return null;
  }

  protected sousTotalHT(donnees: DonneesDocument): number {
    return donnees.lignes.reduce((somme, ligne) => somme + this.montantLigne(ligne), 0);
  }

  protected finaliserTotaux(libelleBase: string, baseHT: number): Totaux {
    const montantTVA = baseHT * TAUX_TVA;
    return {
      libelleBase,
      baseHT,
      tauxTVA: TAUX_TVA,
      montantTVA,
      totalTTC: baseHT + montantTVA,
    };
  }

  private montantLigne(ligne: LigneDocument): number {
    return ligne.quantite * ligne.prixUnitaireHT;
  }

  protected piedDePage(): string {
    return "FacturoPlus SARL — 12 rue des Lilas, 75011 Paris — SIRET 123 456 789 00012";
  }

  private sectionClient(donnees: DonneesDocument): string {
    return this.renderer.section({
      titre: "Client",
      lignes: [donnees.client.nom, donnees.client.adresse],
    });
  }

  private sectionLignes(donnees: DonneesDocument): string {
    if (!this.afficherPrix()) {
      return this.renderer.tableau({
        entetes: ["Désignation", "Qté"],
        lignes: donnees.lignes.map((ligne) => [ligne.designation, String(ligne.quantite)]),
      });
    }

    const lignes = donnees.lignes.map((ligne) => [
      ligne.designation,
      String(ligne.quantite),
      euros(ligne.prixUnitaireHT),
      euros(this.montantLigne(ligne)),
    ]);

    return this.renderer.tableau({
      entetes: ["Désignation", "Qté", "P.U. HT", "Total HT"],
      lignes,
    });
  }

  private sectionTotaux(totaux: Totaux): string {
    const pourcentage = `${Math.round(totaux.tauxTVA * 100).toString()} %`;

    return this.renderer.section({
      titre: "Totaux",
      lignes: [
        `${totaux.libelleBase} : ${euros(totaux.baseHT)}`,
        `TVA (${pourcentage}) : ${euros(totaux.montantTVA)}`,
        `Total TTC : ${euros(totaux.totalTTC)}`,
      ],
    });
  }
}
