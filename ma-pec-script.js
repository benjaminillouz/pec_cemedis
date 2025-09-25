// Configuration
const CONFIG = {
    signatureUrl: 'https://form.jotform.com/240000000000000',
    stripeApiUrl: 'https://europe-west1-pecapi-app.cloudfunctions.net/veasy_get_stripe_link',
    sspApiUrl: 'https://europe-west1-pecapi-app.cloudfunctions.net/veasy_get_ssp_link',
    authHeader: 'Basic dmVhc3k6SnJlUDZSejMz'
};

let currentSection = 'pec';
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
    console.log('Initialisation de l\'interface de prise en charge');
    
    // Remplir les informations du patient depuis les paramètres URL
    populatePatientInfo();
    
    // Vérifier la présence des éléments requis
    checkRequiredElements();
}

// Vérification des éléments requis
function checkRequiredElements() {
    const requiredElements = [
        'centre-logo',
        'pec-id',
        'patient-name',
        'centre-name',
        'praticien-name',
        'pec-date',
        'total-amount',
        'ss-amount',
        'mut-amount',
        'rac-amount'
    ];
    
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Élément requis manquant: ${id}`);
        }
    });
}

// Configuration des événements
function setupEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            switchSection(sectionId);
        });
    });
    
    // Slider de montant
    const amountSlider = document.getElementById('amount-slider');
    if (amountSlider) {
        amountSlider.addEventListener('input', function() {
            updateSliderValue(this.value);
        });
    }
    
    // Options de financement
    setupFinancingOptions();
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
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
    }
}

// Remplissage des informations patient
function populatePatientInfo() {
    console.log('Remplissage des informations patient...');
    
    // Informations de base
    const pecId = getUrlParameter('idDevis') || getUrlParameter('id') || '-';
    const patientNom = getUrlParameter('patientnom') || '';
    const patientPrenom = getUrlParameter('patientprenom') || '';
    const centre = getUrlParameter('centre') || '';
    const praticien = getUrlParameter('praticien') || '';
    const date = getUrlParameter('date') || '';
    const tel = getUrlParameter('tel') || '';
    const email = getUrlParameter('mail') || '';
    
    // Mise à jour des éléments
    updateElement('pec-id', pecId);
    updateElement('patient-name', `${patientNom} ${patientPrenom}`);
    updateElement('centre-name', centre);
    updateElement('praticien-name', praticien);
    updateElement('pec-date', date);
    updateElement('patient-nom', patientNom);
    updateElement('patient-prenom', patientPrenom);
    updateElement('patient-tel', tel);
    updateElement('patient-email', email);
    
    // Remplissage des informations financières
    populateFinancialInfo();
}

// Remplissage des informations financières
function populateFinancialInfo() {
    console.log('Remplissage des informations financières...');
    
    const total = getUrlParameter('total') || '0';
    const ss = getUrlParameter('ss') || '0';
    const mut = getUrlParameter('mut') || '0';
    const rac = getUrlParameter('rac') || '0';
    
    // Mise à jour des montants
    updateElement('total-amount', `${total} €`);
    updateElement('ss-amount', `${ss} €`);
    updateElement('mut-amount', `${mut} €`);
    updateElement('rac-amount', `${rac} €`);
    
    // Mise à jour des montants dans les autres sections
    updateElement('total-amount-financement', `${total} €`);
    updateElement('ss-amount-remboursements', `${ss} €`);
    updateElement('mut-amount-remboursements', `${mut} €`);
    updateElement('rac-amount-remboursements', `${rac} €`);
}

// Mise à jour d'un élément
function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Initialisation du logo du centre
function initializeCentreLogo() {
    console.log('Initialisation du logo du centre...');
    
    const logoUrl = getUrlParameter('logo');
    const logoElement = document.getElementById('centre-logo');
    
    if (logoUrl && logoElement) {
        console.log('URL du logo:', logoUrl);
        logoElement.src = logoUrl;
        logoElement.alt = 'Logo du centre';
        
        logoElement.onload = function() {
            console.log('Logo du centre chargé:', logoUrl);
        };
        
        logoElement.onerror = function() {
            console.warn('Erreur de chargement du logo:', logoUrl);
            // Fallback vers le logo Cemedis par défaut
            logoElement.src = 'https://static.wixstatic.com/media/b07e07_829fb71a56b44b6b80e3974bd04a24d2~mv2.png';
        };
    } else {
        console.log('Aucun logo spécifié ou élément non trouvé');
    }
}

// Remplissage du tableau de traitement
function populateTreatmentTable() {
    console.log('Remplissage du tableau de traitement...');
    
    const tableBody = document.getElementById('treatment-table-body');
    if (!tableBody) {
        console.warn('Élément treatment-table-body non trouvé');
        return;
    }
    
    // Récupérer les données de traitement depuis l'URL
    const wtypeParam = getUrlParameter('wtype');
    let data = [];
    
    if (wtypeParam) {
        try {
            // Décoder et parser le JSON
            const decodedParam = decodeURIComponent(wtypeParam);
            data = JSON.parse(decodedParam);
            console.log('Données de traitement récupérées:', data);
        } catch (error) {
            console.error('Erreur lors du parsing des données de traitement:', error);
            data = getSampleTreatmentData();
        }
    } else {
        console.log('Aucun paramètre wtype trouvé, utilisation des données d\'exemple');
        data = getSampleTreatmentData();
    }
    
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

// Données d'exemple pour le traitement
function getSampleTreatmentData() {
    return [
        {
            date: '25/09/25',
            libelle: 'Consultation',
            tooth_number: '-',
            price: '50'
        },
        {
            date: '25/09/25',
            libelle: 'Détartrage',
            tooth_number: '-',
            price: '80'
        },
        {
            date: '25/09/25',
            libelle: 'Soin carie',
            tooth_number: '16',
            price: '120'
        }
    ];
}

// Animation des lignes du tableau
function animateTableRows() {
    const rows = document.querySelectorAll('#treatment-table-body tr');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialisation du système de financement
function initializeFinancing() {
    console.log('Initialisation du système de financement...');
    
    // Récupérer le montant RAC depuis l'URL
    const racAmount = getUrlParameter('rac') || '0';
    const totalAmount = getUrlParameter('total') || '0';
    
    // Mettre à jour l'affichage du montant total
    const totalElement = document.getElementById('total-amount-financement');
    if (totalElement) {
        totalElement.textContent = `${totalAmount} €`;
    }
    
    // Configurer le slider
    const slider = document.getElementById('amount-slider');
    if (slider) {
        slider.max = totalAmount;
        slider.value = racAmount;
        updateSliderValue(racAmount);
    }
}

// Mise à jour de la valeur du slider
function updateSliderValue(value) {
    const sliderValueElement = document.getElementById('slider-value');
    if (sliderValueElement) {
        sliderValueElement.textContent = `${value}€`;
    }
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
        cbOption.addEventListener('click', () => handleFinancing('cb'));
    }
}

// Gestion du financement
function handleFinancing(paymentMethod) {
    const slider = document.getElementById('amount-slider');
    const amount = slider ? slider.value : '0';
    
    console.log(`Financement sélectionné: ${paymentMethod}, Montant: ${amount}€`);
    
    switch (paymentMethod) {
        case 'klarna':
            handleKlarnaFinancing(amount);
            break;
        case 'veasy':
            handleVeasyFinancing(amount);
            break;
        case 'cb':
            handleStripeFinancing(amount, 'card');
            break;
        default:
            console.warn('Méthode de paiement non reconnue:', paymentMethod);
    }
}

// Financement Klarna
function handleKlarnaFinancing(amount) {
    console.log('Traitement du financement Klarna...');
    showNotification('Redirection vers Klarna...', 'info');
    
    // Ici vous pouvez intégrer l'API Klarna
    setTimeout(() => {
        showNotification('Fonctionnalité Klarna en cours de développement', 'warning');
    }, 1000);
}

// Financement Veasy
function handleVeasyFinancing(amount) {
    console.log('Traitement du financement Veasy...');
    
    const payload = {
        amount: parseFloat(amount),
        currency: 'EUR',
        customer: {
            email: getUrlParameter('mail') || '',
            phone: getUrlParameter('tel') || ''
        },
        metadata: {
            pec_id: getUrlParameter('idDevis') || '',
            patient: `${getUrlParameter('patientnom') || ''} ${getUrlParameter('patientprenom') || ''}`,
            centre: getUrlParameter('centre') || ''
        }
    };
    
    makeApiCall(CONFIG.sspApiUrl, payload)
        .then(response => {
            console.log('Réponse Veasy:', response);
            if (response.url) {
                window.open(response.url, '_blank');
                showNotification('Redirection vers Veasy...', 'success');
            } else {
                showNotification('Erreur lors de la création du lien Veasy', 'error');
            }
        })
        .catch(error => {
            console.error('Erreur Veasy:', error);
            showNotification('Erreur lors du traitement Veasy', 'error');
        });
}

// Financement Stripe
function handleStripeFinancing(amount, paymentMethod) {
    console.log('Traitement du financement Stripe...');
    
    const payload = {
        amount: parseFloat(amount) * 100, // Stripe utilise les centimes
        currency: 'eur',
        payment_method: paymentMethod,
        customer: {
            email: getUrlParameter('mail') || '',
            phone: getUrlParameter('tel') || ''
        },
        metadata: {
            pec_id: getUrlParameter('idDevis') || '',
            patient: `${getUrlParameter('patientnom') || ''} ${getUrlParameter('patientprenom') || ''}`,
            centre: getUrlParameter('centre') || ''
        }
    };
    
    makeApiCall(CONFIG.stripeApiUrl, payload)
        .then(response => {
            console.log('Réponse Stripe:', response);
            if (response.url) {
                window.open(response.url, '_blank');
                showNotification('Redirection vers Stripe...', 'success');
            } else {
                showNotification('Erreur lors de la création du lien Stripe', 'error');
            }
        })
        .catch(error => {
            console.error('Erreur Stripe:', error);
            showNotification('Erreur lors du traitement Stripe', 'error');
        });
}

// Appel API générique
async function makeApiCall(url, payload) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': CONFIG.authHeader
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
}

// Ouverture du comparateur 100 Santé
function open100Sante() {
    const url = 'https://www.100sante.fr/comparateur-mutuelle-sante';
    window.open(url, '_blank');
    showNotification('Ouverture du comparateur officiel...', 'info');
}

// Fonctions utilitaires
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Système de notifications
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Ajouter les styles
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
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Supprimer après 4 secondes
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
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
        success: '#4ECDC4',
        error: '#FF6B6B',
        warning: '#FFE66D',
        info: '#004B63'
    };
    return colors[type] || '#004B63';
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
    // Le responsive design gère automatiquement le redimensionnement
});

// CSS pour les animations de notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);

console.log('Script de prise en charge chargé avec succès');
