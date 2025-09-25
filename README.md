# Ma PEC - Interface de Prise en Charge Dentaire

## Description
Interface moderne et responsive pour la gestion des prises en charge dentaires, développée spécifiquement pour remplacer l'interface actuelle de "Ma prise en charge".

## Fonctionnalités

### 🏥 **Ma PEC**
- Affichage des informations générales de la prise en charge
- Résumé financier complet (Total, SS, Mutuelle, À votre charge)
- Informations détaillées du patient (nom, prénom, téléphone, email)

### 🦷 **Mon Traitement**
- Tableau détaillé du plan de traitement
- Colonnes optimisées : Date (réduite), Acte, Dent, Honoraires
- Responsive design pour mobile et desktop

### 💰 **Mes Remboursements**
- Détail des remboursements Sécurité Sociale
- Complément mutuelle
- Calcul du reste à charge

### 💳 **Financement**
- Options de paiement : Klarna 3x 4x, Oney 3x 4x, Cartes Bancaires
- Slider interactif pour sélectionner le montant à financer
- Intégration API Stripe et Veasy SSP

### 🔍 **Comparateur Mutuelles**
- Iframe intégré Google Looker Studio
- Zoom optimisé (75%)
- Lien vers le comparateur officiel 100 Santé

## Paramètres URL

| Paramètre | Description | Exemple |
|-----------|-------------|---------|
| `idDevis` | Identifiant de la PEC | 10961489 |
| `centre` | Nom du centre dentaire | Centre Dentaire Pontault-Emerainville |
| `praticien` | Nom du praticien | M. CHIKH Adil |
| `date` | Date de la PEC | 25/09/25 |
| `patientnom` | Nom du patient | FOURNOT |
| `patientprenom` | Prénom du patient | Micke |
| `total` | Montant total | 500 |
| `ss` | Remboursement Sécurité Sociale | 78 |
| `mut` | Remboursement Mutuelle | 422 |
| `rac` | Remboursement RAC | 0 |
| `tel` | Téléphone du patient | 0669472661 |
| `mail` | Email du patient | work:mickefournot@gmail.com |
| `logo` | URL du logo du centre | https://static.wixstatic.com/... |

## Structure du Projet

```
cemedis-ma-pec-v2/
├── ma-prise-en-charge.html    # Interface principale
├── ma-pec-styles.css          # Styles CSS responsive
├── ma-pec-script.js           # Logique JavaScript
├── test-pec.html              # Page de test
├── CNAME                      # Configuration domaine
└── README.md                  # Documentation
```

## Test

### Test Local
1. Ouvrir `test-pec.html` dans un navigateur
2. Cliquer sur "Ouvrir Ma PEC" pour tester l'interface complète

### Test avec Serveur Local
```bash
# Démarrer un serveur local
python -m http.server 8000

# Accéder à l'interface
http://localhost:8000/test-pec.html
```

## Déploiement

### GitHub Pages
1. Créer un nouveau repository GitHub
2. Uploader tous les fichiers du projet
3. Activer GitHub Pages dans les paramètres
4. Le domaine `pec.cemedis.app` sera automatiquement configuré

### URL de Production
```
https://pec.cemedis.app/ma-prise-en-charge.html?idDevis=10961489&centre=Centre+Dentaire+Pontault-Emerainville&praticien=M.+CHIKH+Adil&date=25/09/25&patientnom=FOURNOT&patientprenom=Micke&total=500&ss=78&mut=422&rac=0&idCentre=3843&idPat=26868898&quotation_pdf=https://cemedis.app/W9sTQN9OUmHcsX6KZV0H&idPodio=3170719791&br=3292952679095559&tel=0669472661&idPraticien=22960405&idCentre=3843&mail=work:mickefournot@gmail.com&logo=https://static.wixstatic.com/media/b07e07_3003a06c5f8c4e0e8e019707a0f94594~mv2.png
```

## Caractéristiques Techniques

### ✅ **Responsive Design**
- Mobile-first approach
- Breakpoints : 768px, 480px
- Colonne Date optimisée pour mobile (70px sur très petit écran)

### ✅ **Performance**
- CSS optimisé avec variables
- JavaScript modulaire
- Images avec fallback SVG

### ✅ **Accessibilité**
- Navigation au clavier
- Contraste optimisé
- Icônes Font Awesome

### ✅ **Intégrations**
- API Stripe pour cartes bancaires
- API Veasy SSP pour paiement échelonné
- Google Looker Studio pour comparateur mutuelles

## Différences avec l'Interface Actuelle

### ❌ **Supprimé**
- Boutons "Télécharger le PDF" et "Signer le Devis"
- Section signature complexe
- Chat widget

### ✅ **Ajouté**
- Interface moderne et responsive
- Navigation par onglets intuitive
- Résumé financier visuel
- Options de financement intégrées
- Comparateur mutuelles embarqué

### 🔄 **Amélioré**
- Design moderne avec gradients et ombres
- Animations fluides
- Mobile-first responsive
- Gestion d'erreurs robuste
- Notifications utilisateur

## Support

Pour toute question ou problème :
1. Vérifier la console du navigateur pour les erreurs
2. Tester avec les paramètres d'exemple fournis
3. Vérifier la compatibilité mobile/desktop
