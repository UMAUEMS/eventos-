/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  ShoppingBag, 
  Instagram, 
  MessageCircle, 
  ChevronRight, 
  Upload, 
  Heart, 
  Star,
  Menu,
  X,
  Palette,
  Camera,
  Music,
  Utensils,
  Flower2,
  Sparkles,
  ArrowRight,
  Gem,
  MousePointer2,
  Layers,
  Fingerprint,
  Crown,
  Facebook,
  Mail
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { AiConcierge } from './components/AiConcierge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [customization, setCustomization] = useState({
    names: '',
    email: '',
    date: '',
    guests: '',
    dream: '',
    items: [] as string[]
  });

  const handleCustomizationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomization(prev => ({ ...prev, [name]: value }));
  };

  const toggleItem = (item: string) => {
    setCustomization(prev => ({
      ...prev,
      items: prev.items.includes(item) 
        ? prev.items.filter(i => i !== item)
        : [...prev.items, item]
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customization.names || !customization.email) {
      setToast('Por favor, preencha os campos obrigatórios.');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
    setCustomization({
      names: '',
      email: '',
      date: '',
      guests: '',
      dream: '',
      items: []
    });
  };

  const heroRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const handleActivatePremium = async () => {
    try {
      // Using the platform's key selection dialog
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
      setIsPremium(true);
      setToast('Acesso Premium Ativado. Bem-vinda ao nível de excelência.');
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setToast('Por favor, selecione uma chave API válida.');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const addToCart = (item: string) => {
    setCartCount(prev => prev + 1);
    setToast(`${item} adicionado ao seu carrinho de prestígio.`);
    setTimeout(() => setToast(null), 3000);
  };

  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isTouch) {
        setCursorPos({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Initial Reveal Animations
    const ctx = gsap.context(() => {
      // Reveal Mask Animation
      gsap.utils.toArray<HTMLElement>('.reveal-mask').forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          },
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.5,
          ease: 'power4.inOut',
        });
      });

      // Fade In Up
      gsap.utils.toArray<HTMLElement>('.fade-up').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
          },
          opacity: 0,
          y: 40,
          duration: 1,
          ease: 'power3.out',
        });
      });

      // Hero Parallax
      if (heroRef.current) {
        gsap.to('.hero-bg', {
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
          y: 100,
          scale: 1.1,
        });
      }
    }, mainRef);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      ctx.revert();
    };
  }, []);

  const { scrollY, scrollYProgress } = useScroll();
  const headerBgOpacity = useTransform(scrollY, [0, 150], [0, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 150], [0, 30]);
  const headerPadding = useTransform(scrollY, [0, 150], ["2.5rem", "1.25rem"]);
  const headerBorder = useTransform(scrollY, [0, 150], ["rgba(224, 142, 157, 0)", "rgba(224, 142, 157, 0.15)"]);

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  const handleAddToCart = () => {
    if (customization.names && customization.date) {
      setCartCount(prev => prev + 1);
      // Custom elegant toast would be better, but using alert for simplicity in this environment
      alert('Sua obra de arte foi adicionada ao carrinho.');
    }
  };

  const partners = [
    { icon: Camera, name: "Olhar Eterno", service: "Fotografia Fine Art", color: "bg-rose-dust/10" },
    { icon: Flower2, name: "Jardim de Versailles", service: "Design Floral", color: "bg-champagne/10" },
    { icon: Utensils, name: "Gourmet Royale", service: "Alta Gastronomia", color: "bg-silk" },
    { icon: Music, name: "Sinfonia do Sim", service: "Orquestra & Coral", color: "bg-silk/30" },
  ];

  return (
    <div ref={mainRef} className="min-h-screen selection:bg-champagne selection:text-white">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-champagne z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* NAVIGATION */}
      <motion.header 
        style={{ 
          backgroundColor: useTransform(headerBgOpacity, (o) => `rgba(253, 248, 248, ${o})`),
          backdropFilter: useTransform(headerBlur, (b) => `blur(${b}px)`),
          paddingTop: headerPadding,
          paddingBottom: headerPadding,
          borderBottom: `1px solid`,
          borderBottomColor: headerBorder
        }}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-700 px-6 md:px-12 text-onyx"
      >
        <nav className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-luxury border border-champagne/10 group-hover:rotate-12 transition-transform duration-700">
              <Sparkles className="w-6 h-6 text-champagne" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif tracking-[0.3em] font-bold uppercase leading-none">Soluções</span>
              <span className="text-[8px] tracking-[0.6em] font-bold uppercase text-champagne mt-1">Para seu Evento</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-12 text-[9px] font-bold uppercase tracking-[0.4em]">
            {[
              { label: 'Início', id: 'inicio' },
              { label: 'Coleções', id: 'coleções' },
              { label: 'Concierge', id: 'concierge' },
              { label: 'Atelier', id: 'atelier' },
              { label: 'Blog', id: 'blog' }
            ].map((item) => (
              <motion.a 
                key={item.id} 
                href={`#${item.id}`} 
                whileHover={{ y: -2 }}
                className="hover:text-champagne transition-colors relative group py-2"
              >
                {item.label}
                <motion.span 
                  className="absolute bottom-0 left-0 w-0 h-[1px] bg-champagne transition-all duration-500 ease-out group-hover:w-full" 
                />
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <motion.button 
              onClick={handleActivatePremium}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "hidden md:flex items-center gap-3 px-8 py-3 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all duration-700 shadow-luxury",
                isPremium 
                  ? "bg-white text-champagne border border-champagne/20" 
                  : "gold-gradient text-white"
              )}
            >
              <Crown className={cn("w-3.5 h-3.5", isPremium ? "text-champagne" : "text-white")} />
              {isPremium ? "Membro VIP" : "Acesso Premium"}
            </motion.button>
            
            <div className="relative cursor-pointer group p-2">
              <ShoppingBag className="w-5 h-5 group-hover:text-champagne transition-colors" />
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-champagne text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                >
                  {cartCount}
                </motion.span>
              )}
            </div>
            
            <button 
              className="lg:hidden text-onyx p-2 hover:bg-silk/50 rounded-xl transition-colors" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <motion.div 
          initial={false}
          animate={{ x: isMenuOpen ? 0 : '100%' }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 bg-white z-[60] lg:hidden flex flex-col items-center justify-center gap-12"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
          <button 
            className="absolute top-8 right-8 text-onyx" 
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          {[
            { label: 'Início', id: 'inicio' },
            { label: 'Coleções', id: 'coleções' },
            { label: 'Concierge', id: 'concierge' },
            { label: 'Atelier', id: 'atelier' },
            { label: 'Blog', id: 'blog' }
          ].map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`} 
              onClick={() => setIsMenuOpen(false)}
              className="text-onyx text-3xl font-serif tracking-widest hover:text-champagne transition-colors"
            >
              {item.label}
            </a>
          ))}
          <button 
            onClick={() => {
              handleActivatePremium();
              setIsMenuOpen(false);
            }}
            className="gold-gradient text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest"
          >
            Acesso Premium
          </button>
        </motion.div>
      </motion.header>

      {/* HERO: THE PRELUDE */}
      <section id="inicio" ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0 hero-bg">
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070" 
            alt="Luxury Wedding" 
            className="w-full h-full object-cover scale-105 brightness-[0.6]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-onyx/80 via-transparent to-ivory" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-12"
          >
            <span className="text-champagne text-[10px] font-bold uppercase tracking-[1em] block mb-8 opacity-80">Soluções para seu evento</span>
            <h1 className="text-display text-white font-medium drop-shadow-2xl">
              O Despertar do <br />
              <span className="italic text-gradient-gold">Inesquecível</span>
            </h1>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-12 leading-loose tracking-widest font-light"
          >
            Papelaria de luxo e experiências digitais que tocam o coração. 
            Onde a delicadeza do artesanal encontra a perfeição do design.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <button 
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => document.getElementById('atelier')?.scrollIntoView({ behavior: 'smooth' })}
              className="gold-gradient text-onyx px-14 py-6 rounded-full font-bold uppercase tracking-[0.4em] text-[10px] shadow-luxury hover:scale-105 transition-all duration-500"
            >
              Iniciar Consultoria
            </button>
            <button 
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => document.getElementById('papelaria')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-white border border-white/20 px-14 py-6 rounded-full font-bold uppercase tracking-[0.4em] text-[10px] backdrop-blur-md hover:bg-white hover:text-onyx transition-all duration-500"
            >
              Explorar Coleções
            </button>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="text-white/30 text-[9px] font-bold uppercase tracking-[0.6em]">Descobrir</div>
          <div className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* THE EXPERIENCE: PHILOSOPHY */}
      <section className="py-40 bg-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              { icon: Fingerprint, title: "Identidade Única", desc: "Cada traço é desenhado para refletir a alma do seu evento, criando uma conexão profunda com seus convidados.", color: "bg-silk/50" },
              { icon: Layers, title: "Materiais Nobres", desc: "Papéis de algodão 600g, sedas italianas e acabamentos em ouro 24k para uma experiência tátil inigualável.", color: "bg-ivory" },
              { icon: Sparkles, title: "Inovação Digital", desc: "Tecnologia de ponta que conecta seus convidados de forma imersiva, do Save the Date ao RSVP inteligente.", color: "bg-silk/50" }
            ].map((item, i) => (
              <div key={i} className={cn("luxury-card text-center fade-up group", item.color)}>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-luxury transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 border border-champagne/20">
                  <item.icon className="w-8 h-8 text-champagne" />
                </div>
                <h3 className="text-3xl font-serif mb-6 italic font-bold">{item.title}</h3>
                <p className="text-onyx/70 text-sm leading-relaxed tracking-wide font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTAQUE: THE MASTERPIECE */}
      <section className="py-40 bg-gold-dark text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="fade-up">
              <span className="text-gold-light font-bold text-[10px] uppercase tracking-[0.8em] block mb-6">Destaque do Mês</span>
              <h2 className="text-6xl md:text-8xl font-serif mb-10 leading-[0.9] text-white">
                Coleção <br /> <span className="italic text-white font-medium">Majestic Gold</span>
              </h2>
              <p className="text-white/80 text-lg mb-12 leading-relaxed font-medium max-w-xl">
                Nossa obra-prima mais desejada. Papel de algodão 600g, bordas em folha de ouro e envelope em couro ecológico com brasão em relevo seco. Uma experiência tátil inigualável que define o tom do seu prestígio.
              </p>
              <div className="flex flex-wrap items-center gap-12 mb-16">
                <div className="text-left">
                  <div className="text-4xl font-serif text-gold-light mb-1">100%</div>
                  <div className="label-micro !text-white/60">Artesanal</div>
                </div>
                <div className="w-[1px] h-16 bg-white/20" />
                <div className="text-left">
                  <div className="text-4xl font-serif text-gold-light mb-1">Limitada</div>
                  <div className="label-micro !text-white/60">Edição</div>
                </div>
              </div>
              <button 
                onClick={() => addToCart('Coleção Majestic Gold')}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="bg-white text-gold-dark px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] shadow-luxury hover:scale-105 transition-all duration-500"
              >
                Reservar esta Coleção
              </button>
            </div>
            <div className="relative reveal-mask group">
              <div className="absolute inset-0 bg-champagne/20 rounded-2xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <img 
                src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1200" 
                alt="Majestic Gold" 
                className="w-full rounded-2xl shadow-luxury relative z-10 transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute -top-8 -right-8 bg-champagne text-onyx px-8 py-8 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] animate-float z-20 flex items-center justify-center text-center leading-tight">
                Best<br/>Seller
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAPELARIA: THE CATALOG */}
      <section id="coleções" className="py-40 bg-ivory">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
          <div className="text-center mb-32">
            <span className="label-micro mb-6 block">Nossas Vertentes</span>
            <h2 className="text-6xl md:text-8xl font-serif mb-8 reveal-mask">Universos de <span className="italic text-gradient-gold">Papelaria</span></h2>
            <p className="text-onyx/40 max-w-2xl mx-auto fade-up text-lg font-light">Explore as possibilidades infinitas para o seu evento. Do digital ao físico, cada detalhe é planejado para surpreender e encantar.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Convite Digital",
                desc: "Elegância e praticidade para o mundo moderno. Ideal para Save the Date e convites dinâmicos com confirmação instantânea.",
                img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
                items: ["Save the Date", "Convite WhatsApp", "Lembrete de Evento"],
                icon: Sparkles
              },
              {
                title: "Convite Interativo",
                desc: "A tecnologia a serviço do seu grande dia. Confirmação de presença, mapas e lista de presentes em um só toque sofisticado.",
                img: "https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80&w=800",
                items: ["RSVP Online", "Mapa Interativo", "Galeria de Fotos"],
                icon: Heart
              },
              {
                title: "Convite Físico",
                desc: "A tradição do toque e a nobreza do papel. Texturas que contam histórias e acabamentos que elevam o padrão do seu evento.",
                img: "https://images.unsplash.com/photo-1522673607200-16488354495f?auto=format&fit=crop&q=80&w=800",
                items: ["Papel Algodão", "Hot Stamping", "Lacre de Cera"],
                icon: Flower2
              }
            ].map((cat, i) => (
              <div key={i} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-luxury transition-all duration-700 hover:-translate-y-6 fade-up border border-onyx/5 hover:border-champagne/20">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src={cat.img} 
                    alt={cat.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    referrerPolicy="no-referrer" 
                    loading="lazy"
                  />
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-champagne shadow-luxury">
                    <cat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="p-12">
                  <h3 className="text-4xl font-serif mb-6">{cat.title}</h3>
                  <p className="text-onyx/50 text-sm mb-10 leading-relaxed font-medium">{cat.desc}</p>
                  <ul className="space-y-5 mb-12">
                    {cat.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-[0.3em] text-onyx/30 group-hover:text-onyx/70 transition-colors">
                        <div className="w-2 h-2 bg-champagne rounded-full shadow-[0_0_15px_rgba(197,160,89,0.6)]" /> {item}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => addToCart(cat.title)}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="w-full border border-onyx/10 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-champagne hover:text-white transition-all duration-500"
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONCIERGE: THE PARTNERS */}
      <section id="concierge" className="py-40 bg-silk text-onyx overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-32 gap-12">
            <div className="fade-up">
              <span className="label-micro !text-champagne mb-8 block font-bold">Curadoria de Elite</span>
              <h2 className="text-6xl md:text-8xl font-serif italic text-onyx font-bold">Concierge de <br /> <span className="text-onyx not-italic font-medium">Parceiros</span></h2>
            </div>
            <p className="text-onyx/70 max-w-md text-lg leading-relaxed mb-4 fade-up font-medium">
              Selecionamos apenas os melhores profissionais do mercado global para garantir que cada detalhe do seu evento seja uma obra de arte impecável.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((partner, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -15 }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className={cn(
                  "p-16 rounded-[3rem] transition-all duration-700 border border-onyx/5 hover:border-champagne/30 group relative overflow-hidden",
                  partner.color.includes('onyx') ? "bg-white" : partner.color
                )}
              >
                <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0">
                  <ArrowRight className="w-6 h-6 text-champagne" />
                </div>
                <div className="w-20 h-20 rounded-3xl bg-silk/30 flex items-center justify-center mb-12 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700 shadow-luxury">
                  <partner.icon className="w-8 h-8 text-champagne" />
                </div>
                <h4 className="text-3xl font-serif mb-4 italic">{partner.name}</h4>
                <p className="label-micro !text-onyx/20 group-hover:text-onyx/40 transition-colors">{partner.service}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-32 text-center">
            <button 
              onClick={() => setToast('Nossa rede completa de parceiros será enviada para o seu e-mail.')}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="text-champagne label-micro flex items-center gap-6 mx-auto group hover:text-white transition-colors"
            >
              Ver Todos os Parceiros
              <div className="w-16 h-[1px] bg-champagne/30 group-hover:w-32 group-hover:bg-white transition-all duration-700" />
            </button>
          </div>
        </div>
      </section>

      {/* ORÇAMENTO: THE CONFIGURATOR */}
      <section id="atelier" className="py-32 bg-silk">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24">
            <AiConcierge isPremium={isPremium} onActivatePremium={handleActivatePremium} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
            <div className="fade-up lg:sticky lg:top-40">
              <span className="label-micro mb-8 block font-bold">Configurador de Sonhos</span>
              <h2 className="text-6xl md:text-8xl font-serif mb-10 leading-[0.9] font-bold">Inicie sua <br /> <span className="italic text-gradient-gold font-medium">Jornada</span></h2>
              <p className="text-onyx/70 mb-16 leading-relaxed text-lg font-medium max-w-xl">
                Cada detalhe da sua identidade visual é uma promessa de beleza. Selecione os elementos que farão parte da sua história e receba uma proposta exclusiva e personalizada, desenhada sob medida para o seu prestígio.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-16">
                {[
                  { id: 'menu', label: 'Menu de Mesa', icon: Utensils },
                  { id: 'table', label: 'Número de Mesa', icon: Gem },
                  { id: 'padrinhos', label: 'Convite Padrinhos', icon: Heart },
                  { id: 'debutantes', label: 'Convite Debutantes', icon: Sparkles },
                  { id: 'cerimonial', label: 'Kit Cerimonial', icon: Palette },
                  { id: 'tags', label: 'Tags & Adesivos', icon: Star },
                ].map((item) => (
                  <label key={item.id} className={cn(
                    "flex items-center gap-5 p-6 bg-white rounded-2xl cursor-pointer transition-all duration-500 group shadow-luxury border",
                    customization.items.includes(item.label) ? "border-champagne bg-champagne/5" : "border-onyx/5"
                  )}>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-champagne" 
                      checked={customization.items.includes(item.label)}
                      onChange={() => toggleItem(item.label)}
                    />
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
                        customization.items.includes(item.label) ? "text-onyx" : "text-onyx/40 group-hover:text-onyx"
                      )}>{item.label}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="bg-ivory text-onyx p-16 rounded-[3rem] shadow-luxury relative overflow-hidden group border border-champagne/10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-champagne/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-1000 group-hover:scale-150" />
                <h4 className="text-3xl font-serif mb-6 italic font-bold">Parceria com Cerimonialistas</h4>
                <p className="text-onyx/60 text-sm leading-relaxed font-medium">
                  Trabalhamos em conjunto com as melhores cerimonialistas do Brasil. Se você já tem uma profissional, nós cuidamos de toda a entrega técnica e logística para garantir a perfeição absoluta em cada detalhe.
                </p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="bg-white p-16 rounded-[4rem] shadow-luxury fade-up border border-onyx/5">
              <h3 className="text-4xl font-serif mb-12">Essência do Evento</h3>
              <div className="space-y-10">
                <div className="space-y-8">
                  <div className="group">
                    <label className="label-micro mb-4 block opacity-40">Nome dos Protagonistas</label>
                    <input 
                      type="text" 
                      name="names"
                      value={customization.names}
                      onChange={handleCustomizationChange}
                      placeholder="Ex: Maria & João" 
                      className="w-full bg-silk/30 border-none rounded-2xl px-10 py-6 outline-none focus:ring-1 focus:ring-champagne transition-all text-sm font-medium" 
                    />
                  </div>
                  <div className="group">
                    <label className="label-micro mb-4 block opacity-40">E-mail de Prestígio</label>
                    <input 
                      type="email" 
                      name="email"
                      value={customization.email}
                      onChange={handleCustomizationChange}
                      placeholder="seu@email.com" 
                      className="w-full bg-silk/30 border-none rounded-2xl px-10 py-6 outline-none focus:ring-1 focus:ring-champagne transition-all text-sm font-medium" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="group">
                      <label className="label-micro mb-4 block opacity-40">Data do Sim</label>
                      <input 
                        type="text" 
                        name="date"
                        value={customization.date}
                        onChange={handleCustomizationChange}
                        placeholder="DD/MM/AAAA" 
                        className="w-full bg-silk/30 border-none rounded-2xl px-10 py-6 outline-none focus:ring-1 focus:ring-champagne transition-all text-sm font-medium" 
                      />
                    </div>
                    <div className="group">
                      <label className="label-micro mb-4 block opacity-40">Convidados</label>
                      <input 
                        type="number" 
                        name="guests"
                        value={customization.guests}
                        onChange={handleCustomizationChange}
                        placeholder="Qtd" 
                        className="w-full bg-silk/30 border-none rounded-2xl px-10 py-6 outline-none focus:ring-1 focus:ring-champagne transition-all text-sm font-medium" 
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="label-micro mb-4 block opacity-40">O Seu Sonho</label>
                    <textarea 
                      name="dream"
                      value={customization.dream}
                      onChange={handleCustomizationChange}
                      placeholder="Descreva o estilo, cores e sentimentos que deseja transmitir..." 
                      rows={6} 
                      className="w-full bg-silk/30 border-none rounded-2xl px-10 py-6 outline-none focus:ring-1 focus:ring-champagne transition-all text-sm font-medium resize-none" 
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="w-full gold-gradient text-onyx py-8 rounded-full font-bold uppercase tracking-[0.5em] text-[10px] shadow-luxury hover:tracking-[0.7em] transition-all duration-700"
                >
                  Solicitar Proposta Exclusiva
                </button>
                {showSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 bg-emerald-50 text-emerald-700 rounded-3xl text-center text-xs font-bold uppercase tracking-widest border border-emerald-100"
                  >
                    Sua solicitação foi enviada com sucesso!
                  </motion.div>
                )}
                <p className="text-center label-micro !text-onyx/20">Atendimento personalizado em até 24h úteis</p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* LOVE STORIES: THE TESTIMONIALS */}
      <section className="py-40 bg-silk/20 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-32">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mb-10"
            >
              <Heart className="w-12 h-12 text-champagne mx-auto" />
            </motion.div>
            <h2 className="text-6xl md:text-8xl font-serif mb-10 reveal-mask italic font-bold">Histórias de <br /> <span className="not-italic text-gradient-gold font-medium">Amor Real</span></h2>
            <p className="text-onyx/70 max-w-2xl mx-auto fade-up text-xl font-medium leading-relaxed">O que dizem as noivas e clientes que confiaram seus sonhos mais preciosos à nossa curadoria exclusiva.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {[
              {
                name: "Mariana & Ricardo",
                text: "Os convites foram o primeiro suspiro do nosso casamento. Cada convidado que recebia ficava maravilhado com a delicadeza e o perfume do papel. Foi o início perfeito para o nosso sim em Florença.",
                event: "Wedding in Tuscany",
                initial: "M"
              },
              {
                name: "Beatriz S.",
                text: "A experiência digital superou todas as expectativas. O convite interativo facilitou muito a vida dos convidados e o design ficou impecável, mantendo o luxo que eu sempre sonhei para meus 15 anos.",
                event: "Debutante Gala",
                initial: "B"
              }
            ].map((story, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -20 }}
                className="bg-white p-20 rounded-[4rem] shadow-luxury fade-up relative group luxury-border border-onyx/5"
              >
                <div className="absolute top-16 right-16 text-champagne/10 transition-all duration-1000 group-hover:rotate-12 group-hover:scale-125 group-hover:text-champagne/20">
                  <Star className="w-24 h-24 fill-current" />
                </div>
                <div className="relative z-10">
                  <div className="flex gap-2 mb-12">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-champagne text-champagne" />
                    ))}
                  </div>
                  <p className="text-onyx/80 text-2xl italic mb-16 leading-relaxed font-light">"{story.text}"</p>
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-silk rounded-full flex items-center justify-center font-serif text-3xl text-champagne shadow-luxury group-hover:scale-110 transition-transform duration-700">
                      {story.initial}
                    </div>
                    <div>
                      <div className="font-serif text-3xl text-onyx mb-2">{story.name}</div>
                      <div className="label-micro !text-champagne tracking-[0.3em]">{story.event}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG: THE INSPIRATION */}
      <section id="blog" className="py-40 bg-ivory relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-silk/20 -skew-x-12 translate-x-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-32">
            <span className="label-micro mb-8 block font-bold">Inspiração & Estilo</span>
            <h2 className="text-6xl md:text-8xl font-serif mb-10 reveal-mask font-bold">Blog de <br /> <span className="italic text-gradient-gold font-medium">Tendências</span></h2>
            <p className="text-onyx/70 max-w-2xl mx-auto fade-up text-xl font-medium leading-relaxed">
              Explore as últimas tendências em design de eventos, tipografia clássica e a arte de receber com elegância.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                category: "Design",
                date: "03 de setembro, 2025",
                title: "A Arte da Caligrafia",
                excerpt: "Como a caligrafia feita à mão traz uma alma única para o seu convite de casamento.",
                img: "https://picsum.photos/seed/calligraphy/800/1000"
              },
              {
                category: "Tendências",
                date: "28 de agosto, 2025",
                title: "Tendências 2025",
                excerpt: "Descubra as cores e texturas que dominarão os eventos de luxo na próxima temporada.",
                img: "https://picsum.photos/seed/luxury/800/1000"
              },
              {
                category: "Inovação",
                date: "15 de agosto, 2025",
                title: "O Convite Digital",
                excerpt: "A união perfeita entre a praticidade moderna e o requinte da papelaria tradicional.",
                img: "https://picsum.photos/seed/digital/800/1000"
              }
            ].map((post, i) => (
              <motion.article 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => setSelectedPost(post)}
              >
                <div className="aspect-[3/4] overflow-hidden rounded-[3rem] mb-10 shadow-luxury relative">
                  <img 
                    src={post.img} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-champagne/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-full shadow-luxury translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                      <span className="label-micro !text-onyx">Ler Artigo</span>
                    </div>
                  </div>
                  <div className="absolute top-8 left-8">
                    <span className="px-6 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-onyx shadow-luxury">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="px-4">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[10px] uppercase tracking-widest text-onyx/30 font-bold">{post.date}</span>
                  </div>
                  <h3 className="text-3xl font-serif mb-6 group-hover:text-champagne transition-colors duration-500">{post.title}</h3>
                  <p className="text-onyx/50 text-base leading-relaxed mb-8 font-light line-clamp-2">{post.excerpt}</p>
                  <button className="flex items-center gap-4 text-onyx group-hover:gap-8 transition-all duration-700">
                    <span className="label-micro !text-onyx">Descobrir Mais</span>
                    <ArrowRight className="w-5 h-5 text-champagne" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-12 left-1/2 z-[300] bg-white text-onyx px-8 py-4 rounded-full shadow-luxury border border-champagne/30 flex items-center gap-4"
        >
          <Sparkles className="w-4 h-4 text-champagne" />
          <span className="text-[10px] font-bold uppercase tracking-widest">{toast}</span>
        </motion.div>
      )}

      {/* BLOG MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedPost(null)}
            className="absolute inset-0 bg-white/90 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-luxury"
          >
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-8 right-8 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-luxury hover:scale-110 transition-transform"
            >
              <X className="w-6 h-6 text-onyx" />
            </button>
            <div className="aspect-video w-full">
              <img 
                src={selectedPost.img} 
                alt={selectedPost.title} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
                loading="lazy"
              />
            </div>
            <div className="p-12 md:p-20">
              <div className="flex items-center gap-4 mb-8">
                <span className="bg-champagne/10 text-champagne px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {selectedPost.category}
                </span>
                <span className="text-[10px] text-onyx/40 font-bold uppercase tracking-widest">
                  {selectedPost.date}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif mb-10 leading-tight">{selectedPost.title}</h2>
              <div className="prose prose-onyx max-w-none">
                <p className="text-onyx/70 text-lg leading-relaxed mb-8">
                  {selectedPost.excerpt}
                </p>
                <p className="text-onyx/60 leading-loose mb-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <p className="text-onyx/60 leading-loose">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.
                </p>
              </div>
              <div className="mt-16 pt-12 border-t border-onyx/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-silk rounded-full" />
                  <div>
                    <div className="text-sm font-bold uppercase tracking-widest">Soluções para seu evento</div>
                    <div className="text-[10px] text-onyx/40 uppercase tracking-widest">Creative Director</div>
                  </div>
                </div>
                <button className="gold-gradient text-onyx px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Compartilhar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-silk text-onyx py-32 border-t border-champagne/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-32">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-10 group cursor-pointer">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-luxury group-hover:rotate-12 transition-transform duration-700 border border-champagne/20">
                  <Sparkles className="w-8 h-8 text-champagne" />
                </div>
                <span className="text-3xl font-serif tracking-tighter font-bold">Soluções para seu evento</span>
              </div>
              <p className="text-onyx/60 max-w-md text-lg leading-relaxed font-medium mb-12">
                Elevando a arte da papelaria a um novo patamar de luxo e sofisticação. Cada detalhe é uma promessa de beleza eterna.
              </p>
              <div className="flex gap-8">
                {[Instagram, Facebook, Mail].map((Icon, i) => (
                  <motion.a 
                    key={i}
                    href="#" 
                    whileHover={{ y: -5, scale: 1.1 }}
                    className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center hover:bg-champagne/20 transition-all duration-500 border border-onyx/5 shadow-sm"
                  >
                    <Icon className="w-6 h-6 text-champagne" />
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="label-micro !text-champagne mb-10 font-bold">Explorar</h4>
              <ul className="space-y-6">
                {[
                  { label: 'Atelier', id: 'atelier' },
                  { label: 'Coleções', id: 'coleções' },
                  { label: 'Concierge', id: 'concierge' },
                  { label: 'Blog', id: 'blog' },
                  { label: 'Início', id: 'inicio' }
                ].map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-onyx/40 hover:text-onyx transition-colors text-lg font-medium flex items-center gap-4 group">
                      <div className="w-0 h-[1px] bg-champagne group-hover:w-6 transition-all duration-500" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="label-micro !text-champagne mb-10 font-bold">Atendimento</h4>
              <ul className="space-y-6 text-onyx/40 text-lg font-medium">
                <li className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-champagne" />
                  contato@solucoes.com
                </li>
                <li className="flex items-center gap-4">
                  <Sparkles className="w-5 h-5 text-champagne" />
                  WhatsApp VIP
                </li>
                <li className="pt-6">
                  <span className="label-micro !text-onyx/20 block mb-2 font-bold">Horário de Brasília</span>
                  Seg - Sex: 09h às 18h
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-16 border-t border-onyx/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="label-micro !text-onyx/20 font-bold">© 2025 Soluções para seu evento. Todos os direitos reservados.</p>
            <div className="flex gap-12">
              <a href="#" className="label-micro !text-onyx/20 hover:text-champagne transition-colors font-bold">Privacidade</a>
              <a href="#" className="label-micro !text-onyx/20 hover:text-champagne transition-colors font-bold">Termos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
