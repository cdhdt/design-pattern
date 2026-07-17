# FacturoPlus

Génération de docs commerciaux (devis, facture, avoir, bon de livraison) a partir d'une logique commune. Projet réalisé pour l'évaluation sur les design patterns, en TS. C'est un poc qui montre l'utilisation de trois patterns (Template Method, Strategy, Factory) pour eviter la duplication de code.

## Le problème

Au départ chaque document est fait dans son coin, en copiant le précédent et en changeant deux ou trois choses comme le titre une section ou le calcul du total. Le souci c'est que quand on corrige un bug dans la partie commune il faut le refaire dans chaque copie, et ajouter un type de document veut dire dupliquer encore un fichier entier. Au bout d'un moment on sait plus ce qui est vraiment different entre deux documents et ce qui a juste divergé.

Le but c'est donc d'écrire la logique commune une seule fois, d'isoler les variations et de pouvoir ajouter un type sans toucher a l'existant.

## Les patterns choisis

Il y a deux choses qui varient et pas de la même façon. Le type de document (titre, sections, calcul) et le format de sortie (HTML ou texte). Du coup j'ai utilisé deux patterns plus une factory pour faire le lien. Le Template Method gère le type de document, le Strategy gère le format de sortie et la Factory retrouve la bonne classe a partir d'un nom.

Le squelette et les helpers comme le calcul de la TVA ou le tableau des lignes sont écrits une fois dans la classe de base. Chaque document redéfinit juste ce qui le concerne, souvent 10 a 15 lignes. C'est ça qui permet de réutiliser le commun tout en laissant les variantes.

### Template Method (le type de document)

La classe de base `GenerateurDocument` a une méthode `generer()` qui fixe l'ordre des étapes une bonne fois pour toutes.

```
en-tête → client → lignes → totaux → conditions → mention légale → pied de page
```

Certaines étapes sont optionnelles (totaux, conditions, mention) et sont ajoutées seulement si le document les fournit, par exemple un bon de livraison n'a pas de total. Chaque sous-classe remplit ce qui la concerne. Le titre et le calcul du total sont obligatoires, le reste comme afficher les prix ou pas, les conditions ou la mention légale a une valeur par défaut qu'on redéfinit seulement si besoin. Le bon de livraison par exemple redéfinit juste le fait de pas afficher les prix et de pas avoir de total et il garde tout le reste du squelette.

### Strategy (le format de sortie)

Un devis en HTML et un devis en texte c'est le même calcul, juste une présentation differente. Si on gérait ça avec de l'héritage on se retrouverait avec `DevisHtml`, `DevisTexte`, `FactureHtml` et ça explose vite. A la place une interface `Renderer` décrit les briques d'affichage comme l'en-tête, une section ou un tableau, sans dire comment les fabriquer, et chaque format l'implémente a sa manière avec `HtmlRenderer` et `TexteRenderer`. Le générateur reçoit un renderer et l'utilise sans savoir lequel c'est. Ajouter un export PDF plus tard reviendrait a écrire une classe de plus sans toucher aux documents.

### Factory

`DocumentFactory` et `RendererFactory` associent un nom (`"facture"`, `"html"`) a la bonne classe pour pas avoir a faire des `new` un peu partout. C'est ce que la CLI utilise pour proposer les choix a l'utilisateur.

## Les documents implémentés

Quatre types sont faits alors que l'énoncé en demandait au moins deux. La facture fait un total HT plus TVA avec une mention légale de paiement. Le devis applique une remise de 5% au dela de 1000€ HT avec des conditions de validité. L'avoir reprend la même base qu'une facture mais en montants négatifs pour un remboursement. Le bon de livraison n'a pas de prix ni de total, juste les quantités.

## Lancer le projet

Il faut Node 20 ou plus.

```
npm install
npm run dev
```

La CLI pose trois questions. Le type de document, le format (html ou texte) et si on veut afficher le résultat a l'écran ou l'écrire dans un fichier (dossier `out/`). Les données utilisées sont des données d'exemple dans `data/exemple.json`, l'énoncé autorise a simuler la génération j'ai donc pris la liberté de générer les datas d'exemple.
