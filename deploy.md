# Guide de Déploiement - devis.cemedis.app

## 🚀 Déploiement sur GitHub Pages

### 1. Configuration du domaine
Le fichier `CNAME` contient déjà le domaine :
```
devis.cemedis.app
```

### 2. Structure des fichiers pour GitHub
```
/
├── CNAME                          # Configuration du domaine
├── devis-dentaire.html           # Interface principale
├── devis-styles.css              # Styles CSS
├── devis-script.js               # Logique JavaScript
├── test-financement.html         # Page de test
├── index.html                    # Ancienne interface (compatibilité)
├── styles.css                    # Anciens styles (compatibilité)
├── script.js                     # Ancien script (compatibilité)
├── internalveasy.html            # Interface Veasy (compatibilité)
├── script-internalveasy.js       # Script Veasy (compatibilité)
├── README.md                     # Documentation
├── package.json                  # Configuration npm
├── .gitignore                   # Fichiers à ignorer
└── deploy.md                     # Ce guide
```

### 3. URLs de production

**Interface principale :**
```
https://devis.cemedis.app/devis-dentaire.html?idDevis=10960427&centre=Centre+Sant%C3%A9+Dentaire+Cr%C3%A9teil+Pointe+du+Lac&praticien=Doctor+MONTERO+GARCIA+Monica&date=24/09/2025&patientnom=F%20CHAOUCHE&patientprenom=Samia&wtype=%7B%22code_ccam%22%3A%22HBLD073%22%2C%22date%22%3A%2224%2F09%2F2025%22%2C%22tooth_number%22%3A%2246%22%2C%22price%22%3A%22440%2C00%22%2C%22libelle%22%3A%22Couronne%22%7D%2C%7B%22code_ccam%22%3A%22HBLD724%22%2C%22date%22%3A%2224%2F09%2F2025%22%2C%22tooth_number%22%3A%2246%22%2C%22price%22%3A%2260%2C00%22%2C%22libelle%22%3A%22Couronne+transitoire%22%7D%2C%7B%22code_ccam%22%3A%22HBLD745%22%2C%22date%22%3A%2224%2F09%2F2025%22%2C%22tooth_number%22%3A%2246%22%2C%22price%22%3A%22175%2C00%22%2C%22libelle%22%3A%22Inlay-core%22%7D&total=675&ss=132&mut=&rac=543&idCentre=3515&idPat=15019167&quotation_pdf=https%3A%2F%2Feurope-west9-pecapi-app.cloudfunctions.net%2Fstorage%2Fdownload%2FeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWxlbmFtZSI6ImRldmlzXzEwOTYwNDI3XzM1MTUucGRmIiwiaWF0IjoxNzU4NzI0NjQ1fQ.r-ole1hRjhNysi4EFPArME-UVpIyYQUJBiCTJdEv5_o%2F&idPodio=3170109246&br=5831950025152703&tel=0755017044&idPraticien=23070843&idCentre=3515&mail=samiachaouche516@gmail.com&logo=https://static.wixstatic.com/media/b07e07_829fb71a56b44b6b80e3974bd04a24d2~mv2.png
```

**Page de test :**
```
https://devis.cemedis.app/test-financement.html?idDevis=10960427&centre=Centre+Sant%C3%A9+Dentaire+Cr%C3%A9teil+Pointe+du+Lac&praticien=Doctor+MONTERO+GARCIA+Monica&date=24/09/2025&patientnom=F%20CHAOUCHE&patientprenom=Samia&wtype=%7B%22code_ccam%22%3A%22HBLD073%22%2C%22date%22%3A%2224%2F09%2F2025%22%2C%22tooth_number%22%3A%2246%22%2C%22price%22%3A%22440%2C00%22%2C%22libelle%22%3A%22Couronne%22%7D%2C%7B%22code_ccam%22%3A%22HBLD724%22%2C%22date%22%3A%2224%2F09%2F2025%22%2C%22tooth_number%22%3A%2246%22%2C%22price%22%3A%2260%2C00%22%2C%22libelle%22%3A%22Couronne+transitoire%22%7D%2C%7B%22code_ccam%22%3A%22HBLD745%22%2C%22date%22%3A%2224%2F09%2F2025%22%2C%22tooth_number%22%3A%2246%22%2C%22price%22%3A%22175%2C00%22%2C%22libelle%22%3A%22Inlay-core%22%7D&total=675&ss=132&mut=&rac=543&idCentre=3515&idPat=15019167&quotation_pdf=https%3A%2F%2Feurope-west9-pecapi-app.cloudfunctions.net%2Fstorage%2Fdownload%2FeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaWxlbmFtZSI6ImRldmlzXzEwOTYwNDI3XzM1MTUucGRmIiwiaWF0IjoxNzU4NzI0NjQ1fQ.r-ole1hRjhNysi4EFPArME-UVpIyYQUJBiCTJdEv5_o%2F&idPodio=3170109246&br=5831950025152703&tel=0755017044&idPraticien=23070843&idCentre=3515&mail=samiachaouche516@gmail.com&logo=https://static.wixstatic.com/media/b07e07_829fb71a56b44b6b80e3974bd04a24d2~mv2.png
```

### 4. Configuration DNS
Assurer que le domaine `devis.cemedis.app` pointe vers GitHub Pages :
```
Type: CNAME
Name: devis
Value: cemedis.github.io
```

### 5. Configuration GitHub Pages
1. Aller dans Settings > Pages
2. Source : Deploy from a branch
3. Branch : main
4. Folder : / (root)
5. Custom domain : devis.cemedis.app
6. Enforce HTTPS : ✅

### 6. Tests de déploiement
- [ ] Vérifier que `devis.cemedis.app` fonctionne
- [ ] Tester l'interface avec les paramètres réels
- [ ] Vérifier le logo du centre
- [ ] Tester le système de financement
- [ ] Vérifier la responsivité mobile
- [ ] Tester le comparateur de mutuelles

### 7. Monitoring
- Surveiller les erreurs JavaScript dans la console
- Vérifier les appels API vers Veasy et Stripe
- Monitorer les performances de chargement

## 🔧 Configuration des APIs

### URLs de production à configurer
Dans `devis-script.js`, mettre à jour les URLs des webhooks :
```javascript
const CONFIG = {
    VEASY_WEBHOOK_URL: 'https://votre-webhook-veasy.com',
    STRIPE_WEBHOOK_URL: 'https://votre-webhook-stripe.com'
};
```

## 📱 Compatibilité navigateurs
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari 14+
- Chrome Mobile 90+

## 🚨 Points d'attention
1. **HTTPS obligatoire** pour les APIs de paiement
2. **CORS** configuré pour les domaines autorisés
3. **CSP** (Content Security Policy) si nécessaire
4. **Cache** des assets statiques optimisé
5. **Monitoring** des erreurs en production

---

**Prêt pour le déploiement ! 🚀**
