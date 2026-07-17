export interface Client {
  readonly nom: string;
  readonly adresse: string;
}

export interface LigneDocument {
  readonly designation: string;
  readonly quantite: number;
  readonly prixUnitaireHT: number;
}

export interface DonneesDocument {
  readonly numero: string;
  readonly date: string;
  readonly client: Client;
  readonly lignes: readonly LigneDocument[];
}

export interface Totaux {
  readonly libelleBase: string;
  readonly baseHT: number;
  readonly tauxTVA: number;
  readonly montantTVA: number;
  readonly totalTTC: number;
}
