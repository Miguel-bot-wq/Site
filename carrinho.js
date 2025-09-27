// Carrinho.js - Sistema de Pagamento PIX para Sinthex Apps
// Este arquivo contém todas as configurações e funcionalidades do carrinho de compras

// ====== CONFIGURAÇÕES DE PAGAMENTO PIX ======
// Modifique estas informações com seus dados reais de pagamento
const PIX_CONFIG = {
    // Chave PIX (pode ser CPF, CNPJ, email ou chave aleatória)
    pixKey: "usuario@exemplo.com", // MODIFIQUE AQUI - Coloque sua chave PIX
    
    // Nome do beneficiário (seu nome ou nome da empresa)
    pixName: "Seu Nome", // MODIFIQUE AQUI - Coloque seu nome
    
    // Instituição bancária
    pixInstitution: "Banco do Brasil", // MODIFIQUE AQUI - Coloque seu banco
    
    // URLs dos QR Codes PIX para cada plano
    // Substitua pelos links reais dos seus QR codes PIX
    qrCodes: {
        basic: "", // MODIFIQUE AQUI - Link do QR Code para plano básico
        pro: "", // MODIFIQUE AQUI - Link do QR Code para plano pro  
        enterprise: "" // MODIFIQUE AQUI - Link do QR Code para plano enterprise
    },
    
    // Email para envio do comprovante
    supportEmail: "gueguelsom@gmail.com"
};

// ====== CONFIGURAÇÕES DOS PLANOS ======
const PLANOS_CONFIG = {
    basic: {
        nome: "Plano Básico",
        preco: "R$ 29",
        periodo: "/mês",
        planType: "basic"
    },
    pro: {
        nome: "Plano Pro", 
        preco: "R$ 79",
        periodo: "/mês",
        planType: "pro"
    },
    enterprise: {
        nome: "Plano Enterprise",
        preco: "R$ 149", 
        periodo: "/mês",
        planType: "enterprise"
    }
};

// ====== ELEMENTOS DO DOM ======
let modal, modalContent, selectedPlanElement, planPriceElement, qrCodeImage, qrCodePlaceholder;
let pixKeyInput, copyButton, pixNameElement, pixInstitutionElement;
let closeModalButton, cancelPaymentButton, confirmPaymentButton;

// ====== INICIALIZAÇÃO ======
function initializeCarrinho() {
    // Buscar elementos do DOM
    modal = document.getElementById('payment-modal');
    modalContent = document.querySelector('.modal-content');
    selectedPlanElement = document.getElementById('selected-plan');
    planPriceElement = document.getElementById('plan-price');
    qrCodeImage = document.getElementById('qr-code-image');
    qrCodePlaceholder = document.getElementById('qr-code-placeholder');
    pixKeyInput = document.getElementById('pix-key');
    copyButton = document.getElementById('copy-pix-key');
    pixNameElement = document.getElementById('pix-name');
    pixInstitutionElement = document.getElementById('pix-institution');
    closeModalButton = document.getElementById('close-modal');
    cancelPaymentButton = document.getElementById('cancel-payment');
    confirmPaymentButton = document.getElementById('confirm-payment');

    // Configurar dados PIX iniciais
    setupPixData();
    
    // Configurar event listeners
    setupEventListeners();
    
    console.log('Carrinho de pagamento PIX inicializado com sucesso!');
}

// ====== CONFIGURAÇÃO DE DADOS PIX ======
function setupPixData() {
    // Definir chave PIX
    pixKeyInput.value = PIX_CONFIG.pixKey;
    
    // Definir nome e instituição
    pixNameElement.textContent = PIX_CONFIG.pixName;
    pixInstitutionElement.textContent = PIX_CONFIG.pixInstitution;
}

// ====== EVENT LISTENERS ======
function setupEventListeners() {
    // Botão fechar modal
    if (closeModalButton) {
        closeModalButton.addEventListener('click', fecharModal);
    }
    
    // Botão cancelar pagamento
    if (cancelPaymentButton) {
        cancelPaymentButton.addEventListener('click', fecharModal);
    }
    
    // Botão confirmar pagamento
    if (confirmPaymentButton) {
        confirmPaymentButton.addEventListener('click', confirmarPagamento);
    }
    
    // Botão copiar chave PIX
    if (copyButton) {
        copyButton.addEventListener('click', copiarChavePix);
    }
    
    // Fechar modal clicando fora
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharModal();
            }
        });
    }
    
    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            fecharModal();
        }
    });
}

// ====== FUNÇÃO PRINCIPAL - ABRIR MODAL ======
function abrirModalPagamento(planType) {
    const plano = PLANOS_CONFIG[planType];
    
    if (!plano) {
        console.error('Plano não encontrado:', planType);
        mostrarNotificacao('Erro: Plano não encontrado!', 'error');
        return;
    }
    
    // Atualizar informações do plano
    selectedPlanElement.textContent = plano.nome;
    planPriceElement.textContent = plano.preco + plano.periodo;
    
    // Configurar QR Code
    configurarQRCode(planType);
    
    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevenir scroll do body
    
    // Foco no modal para acessibilidade
    modalContent.focus();
    
    console.log(`Modal de pagamento aberto para: ${plano.nome}`);
}

// ====== CONFIGURAR QR CODE ======
function configurarQRCode(planType) {
    const qrCodeUrl = PIX_CONFIG.qrCodes[planType];
    
    if (qrCodeUrl && qrCodeUrl.trim() !== '') {
        // Mostrar QR Code real
        qrCodeImage.src = qrCodeUrl;
        qrCodeImage.style.display = 'block';
        qrCodePlaceholder.style.display = 'none';
        
        // Verificar se a imagem carregou
        qrCodeImage.onload = () => {
            console.log('QR Code carregado com sucesso');
        };
        
        qrCodeImage.onerror = () => {
            console.warn('Erro ao carregar QR Code, mostrando placeholder');
            mostrarPlaceholderQR();
        };
    } else {
        // Mostrar placeholder
        mostrarPlaceholderQR();
    }
}

// ====== MOSTRAR PLACEHOLDER QR ======
function mostrarPlaceholderQR() {
    qrCodeImage.style.display = 'none';
    qrCodePlaceholder.style.display = 'flex';
}

// ====== COPIAR CHAVE PIX ======
async function copiarChavePix() {
    try {
        await navigator.clipboard.writeText(PIX_CONFIG.pixKey);
        
        // Feedback visual
        const originalText = copyButton.textContent;
        copyButton.textContent = 'Copiado!';
        copyButton.classList.add('copied');
        
        // Resetar após 2 segundos
        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.classList.remove('copied');
        }, 2000);
        
        mostrarNotificacao('Chave PIX copiada com sucesso!', 'success');
        console.log('Chave PIX copiada:', PIX_CONFIG.pixKey);
        
    } catch (err) {
        console.error('Erro ao copiar chave PIX:', err);
        
        // Fallback para navegadores mais antigos
        try {
            pixKeyInput.select();
            document.execCommand('copy');
            mostrarNotificacao('Chave PIX copiada!', 'success');
        } catch (fallbackErr) {
            console.error('Erro no fallback de cópia:', fallbackErr);
            mostrarNotificacao('Erro ao copiar. Copie manualmente a chave PIX.', 'warning');
        }
    }
}

// ====== FECHAR MODAL ======
function fecharModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll do body
    
    // Limpar dados do modal
    selectedPlanElement.textContent = 'Plano Selecionado';
    planPriceElement.textContent = 'R$ 00/mês';
    mostrarPlaceholderQR();
    
    console.log('Modal de pagamento fechado');
}

// ====== CONFIRMAR PAGAMENTO ======
function confirmarPagamento() {
    const planName = selectedPlanElement.textContent;
    const planPrice = planPriceElement.textContent;
    
    // Mostrar mensagem de confirmação
    const mensagem = `Obrigado! Envie o comprovante do pagamento do ${planName} (${planPrice}) para ${PIX_CONFIG.supportEmail} para ativar sua assinatura.`;
    
    mostrarNotificacao(mensagem, 'success');
    
    // Abrir email (opcional)
    const emailSubject = encodeURIComponent(`Comprovante de Pagamento - ${planName}`);
    const emailBody = encodeURIComponent(`Olá! Segue anexo o comprovante de pagamento do ${planName} no valor de ${planPrice}.\n\nObrigado!`);
    const emailUrl = `mailto:${PIX_CONFIG.supportEmail}?subject=${emailSubject}&body=${emailBody}`;
    
    // Tentar abrir o cliente de email
    try {
        window.open(emailUrl, '_blank');
    } catch (error) {
        console.log('Não foi possível abrir o cliente de email automaticamente');
    }
    
    // Fechar modal após 3 segundos
    setTimeout(() => {
        fecharModal();
    }, 3000);
    
    console.log('Pagamento confirmado:', { planName, planPrice });
}

// ====== MOSTRAR NOTIFICAÇÃO ======
function mostrarNotificacao(mensagem, tipo = 'info') {
    // Reutilizar a função do script.js se disponível
    if (typeof showNotification === 'function') {
        showNotification(mensagem, tipo);
        return;
    }
    
    // Implementação própria se não estiver disponível
    const notification = document.createElement('div');
    notification.className = `carrinho-notification carrinho-notification-${tipo}`;
    notification.textContent = mensagem;
    
    // Estilos
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontSize: '0.9rem',
        zIndex: '10000',
        maxWidth: '300px',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // Cores por tipo
    const cores = {
        success: '#28a745',
        error: '#dc3545', 
        warning: '#ffc107',
        info: '#0052B4'
    };
    notification.style.backgroundColor = cores[tipo] || cores.info;
    
    // Adicionar à página
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ====== UTILITÁRIOS PARA CONFIGURAÇÃO ======
const CarrinhoUtils = {
    // Atualizar chave PIX
    atualizarChavePix: (novaChave) => {
        PIX_CONFIG.pixKey = novaChave;
        if (pixKeyInput) {
            pixKeyInput.value = novaChave;
        }
        console.log('Chave PIX atualizada:', novaChave);
    },
    
    // Atualizar nome
    atualizarNome: (novoNome) => {
        PIX_CONFIG.pixName = novoNome;
        if (pixNameElement) {
            pixNameElement.textContent = novoNome;
        }
        console.log('Nome atualizado:', novoNome);
    },
    
    // Atualizar banco
    atualizarBanco: (novoBanco) => {
        PIX_CONFIG.pixInstitution = novoBanco;
        if (pixInstitutionElement) {
            pixInstitutionElement.textContent = novoBanco;
        }
        console.log('Banco atualizado:', novoBanco);
    },
    
    // Atualizar QR Code
    atualizarQRCode: (plano, novaUrl) => {
        if (PIX_CONFIG.qrCodes.hasOwnProperty(plano)) {
            PIX_CONFIG.qrCodes[plano] = novaUrl;
            console.log(`QR Code do ${plano} atualizado:`, novaUrl);
        } else {
            console.error('Plano inválido:', plano);
        }
    },
    
    // Obter configurações atuais
    obterConfig: () => {
        return { ...PIX_CONFIG };
    }
};

// ====== EXPOSIÇÃO GLOBAL ======
// Disponibilizar funções globalmente para uso em outros arquivos
window.CarrinhoSinthex = {
    abrir: abrirModalPagamento,
    fechar: fecharModal,
    utils: CarrinhoUtils,
    config: PIX_CONFIG
};

// ====== CONSOLE LOG DE INICIALIZAÇÃO ======
console.log(`
╔══════════════════════════════════════╗
║           CARRINHO SINTHEX           ║
║         Sistema de Pagamento         ║
║              PIX v1.0                ║
╚══════════════════════════════════════╝

Para configurar seus dados PIX, edite o arquivo carrinho.js:

1. PIX_CONFIG.pixKey - Sua chave PIX
2. PIX_CONFIG.pixName - Seu nome
3. PIX_CONFIG.pixInstitution - Seu banco
4. PIX_CONFIG.qrCodes - URLs dos QR codes

Ou use via console:
CarrinhoSinthex.utils.atualizarChavePix('nova-chave@email.com');
CarrinhoSinthex.utils.atualizarNome('Seu Nome');
CarrinhoSinthex.utils.atualizarBanco('Seu Banco');
CarrinhoSinthex.utils.atualizarQRCode('basic', 'url-do-qr-code');
`);

// ====== EXPORTAÇÃO (se usando módulos) ======
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeCarrinho,
        abrirModalPagamento,
        fecharModal,
        CarrinhoUtils,
        PIX_CONFIG
    };
}
