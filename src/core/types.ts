export type CelluleTableau = string;

export type LigneTableau = readonly CelluleTableau[];

export interface EnTeteProps {
  readonly titre: string;
  readonly numero: string;
  readonly date: string;
}

export interface SectionProps {
  readonly titre: string;
  readonly lignes: readonly string[];
}

export interface TableauProps {
  readonly entetes: LigneTableau;
  readonly lignes: readonly LigneTableau[];
}

export interface DocumentProps {
  readonly titre: string;
  readonly sections: readonly string[];
}
