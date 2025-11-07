// Configuration
const CONFIG = {
    financementUrl: 'https://app.applications-cemedis.fr/mondevis/financement',
    stripeApiUrl: 'https://europe-west1-pecapi-app.cloudfunctions.net/veasy_get_stripe_link',
    sspApiUrl: 'https://europe-west1-pecapi-app.cloudfunctions.net/veasy_get_ssp_link',
    authHeader: 'Basic dmVhc3k6SnJlUDZSejMz'
};

// Variables globales
let currentSection = 'pec';

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initialisation de l\'application Ma PEC...');
    initializeApp();
});

// Initialisation principale
function initializeApp() {
    try {
        // Récupération des paramètres URL
        const urlParams = new URLSearchParams(window.location.search);
        
        // Population des données
        populatePatientInfo();
        populateFinancialInfo();
        populateCentreInfo();
        
        // Configuration des événements
        setupEventListeners();
        
        // Initialisation du financement
        initializeFinancing();
        
        console.log('Application Ma PEC initialisée avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showNotification('Erreur lors du chargement de l\'application', 'error');
    }
}

// Population des informations patient
function populatePatientInfo() {
    const patientNom = getUrlParameter('patientnom') || '-';
    const patientPrenom = getUrlParameter('patientprenom') || '-';
    const patientTel = getUrlParameter('tel') || '-';
    const patientEmail = getUrlParameter('mail') || '-';
    
    // Mise à jour des éléments
    document.getElementById('patient-name').textContent = `${patientNom} ${patientPrenom}`;
    document.getElementById('patient-nom').textContent = patientNom;
    document.getElementById('patient-prenom').textContent = patientPrenom;
    document.getElementById('patient-tel').textContent = patientTel;
    document.getElementById('patient-email').textContent = patientEmail;
}

// Population des informations financières
function populateFinancialInfo() {
    const total = parseFloat(getUrlParameter('total') || '0');
    const ss = parseFloat(getUrlParameter('ss') || '0');
    const mut = parseFloat(getUrlParameter('mut') || '0');
    const rac = parseFloat(getUrlParameter('rac') || '0');
    
    // Mise à jour des montants
    document.getElementById('total-amount').textContent = `${total.toFixed(2)} €`;
    document.getElementById('ss-amount').textContent = `${ss.toFixed(2)} €`;
    document.getElementById('mut-amount').textContent = `${mut.toFixed(2)} €`;
    document.getElementById('rac-amount').textContent = `${rac.toFixed(2)} €`;
    
    // Mise à jour des montants dans les autres sections
    document.getElementById('ss-amount-remboursements').textContent = `${ss.toFixed(2)} €`;
    document.getElementById('mut-amount-remboursements').textContent = `${mut.toFixed(2)} €`;
    document.getElementById('rac-amount-remboursements').textContent = `${rac.toFixed(2)} €`;
    document.getElementById('total-amount-financement').textContent = `${rac.toFixed(2)} €`;
}

// Population des informations du centre
function populateCentreInfo() {
    const centre = getUrlParameter('centre') || '-';
    const praticien = getUrlParameter('praticien') || '-';
    const date = getUrlParameter('date') || '-';
    const idDevis = getUrlParameter('idDevis') || '-';
    const logo = getUrlParameter('logo');
    
    // Mise à jour des éléments
    document.getElementById('centre-name').textContent = centre;
    document.getElementById('praticien-name').textContent = praticien;
    document.getElementById('pec-date').textContent = date;
    document.getElementById('pec-id').textContent = idDevis;
    
    // Mise à jour du logo
    if (logo) {
        const logoElement = document.getElementById('centre-logo');
        if (logoElement) {
            logoElement.src = decodeURIComponent(logo);
            logoElement.alt = `Logo ${centre}`;
        }
    }
}

// Configuration des événements
function setupEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
    
}

// Gestion des sections
function showSection(sectionId) {
    // Masquer toutes les sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Désactiver tous les liens de navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Afficher la section sélectionnée
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Activer le lien de navigation correspondant
    const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
    
    currentSection = sectionId;
}


// Gestion de la prise de rendez-vous
function handleAppointment() {
    const quotationPdf = getUrlParameter('quotation_pdf');
    
    if (quotationPdf) {
        try {
            const decodedUrl = decodeURIComponent(quotationPdf);
            window.open(decodedUrl, '_blank');
            showNotification('Ouverture de la prise de rendez-vous...', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'ouverture du lien de rendez-vous:', error);
            showNotification('Erreur lors de l\'ouverture du lien de rendez-vous', 'error');
        }
    } else {
        showNotification('Lien de rendez-vous non disponible', 'warning');
    }
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
    
    // Limiter le slider au montant du reste à charge
    const maxAmount = Math.max(rac, 1000);
    
    // Configuration du slider
    const slider = document.getElementById('payment-slider');
    const selectedAmount = document.getElementById('selected-amount');
    
    if (slider && selectedAmount) {
        slider.max = maxAmount;
        slider.value = rac;
        selectedAmount.textContent = `${rac} €`;
        
        // Mettre à jour les labels du slider
        const sliderLabels = document.querySelectorAll('.slider-labels span');
        if (sliderLabels.length >= 3) {
            sliderLabels[0].textContent = '10 €';
            sliderLabels[1].textContent = `${rac} €`;
            sliderLabels[2].textContent = `${maxAmount} €`;
        }
        
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
    const almaOption = document.getElementById('alma-financing');
    const cbOption = document.getElementById('cb-financing');
    
    if (klarnaOption) {
        klarnaOption.addEventListener('click', () => handleFinancing('klarna'));
    }
    
    if (almaOption) {
        almaOption.addEventListener('click', () => handleFinancing('alma'));
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
        } else if (paymentMethod === 'alma') {
            response = await handleStripeFinancing(amount, 'alma');
        } else {
            response = await handleStripeFinancing(amount, paymentMethod === 'klarna' ? 'klarna' : 'card');
        }
        
        if (response && response.link) {
            window.location.href = response.link;
        } else if (response && response.url) {
            window.location.href = response.url;
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

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
    showNotification('Une erreur est survenue', 'error');
});

// Initialisation des animations
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(animateElements, 100);
});
