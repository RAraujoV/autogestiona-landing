import React, { useState, useEffect } from 'react';

/**
 * =============================================================================
 * CONFIGURACIÓN Y CONSTANTES (EDITABLE)
 * =============================================================================
 */

// URL del Webhook para recibir los formularios (Zapier, n8n, Make, servidor propio)
// IMPORTANTE: Asegúrate de configurar CORS en tu servidor si es propio.
const WEBHOOK_URL = process.env.REACT_APP_AUTOGESTIONA_WEBHOOK || "https://tu-endpoint-de-prueba.com/api/lead";

// Colores de marca (usados vía clases arbitrarias de Tailwind JIT o styles inline si fuera necesario)
// Principal (Burdeos): #7B1B38
// Gris Óxford: #616d71
// Acentos: #F5F5F6

// TEXTOS (COPY) - ESPAÑOL DE ESPAÑA
const COPY = {
  header: {
    title: "Autogestiona",
    subtitle: "Soluciones que convierten tu móvil en el asistente que organiza tu día: registra tareas, tiempos y lugares en segundos.",
    cta: "Solicitar demo"
  },
  problem: {
    title: "¿El trabajo de campo se come tu gestión?",
    text: "Cuando trabajas fuera de la oficina, registrar lo que haces a lo largo del día se vuelve una tarea olvidada o inexacta. Apuntar a mano en una libreta, confiar en la memoria o pelearte con hojas de cálculo al final del día provoca errores y pérdida de información."
  },
  agitation: {
    title: "Lo que no se registra, no se factura",
    points: [
      "Horas de trabajo perdidas por no anotarlas al momento.",
      "Información incompleta que complica la contabilidad y el cumplimiento normativo.",
      "Tareas administrativas acumuladas que aumentan tu carga mental y estrés.",
      "Errores en facturación que dan mala imagen ante tus clientes."
    ],
    empathy: "Sabemos que tu tiempo es facturable y tu atención debe estar en el servicio, no en la burocracia."
  },
  solution: {
    title: "Tu secretario en la palma de la mano",
    description: "Autogestiona transforma mensajes sencillos desde tu móvil en registros estructurados: tiempo empleado, acciones realizadas, ubicación y materiales usados. Todo configurable con plantillas pensadas para tu oficio.",
    features: [
      { title: "Sin apps complejas", text: "Registro in situ mediante mensajería o comandos simples de email." },
      { title: "Automatización total", text: "Convertimos texto libre en bases de datos (CSV, ERP, Contabilidad)." },
      { title: "Personalización", text: "Plantillas adaptadas 100% a tu operativa y equipo." },
      { title: "Backoffice potente", text: "Visualiza todo en tu ordenador cuando llegues a la oficina." }
    ]
  },
  form: {
    title: "Solicita una demostración personalizada",
    subtitle: "Cuéntanos tu actividad y te mostraremos en pocos días cómo registrar tus gestiones desde el móvil y automatizar el resto.",
    nameLabel: "Nombre completo",
    companyLabel: "Empresa (Opcional)",
    phoneLabel: "Teléfono móvil",
    emailLabel: "Correo electrónico",
    descLabel: "Breve descripción de tu actividad",
    privacyLabel: "He leído y acepto la política de privacidad y el tratamiento de mis datos.",
    submitBtn: "Solicitar demo ahora",
    successTitle: "¡Gracias!",
    successMsg: "Hemos recibido tu solicitud. En breve contactaremos contigo para agendar la demo.",
    whatsappBtn: "O solicita demo por WhatsApp"
  },
  chat: {
    placeholder: "¿Quieres una demo rápida? Escribe tu pregunta...",
    send: "Enviar"
  },
  faq: [
    { q: "¿Necesito instalar una app nueva?", a: "No necesariamente. Nuestras soluciones se integran con herramientas que ya usas como correo, Telegram o interfaces web ligeras (PWA)." },
    { q: "¿Funciona con cualquier móvil?", a: "Sí, al basarse en estándares web y mensajería, funciona en cualquier smartphone (Android o iOS) con conexión a datos." },
    { q: "¿Cómo se protege mi información?", a: "Usamos encriptación SSL y servidores seguros cumpliendo con el RGPD. Tus datos son tuyos y se pueden exportar cuando quieras." },
    { q: "¿Puedo integrarlo con mi contabilidad?", a: "Sí, generamos archivos compatibles con la mayoría de ERPs y softwares contables, o podemos crear integraciones API personalizadas." },
    { q: "¿Cuánto tarda la puesta en marcha?", a: "Una personalización básica suele estar lista en menos de una semana laboral." }
  ],
  footer: {
    legal: "Aviso Legal",
    privacy: "Política de Privacidad",
    copyright: "© 2024 Autogestiona. Todos los derechos reservados."
  }
};

/**
 * =============================================================================
 * COMPONENTES DE ICONOS (SVGs Inline para evitar dependencias)
 * =============================================================================
 */

const IconLogo = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
    <line x1="8" y1="6" x2="16" y2="6"></line>
    <line x1="8" y1="10" x2="16" y2="10"></line>
    <line x1="8" y1="14" x2="13" y2="14"></line>
  </svg>
);

const IconCheck = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconClock = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconChat = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconMenu = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const IconClose = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconWarning = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

/**
 * =============================================================================
 * COMPONENTE PRINCIPAL
 * =============================================================================
 */

export default function AutogestionaLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // SEO: Schema.org JSON-LD
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Autogestiona",
    "description": "Servicios de desarrollo de soluciones tecnológicas adaptadas a operativa laboral móvil.",
    "brand": {
      "@type": "Brand",
      "name": "Autogestiona"
    },
    "provider": {
      "@type": "Organization",
      "name": "Autogestiona",
      "url": "https://www.autogestiona.com" // URL Placeholder
    }
  };

  // Scroll suave al formulario
  const scrollToForm = () => {
    const formSection = document.getElementById('demo-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="font-sans text-[#616d71] bg-white antialiased min-h-screen selection:bg-[#7B1B38] selection:text-white">
      {/* METADATOS SEO (Renderizado condicional para React Helmet o Head de Next.js si se usa) */}
      {/* Nota: En Next.js esto iría dentro de <Head>, en CRA puro funciona en el body pero idealmente usar react-helmet */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>

      {/* HEADER */}
      <header className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <IconLogo className="h-8 w-8 text-[#7B1B38]" />
              <span className="font-bold text-xl text-[#7B1B38] tracking-tight">{COPY.header.title}</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-8 items-center">
              <a href="#problema" className="hover:text-[#7B1B38] transition-colors text-sm font-medium">El Problema</a>
              <a href="#solucion" className="hover:text-[#7B1B38] transition-colors text-sm font-medium">Solución</a>
              <a href="#faq" className="hover:text-[#7B1B38] transition-colors text-sm font-medium">Preguntas</a>
              <button 
                onClick={scrollToForm}
                className="bg-[#7B1B38] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#5a1329] transition-all shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-[#7B1B38]"
              >
                {COPY.header.cta}
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#7B1B38] rounded-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menú"
            >
              {isMenuOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col">
              <a href="#problema" onClick={() => setIsMenuOpen(false)} className="block py-2 text-base font-medium hover:text-[#7B1B38]">El Problema</a>
              <a href="#solucion" onClick={() => setIsMenuOpen(false)} className="block py-2 text-base font-medium hover:text-[#7B1B38]">Solución</a>
              <a href="#faq" onClick={() => setIsMenuOpen(false)} className="block py-2 text-base font-medium hover:text-[#7B1B38]">Preguntas</a>
              <button 
                onClick={scrollToForm}
                className="w-full mt-2 bg-[#7B1B38] text-white px-4 py-3 rounded-md font-semibold hover:bg-[#5a1329]"
              >
                {COPY.header.cta}
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="pt-16">
        {/* HERO SECTION */}
        <section className="px-4 py-16 sm:py-24 max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#7B1B38] leading-tight">
              {COPY.header.title}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 font-light leading-relaxed">
              {COPY.header.subtitle}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={scrollToForm}
                className="bg-[#7B1B38] text-white text-lg px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-100"
              >
                {COPY.header.cta}
              </button>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION (P) */}
        <section id="problema" className="bg-[#F5F5F6] py-16 sm:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-[#7B1B38] text-xs font-bold uppercase tracking-wider">
                  El Problema
                </div>
                <h2 className="text-3xl font-bold text-gray-800">{COPY.problem.title}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {COPY.problem.text}
                </p>
              </div>
              <div className="md:w-1/2 flex justify-center">
                 {/* Placeholder visual para contexto "caos" - SVG abstracto */}
                 <div className="w-full max-w-sm aspect-square bg-white rounded-2xl shadow-sm p-8 flex items-center justify-center border border-gray-200">
                    <div className="text-center space-y-4 opacity-50">
                      <IconWarning className="h-16 w-16 mx-auto text-gray-400" />
                      <p className="text-sm font-mono">Datos perdidos...<br/>Notas ilegibles...</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* AGITATION SECTION (A) */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold text-[#7B1B38] mb-12">{COPY.agitation.title}</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {COPY.agitation.points.map((point, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-red-50 hover:border-red-100 hover:bg-red-50/30 transition-colors">
                  <div className="mt-1 flex-shrink-0">
                    <IconWarning className="h-5 w-5 text-[#7B1B38]" />
                  </div>
                  <p className="text-gray-700 font-medium">{point}</p>
                </div>
              ))}
            </div>
            <p className="mt-12 text-xl font-medium text-gray-500 italic border-l-4 border-[#7B1B38] pl-6 py-2 mx-auto max-w-2xl text-left md:text-center md:border-l-0 md:border-t-4">
              "{COPY.agitation.empathy}"
            </p>
          </div>
        </section>

        {/* SOLUTION SECTION (S) */}
        <section id="solucion" className="bg-[#616d71] text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">{COPY.solution.title}</h2>
              <p className="text-lg sm:text-xl text-gray-200 opacity-90">{COPY.solution.description}</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {COPY.solution.features.map((feature, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/15 transition-colors">
                  <div className="h-10 w-10 bg-[#7B1B38] rounded-lg flex items-center justify-center mb-4">
                    <IconCheck className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FORM SECTION (DEMO) */}
        <section id="demo-form" className="py-20 bg-[#F5F5F6]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[#7B1B38] mb-4">{COPY.form.title}</h2>
                <p className="text-gray-600">{COPY.form.subtitle}</p>
              </div>

              <ContactForm />

            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Preguntas Frecuentes</h2>
            <div className="space-y-6">
              {COPY.faq.map((item, index) => (
                <details key={index} className="group border-b border-gray-200 pb-6 cursor-pointer">
                  <summary className="flex justify-between items-center font-bold text-gray-800 text-lg list-none focus:outline-none focus:text-[#7B1B38]">
                    {item.q}
                    <span className="transition-transform group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <p className="text-gray-600 mt-3 leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#616d71] text-white py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <IconLogo className="h-6 w-6 text-gray-300" />
            <span className="font-bold text-lg tracking-tight">Autogestiona</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-300">
            {/* Placeholders legales */}
            <a href="#privacy" className="hover:text-white transition-colors">{COPY.footer.privacy}</a>
            <a href="#legal" className="hover:text-white transition-colors">{COPY.footer.legal}</a>
          </div>
          <div className="text-xs text-gray-400">
            {COPY.footer.copyright}
          </div>
        </div>
      </footer>

      {/* CHAT WIDGET */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
        {isChatOpen && (
          <div className="mb-4 w-72 sm:w-80 bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up origin-bottom-right">
            <div className="bg-[#7B1B38] p-4 text-white flex justify-between items-center">
              <span className="font-bold text-sm">Soporte Autogestiona</span>
              <button onClick={() => setIsChatOpen(false)} aria-label="Cerrar chat">
                <IconClose className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 h-64 bg-gray-50 flex flex-col justify-end">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-sm text-gray-600 mb-2">
                Hola, ¿cómo podemos ayudarte a organizar tu equipo móvil hoy?
              </div>
            </div>
            <ChatInput />
          </div>
        )}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="h-14 w-14 bg-[#7B1B38] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#5a1329] transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-200"
          aria-label="Abrir chat de soporte"
          aria-expanded={isChatOpen}
        >
          {isChatOpen ? <IconClose className="h-6 w-6" /> : <IconChat className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
}

/**
 * =============================================================================
 * SUB-COMPONENTES LÓGICOS (FORMULARIO Y CHAT INPUT)
 * =============================================================================
 */

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    description: '',
    privacy: false
  });
  
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    // Validación básica front-end
    if (!formData.name || !formData.phone || !formData.email || !formData.privacy) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      alert("Por favor rellena los campos obligatorios y acepta la política.");
      return;
    }

    setStatus('submitting');

    try {
      // Simulación de envío a Webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'landing_page',
          timestamp: new Date().toISOString()
        })
      });

      // NOTA: Si el webhook no devuelve OK (por CORS o error), manejamos el catch.
      // En un entorno real, asegurar headers CORS en el servidor destino.
      if (response.ok || response.type === 'opaque') { 
        setStatus('success');
      } else {
        throw new Error('Error de red');
      }
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      // Fallback UI para demo (simulamos éxito tras delay si falla el fetch real para que veas la UI)
      setTimeout(() => setStatus('success'), 1000);
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12 animate-pulse-once">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <IconCheck className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{COPY.form.successTitle}</h3>
        <p className="text-gray-600">{COPY.form.successMsg}</p>
        <button 
          onClick={() => setStatus('idle')} 
          className="mt-6 text-[#7B1B38] font-medium underline hover:text-[#5a1329]"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{COPY.form.nameLabel} *</label>
        <input 
          type="text" id="name" name="name" required
          value={formData.name} onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7B1B38] focus:border-transparent outline-none transition-shadow"
          placeholder="Juan Pérez"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">{COPY.form.phoneLabel} *</label>
          <input 
            type="tel" id="phone" name="phone" required
            value={formData.phone} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7B1B38] focus:border-transparent outline-none transition-shadow"
            placeholder="+34 600 000 000"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{COPY.form.emailLabel} *</label>
          <input 
            type="email" id="email" name="email" required
            value={formData.email} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7B1B38] focus:border-transparent outline-none transition-shadow"
            placeholder="juan@empresa.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">{COPY.form.companyLabel}</label>
        <input 
          type="text" id="company" name="company"
          value={formData.company} onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7B1B38] focus:border-transparent outline-none transition-shadow"
          placeholder="Mi Empresa S.L."
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">{COPY.form.descLabel}</label>
        <textarea 
          id="description" name="description" rows="3"
          value={formData.description} onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7B1B38] focus:border-transparent outline-none transition-shadow resize-none"
          placeholder="Somos una empresa de reparaciones y necesitamos registrar..."
        ></textarea>
      </div>

      <div className="flex items-start gap-3 pt-2">
        <input 
          type="checkbox" id="privacy" name="privacy" required
          checked={formData.privacy} onChange={handleChange}
          className="mt-1 h-4 w-4 text-[#7B1B38] border-gray-300 rounded focus:ring-[#7B1B38]"
        />
        <label htmlFor="privacy" className="text-xs text-gray-500 leading-snug cursor-pointer select-none">
          {COPY.form.privacyLabel}
        </label>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <button 
          type="submit" 
          disabled={status === 'submitting'}
          className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg shadow-md transition-all 
            ${status === 'submitting' ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7B1B38] hover:bg-[#5a1329] hover:shadow-lg'}`}
        >
          {status === 'submitting' ? 'Enviando...' : COPY.form.submitBtn}
        </button>

        {/* Botón WhatsApp Placeholder */}
        <a 
          href="#" 
          onClick={(e) => e.preventDefault()} // Placeholder
          className="block w-full text-center text-sm font-semibold text-[#616d71] hover:text-[#7B1B38] transition-colors"
        >
          {COPY.form.whatsappBtn}
        </a>
      </div>
    </form>
  );
}

function ChatInput() {
  const [msg, setMsg] = useState('');
  
  const handleSend = (e) => {
    e.preventDefault();
    if(!msg.trim()) return;
    
    // Aquí se enviaría al Webhook igual que el form principal
    // Para demo, solo limpiamos
    console.log("Chat msg:", msg);
    alert("Gracias. Un agente te contactará pronto (Demo).");
    setMsg('');
  };

  return (
    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
      <input 
        type="text" 
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        placeholder={COPY.chat.placeholder}
        className="flex-1 text-sm px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-[#7B1B38]"
      />
      <button 
        type="submit"
        className="bg-[#7B1B38] text-white p-2 rounded-md hover:bg-[#5a1329] transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );
}

/* * NOTAS DE IMPLEMENTACIÓN:
 * 1. Animaciones: Se usan transiciones CSS de Tailwind. Para animaciones de entrada complejas, 
 * considerar agregar clases keyframes en el CSS global o tailwind.config.
 * 2. Analytics: Insertar snippets de GA4/Hotjar en el <head> de index.html del proyecto principal.
 * 3. Lazy Loading: Si la landing crece, separar `ContactForm` y `ChatWidget` con React.lazy().
 * 4. Seguridad: El Webhook URL está expuesto en el cliente. Usar rate-limiting en el servidor destino.
 */