// Configuration et état global
const CONFIG = {
    chatWebhookUrl: 'https://n8n.cemedis.app/webhook/49649438-6273-49e0-89fa-6d63e70aa6a5/chat',
    signatureUrl: 'https://form.jotform.com/250513430698053',
    financementUrl: 'https://app.applications-cemedis.fr/mondevis/financement',
    stripeApiUrl: 'https://europe-west1-pecapi-app.cloudfunctions.net/veasy_get_stripe_link',
    sspApiUrl: 'https://europe-west1-pecapi-app.cloudfunctions.net/veasy_get_ssp_link',
    authHeader: 'Basic dmVhc3k6SnJlUDZSejMz'
};

let currentSection = 'devis';
let treatmentData = [];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    populateTreatmentTable();
    initializeFinancing();
    initializeCentreLogo();
});

// Initialisation de l'application
function initializeApp() {
    console.log('Initialisation de l\'interface de devis dentaire');
    
    // Remplir les informations du patient depuis les paramètres URL
    populatePatientInfo();
    
    // Vérifier la présence des éléments requis
    const requiredElements = [
        'devis-id',
        'treatment-table',
        'download-btn',
        'sign-btn'
    ];
    
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.warn(`Élément requis non trouvé: ${id}`);
        }
    });
    
    // Initialiser les animations
    animateElements();
}

// Remplir les informations du patient
function populatePatientInfo() {
    const idDevis = getUrlParameter('idDevis') || getUrlParameter('id') || '-';
    const patientNom = getUrlParameter('patientnom') || '';
    const patientPrenom = getUrlParameter('patientprenom') || '';
    const centre = getUrlParameter('centre') || '';
    const praticien = getUrlParameter('praticien') || '';
    const date = getUrlParameter('date') || '';
    
    // Mettre à jour les éléments
    const devisIdElement = document.getElementById('devis-id');
    if (devisIdElement) {
        devisIdElement.textContent = idDevis;
    }
    
    const patientNameElement = document.getElementById('patient-name');
    if (patientNameElement) {
        patientNameElement.textContent = `${patientNom} ${patientPrenom}`.trim() || '-';
    }
    
    const centreNameElement = document.getElementById('centre-name');
    if (centreNameElement) {
        centreNameElement.textContent = centre || '-';
    }
    
    const praticienNameElement = document.getElementById('praticien-name');
    if (praticienNameElement) {
        praticienNameElement.textContent = praticien || '-';
    }
    
    const devisDateElement = document.getElementById('devis-date');
    if (devisDateElement) {
        devisDateElement.textContent = date || '-';
    }
    
    // Remplir les montants financiers
    populateFinancialInfo();
    
    console.log('Informations patient mises à jour:', {
        idDevis, patientNom, patientPrenom, centre, praticien, date
    });
}

// Remplir les informations financières
function populateFinancialInfo() {
    const total = getUrlParameter('total') || '0';
    const ss = getUrlParameter('ss') || '0';
    const mut = getUrlParameter('mut') || '0';
    const rac = getUrlParameter('rac') || '0';
    
    // Mettre à jour les éléments financiers
    const totalElement = document.getElementById('total-amount');
    if (totalElement) {
        totalElement.textContent = `${total} €`;
    }
    
    const ssElement = document.getElementById('ss-amount');
    if (ssElement) {
        ssElement.textContent = `${ss} €`;
    }
    
    const mutElement = document.getElementById('mut-amount');
    if (mutElement) {
        mutElement.textContent = `${mut} €`;
    }
    
    const racElement = document.getElementById('rac-amount');
    if (racElement) {
        racElement.textContent = `${rac} €`;
    }
    
    // Mettre à jour aussi le montant dans la section financement
    const totalFinancementElement = document.getElementById('total-amount-financement');
    if (totalFinancementElement) {
        totalFinancementElement.textContent = `${rac} €`;
    }
    
    // Mettre à jour les montants dans la section remboursements
    const ssRemboursementsElement = document.getElementById('ss-amount-remboursements');
    if (ssRemboursementsElement) {
        ssRemboursementsElement.textContent = `${ss} €`;
    }
    
    const mutRemboursementsElement = document.getElementById('mut-amount-remboursements');
    if (mutRemboursementsElement) {
        mutRemboursementsElement.textContent = `${mut} €`;
    }
    
    const racRemboursementsElement = document.getElementById('rac-amount-remboursements');
    if (racRemboursementsElement) {
        racRemboursementsElement.textContent = `${rac} €`;
    }
    
    console.log('Informations financières mises à jour:', {
        total, ss, mut, rac
    });
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            switchSection(section);
        });
    });
    
    // Boutons d'action
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownload);
    }
    
    // Le bouton de signature utilise onclick directement dans le HTML
    // Pas besoin d'ajouter un event listener ici
    
    
    // Modal de signature
    const modal = document.getElementById('signature-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSignatureModal();
            }
        });
    }
    
    // Fermeture avec Échap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSignatureModal();
        }
    });
}

// Changement de section
function switchSection(sectionId) {
    // Mettre à jour la navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
    
    // Afficher la section correspondante
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });
    
    currentSection = sectionId;
    
    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialisation du logo du centre
function initializeCentreLogo() {
    console.log('Initialisation du logo du centre...');
    const logoUrl = getUrlParameter('logo');
    const logoElement = document.getElementById('centre-logo');
    
    console.log('URL du logo:', logoUrl);
    console.log('Élément logo trouvé:', logoElement);
    
    if (logoUrl && logoElement) {
        logoElement.src = logoUrl;
        logoElement.alt = 'Logo du centre';
        console.log('Logo du centre chargé:', logoUrl);
    } else if (logoElement) {
        // Logo par défaut si aucun logo n'est fourni
        logoElement.src = 'https://static.wixstatic.com/media/b07e07_4e6857956a2649269649b1a9d3223d20~mv2.jpeg';
        logoElement.alt = 'Logo CEMEDIS';
        console.log('Logo CEMEDIS par défaut chargé');
    } else {
        console.log('Élément logo non trouvé');
    }
}

// Remplissage du tableau de traitement
function populateTreatmentTable() {
    const tableBody = document.getElementById('treatment-table-body');
    if (!tableBody) return;
    
    // Récupérer les données depuis l'URL ou utiliser des données d'exemple
    const wtypeParam = getUrlParameter('wtype');
    let data = [];
    
    if (wtypeParam) {
        try {
            data = parseTreatmentData(wtypeParam);
        } catch (error) {
            console.error('Erreur lors du parsing des données de traitement:', error);
            data = getSampleTreatmentData();
        }
    } else {
        data = getSampleTreatmentData();
    }
    
    treatmentData = data;
    
    // Vider le tableau
    tableBody.innerHTML = '';
    
    // Ajouter les lignes
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.date || 'N/A'}</td>
            <td>${item.libelle || 'Traitement non spécifié'}</td>
            <td>${item.tooth_number || 'N/A'}</td>
            <td>${item.price || '0'}€</td>
        `;
        tableBody.appendChild(row);
    });
    
    // Animation des lignes
    animateTableRows();
}

// Parsing des données de traitement depuis l'URL
function parseTreatmentData(wtypeParam) {
    try {
        // Décoder l'URL
        let decodedData = decodeURIComponent(wtypeParam);
        
        // S'assurer que c'est un tableau JSON valide
        if (!decodedData.startsWith('[')) {
            decodedData = '[' + decodedData + ']';
        }
        
        // Remplacer les caractères encodés
        decodedData = decodedData.replace(/\%22/g, '"');
        
        return JSON.parse(decodedData);
    } catch (error) {
        console.error('Erreur de parsing:', error);
        throw error;
    }
}

// Données d'exemple pour le traitement
function getSampleTreatmentData() {
    return [
        {
            tooth_number: '16',
            libelle: 'Couronne céramique',
            price: '450'
        },
        {
            tooth_number: '26',
            libelle: 'Inlay core',
            price: '320'
        },
        {
            tooth_number: '36',
            libelle: 'Couronne métallique',
            price: '280'
        }
    ];
}

// Gestion du téléchargement
function handleDownload() {
    const quotationPdf = getUrlParameter('quotation_pdf');
    
    if (quotationPdf) {
        try {
            const decodedUrl = decodeURIComponent(quotationPdf);
            window.open(decodedUrl, '_blank');
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            showNotification('Erreur lors du téléchargement du devis', 'error');
        }
    } else {
        showNotification('Aucun PDF de devis disponible', 'warning');
    }
}

// Gestion de la signature
function handleSignature() {
    const idDevis = getUrlParameter('idDevis') || getUrlParameter('id');
    const patientNom = getUrlParameter('patientnom');
    const patientPrenom = getUrlParameter('patientprenom');
    const praticien = getUrlParameter('praticien');
    const total = getUrlParameter('total');
    const ro = getUrlParameter('ro');
    const rc = getUrlParameter('mut');
    const rac = getUrlParameter('rac');
    
    if (!idDevis) {
        showNotification('ID du devis manquant', 'error');
        return;
    }
    
    // Construire l'URL de signature
    const signUrl = `${CONFIG.signatureUrl}?idDevis=${encodeURIComponent(idDevis)}&praticienName=${encodeURIComponent(praticien || '')}&patientName=${encodeURIComponent(patientNom || '')}+${encodeURIComponent(patientPrenom || '')}&total=${encodeURIComponent(total || '')}&ro=${encodeURIComponent(ro || '')}&rc=${encodeURIComponent(rc || '')}&rac=${encodeURIComponent(rac || '')}`;
    
    // Détecter si c'est un appareil mobile
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        // Sur mobile : afficher dans la modal
        showSignatureModal(signUrl);
    } else {
        // Sur desktop : ouvrir dans un nouvel onglet
        window.open(signUrl, '_blank');
    }
}

// Affichage de la modal de signature
function showSignatureModal(url) {
    const modal = document.getElementById('signature-modal');
    const iframe = document.getElementById('signature-iframe');
    
    if (modal && iframe) {
        // Remplir les informations du patient
        const patientNom = getUrlParameter('patientnom') || '';
        const patientPrenom = getUrlParameter('patientprenom') || '';
        const praticien = getUrlParameter('praticien') || '';
        const total = getUrlParameter('total') || '';
        
        // Mettre à jour les informations dans la modal
        const patientSpan = document.getElementById('signature-patient');
        const praticienSpan = document.getElementById('signature-praticien');
        const totalSpan = document.getElementById('signature-total');
        
        if (patientSpan) patientSpan.textContent = `${patientNom} ${patientPrenom}`;
        if (praticienSpan) praticienSpan.textContent = praticien;
        if (totalSpan) totalSpan.textContent = `${total} €`;
        
        // Charger l'URL JotForm dans l'iframe
        iframe.src = url;
        
        // Afficher la modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Fermeture de la modal de signature
function closeSignatureModal() {
    const modal = document.getElementById('signature-modal');
    const iframe = document.getElementById('signature-iframe');
    
    if (modal && iframe) {
        modal.style.display = 'none';
        iframe.src = '';
        document.body.style.overflow = 'auto';
    }
}





// Fonctions utilitaires
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}


function showNotification(message, type = 'info') {
    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Styles pour la notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// Animations
function animateElements() {
    // Animation des cartes au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observer les cartes
    const cards = document.querySelectorAll('.info-card, .remboursement-card, .financement-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

function animateTableRows() {
    const rows = document.querySelectorAll('#treatment-body tr');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

// Fonctions pour les liens externes
function openInfoPage(page) {
    const baseUrl = 'https://app.applications-cemedis.fr/mondevis/';
    const url = baseUrl + page;
    window.open(url, '_blank');
}

function openTreatmentInfo(treatment) {
    const baseUrl = 'https://app.applications-cemedis.fr/mondevis/';
    const url = baseUrl + treatment;
    window.open(url, '_blank');
}

// Fonction pour ouvrir le lien 100% Santé officiel
function open100Sante() {
    const url = 'https://sante.gouv.fr/systeme-de-sante/100pourcent-sante/100-sante-dentaire/';
    window.open(url, '_blank');
}

// Fonction pour ouvrir le comparateur de mutuelles
function openComparateurMutuelles() {
    switchSection('comparateur-mutuelles');
}

function openFinancement() {
    const params = new URLSearchParams({
        rac: getUrlParameter('rac') || '',
        idPraticien: getUrlParameter('idPraticien') || '',
        idCentre: getUrlParameter('idCentre') || '',
        patientName: getUrlParameter('patientnom') || '',
        patientSurname: getUrlParameter('patientprenom') || '',
        patientId: getUrlParameter('idpat') || '',
        patientPhone: getUrlParameter('tel') || '',
        patientMail: getUrlParameter('mail') || '',
        numFacture: getUrlParameter('idDevis') || getUrlParameter('id') || '',
        amount: getUrlParameter('rac') || '',
        itemid: getUrlParameter('idPodio') || '',
        beneficiary_reference: getUrlParameter('br') || ''
    });
    
    const url = `${CONFIG.financementUrl}?${params.toString()}`;
    window.open(url, '_blank');
}

function contactSupport() {
    showNotification('Fonctionnalité de contact en cours de développement', 'info');
}

// Initialisation du système de financement
function initializeFinancing() {
    console.log('Initialisation du système de financement');
    
    // Récupération et nettoyage du paramètre 'rac'
    let racRaw = getUrlParameter('rac') || '100';
    let rac = parseInt(racRaw.replace(/[^0-9]/g, ''));
    
    // Vérification de la valeur correcte
    if (isNaN(rac) || rac < 10) {
        rac = 100;
    }
    
    // Mise à jour de l'affichage du montant total
    const totalAmountElement = document.getElementById('total-amount');
    if (totalAmountElement) {
        totalAmountElement.textContent = `${rac} €`;
    }
    
    // Configuration du curseur
    const slider = document.getElementById('payment-slider');
    const selectedAmount = document.getElementById('selected-amount');
    
    if (slider && selectedAmount) {
        slider.max = rac;
        slider.value = rac;
        selectedAmount.textContent = `${rac} €`;
        
        slider.addEventListener('input', function() {
            selectedAmount.textContent = `${slider.value} €`;
        });
    }
    
    // Configuration des options de financement
    setupFinancingOptions();
}

// Configuration des options de financement
function setupFinancingOptions() {
    const klarnaOption = document.getElementById('klarna-financing');
    const veasyOption = document.getElementById('veasy-financing');
    const cbOption = document.getElementById('cb-financing');
    
    if (klarnaOption) {
        klarnaOption.addEventListener('click', () => handleFinancing('klarna'));
    }
    
    if (veasyOption) {
        veasyOption.addEventListener('click', () => handleFinancing('veasy'));
    }
    
    if (cbOption) {
        cbOption.addEventListener('click', () => handleFinancing('card'));
    }
}

// Gestion du financement
async function handleFinancing(paymentMethod) {
    const slider = document.getElementById('payment-slider');
    const amount = slider ? parseInt(slider.value) : parseInt(getUrlParameter('rac') || '100');
    
    console.log(`Traitement du financement ${paymentMethod} pour ${amount}€`);
    
    try {
        showNotification('Traitement de votre demande de financement...', 'info');
        
        let response;
        
        if (paymentMethod === 'veasy') {
            response = await handleVeasyFinancing(amount);
        } else {
            response = await handleStripeFinancing(amount, paymentMethod);
        }
        
        if (response && response.link) {
            window.location.href = response.link;
        } else {
            throw new Error('Aucun lien de paiement reçu');
        }
        
    } catch (error) {
        console.error('Erreur lors du financement:', error);
        showNotification('Erreur lors de la création du lien de paiement. Veuillez réessayer.', 'error');
    }
}

// Financement Veasy
async function handleVeasyFinancing(amount) {
    const payload = {
        "idPraticien": getUrlParameter('idPraticien'),
        "idCentre": getUrlParameter('idCentre'),
        "patientName": getUrlParameter('patientnom'),
        "patientSurname": getUrlParameter('patientprenom'),
        "patientId": getUrlParameter('idPat'),
        "patientPhone": getUrlParameter('tel'),
        "patientMail": getUrlParameter('mail') || '',
        "numFacture": getUrlParameter('idDevis'),
        "amount": amount,
        "itemid": getUrlParameter('idPodio'),
        "beneficiary_reference": getUrlParameter('br'),
        "payment_scenario": "SC-1487-20221109191645"
    };
    
    return await makeApiCall(CONFIG.sspApiUrl, payload);
}

// Financement Stripe (Klarna 3x 4x ou Cartes Bancaires)
async function handleStripeFinancing(amount, paymentMethod) {
    const payload = {
        "idPraticien": getUrlParameter('idPraticien'),
        "idStructure": getUrlParameter('idCentre'),
        "idPatient": getUrlParameter('idPat'),
        "amount": amount,
        "payment_method_types": paymentMethod,
        "itemid": getUrlParameter('idPodio'),
        "beneficiary_reference": getUrlParameter('br')
    };
    
    return await makeApiCall(CONFIG.stripeApiUrl, payload);
}

// Appel API générique
async function makeApiCall(url, payload) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': CONFIG.authHeader,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
}

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error || e.message || 'Erreur inconnue');
    // Ne pas afficher de notification pour les erreurs mineures
    if (e.error && e.error.message && !e.error.message.includes('ResizeObserver')) {
        showNotification('Une erreur est survenue. Veuillez recharger la page.', 'error');
    }
});

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', function() {
    // Réajuster les éléments si nécessaire
    // Le chat n8n gère automatiquement le redimensionnement
});

// CSS pour les animations de notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Fonction pour afficher les informations des traitements
function showTreatmentInfo(treatmentType) {
    // Masquer toutes les informations de traitement
    const allTreatmentInfos = document.querySelectorAll('.treatment-info');
    allTreatmentInfos.forEach(info => {
        info.classList.remove('active');
    });
    
    // Désactiver tous les boutons d'onglets
    const allTabBtns = document.querySelectorAll('.tab-btn');
    allTabBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Afficher l'information sélectionnée
    const selectedInfo = document.getElementById(treatmentType + '-info');
    if (selectedInfo) {
        selectedInfo.classList.add('active');
    }
    
    // Activer le bouton d'onglet correspondant
    const selectedBtn = document.querySelector(`[onclick="showTreatmentInfo('${treatmentType}')"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
}



console.log('Script de devis dentaire chargé avec succès');
