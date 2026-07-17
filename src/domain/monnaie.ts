export const TAUX_TVA = 0.2; // a voir si on passe en mode dynamique en fonction des produits pour la facturation apres

export function euros(montant: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(montant);
}
