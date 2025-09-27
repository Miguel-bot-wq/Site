// Sinthex Apps - Main JavaScript File
// This file handles all interactive functionality

// Configuration for payment links - Easy to modify
const PAYMENT_CONFIG = {
    basic: {
        url: "https://exemplo.com/pix/basico", // Replace with actual payment URL
        plan: "Plano Básico - R$ 29/mês"
    },
    pro: {
        url: "https://exemplo.com/pix/pro", // Replace with actual payment URL
        plan: "Plano Pro - R$ 79/mês"
    },
    enterprise: {
        url: "https://exemplo.com/pix/enterprise", // Replace with actual payment URL
        plan: "Plano Enterprise - R$ 149/mês"
    }
};

// DOM Elements
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const subscribeButtons = document.querySelectorAll('.subscribe-btn');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Menu Toggle Functionality
function initializeMobileMenu() {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Toggle aria-expanded for accessibility
        const isExpanded = navMenu.classList.contains('active');
        mobileMenu.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-expanded', 'false');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-expanded', 'false');
        }
    });
}

// Subscribe Button Functionality
function initializeSubscribeButtons() {
    subscribeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const planType = button.getAttribute('data-plan');
            const paymentData = PAYMENT_CONFIG[planType];
            
            if (paymentData) {
                // Show confirmation dialog
                const confirmMessage = `Você será redirecionado para o pagamento do ${paymentData.plan}. Continuar?`;
                
                if (confirm(confirmMessage)) {
                    // Add loading state
                    button.textContent = 'Redirecionando...';
                    button.disabled = true;
                    
                    // Simulate loading and redirect
                    setTimeout(() => {
                        window.open(paymentData.url, '_blank');
                        
                        // Reset button state
                        button.textContent = 'Assinar';
                        button.disabled = false;
                    }, 1000);
                }
            } else {
                alert('Erro: Plano não encontrado. Entre em contato conosco.');
            }
        });
    });
}

// Smooth Scroll for Navigation Links
function initializeSmoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Check if it's an internal link (starts with #)
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Calculate offset for fixed header
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Scroll Animation for Cards
function initializeScrollAnimations() {
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

    // Observe pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
        // Initial state for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.2}s`; // Stagger animation
        
        observer.observe(card);
    });
}

// Header Background on Scroll
function initializeHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.98)';
        } else {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        }
    });
}

// Button Hover Effects Enhancement
function initializeButtonEffects() {
    const buttons = document.querySelectorAll('.subscribe-btn, .cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', () => {
            if (!button.disabled) {
                button.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

// Form Validation (if contact form is added later)
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontSize: '0.9rem',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#0052B4'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Error Handling
function handleError(error, context = 'Unknown') {
    console.error(`Error in ${context}:`, error);
    showNotification('Ocorreu um erro. Tente novamente.', 'error');
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize all components
        initializeMobileMenu();
        initializeSubscribeButtons();
        initializeSmoothScroll();
        initializeScrollAnimations();
        initializeHeaderScroll();
        initializeButtonEffects();
        
        // Show success message
        console.log('Sinthex Apps website loaded successfully!');
        
        // Optional: Show welcome notification
        setTimeout(() => {
            showNotification('Bem-vindo à Sinthex Apps! 🚀', 'success');
        }, 1000);
        
    } catch (error) {
        handleError(error, 'Initialization');
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-expanded', 'false');
    }
});

// Export configuration for easy modification
window.SinthexApps = {
    config: PAYMENT_CONFIG,
    updatePaymentUrl: (plan, newUrl) => {
        if (PAYMENT_CONFIG[plan]) {
            PAYMENT_CONFIG[plan].url = newUrl;
            console.log(`Payment URL updated for ${plan}: ${newUrl}`);
        }
    },
    showNotification: showNotification
};

// Console welcome message
console.log(`
╔══════════════════════════════════════╗
║            SINTHEX APPS              ║
║     A melhor plataforma para         ║
║         seus projetos!               ║
╚══════════════════════════════════════╝

Para configurar os links de pagamento, use:
SinthexApps.updatePaymentUrl('basic', 'sua-url-aqui');
SinthexApps.updatePaymentUrl('pro', 'sua-url-aqui');
SinthexApps.updatePaymentUrl('enterprise', 'sua-url-aqui');
`);
      
