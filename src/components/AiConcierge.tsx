import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Brain, Image as ImageIcon, Loader2, X, Crown, Search, Zap, Maximize2 } from 'lucide-react';
import { chatWithGemini, generateImageConcept } from '../services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image';
}

const ASPECT_RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"];

export const AiConcierge = ({ isPremium, onActivatePremium }: { isPremium: boolean, onActivatePremium: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [useFastMode, setUseFastMode] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [mode, setMode] = useState<'chat' | 'image'>('chat');

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (mode === 'chat') {
        const response = await chatWithGemini(input, {
          useThinking,
          useSearch,
          useFastMode
        });
        setMessages(prev => [...prev, { role: 'assistant', content: response || 'Desculpe, não consegui processar sua solicitação.' }]);
      } else {
        // Image generation requires API key selection check
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio.openSelectKey();
        }
        
        const imageUrl = await generateImageConcept(input, aspectRatio);
        if (imageUrl) {
          setMessages(prev => [...prev, { role: 'assistant', content: imageUrl, type: 'image' }]);
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Não foi possível gerar a imagem no momento.' }]);
        }
      }
    } catch (error: any) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Erro: ${error.message || 'Ocorreu um erro inesperado.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-[700px] bg-white rounded-[3rem] border border-champagne/20 overflow-hidden flex flex-col shadow-luxury">
      {!isPremium && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-center p-8 text-center">
          <div className="max-w-md">
            <Crown className="w-16 h-16 text-champagne mx-auto mb-6 animate-pulse" />
            <h3 className="text-3xl font-serif text-onyx mb-4 italic font-bold">Acesso Exclusivo Premium</h3>
            <p className="text-onyx/60 text-sm uppercase tracking-widest mb-8 leading-relaxed font-medium">
              Ative seu acesso VIP para desbloquear o Concierge de IA e criar conceitos visuais únicos para seu evento.
            </p>
            <button 
              onClick={onActivatePremium}
              className="gold-gradient text-white px-12 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-luxury hover:scale-105 transition-all"
            >
              Ativar Agora
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-8 border-b border-champagne/10 flex items-center justify-between bg-silk/30">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-champagne/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-champagne" />
          </div>
          <div>
            <h4 className="text-onyx font-serif italic text-xl font-bold">AI Design Concierge</h4>
            <p className="text-[9px] text-onyx/40 uppercase tracking-[0.3em] font-bold">Powered by Gemini 3.1 & Pro</p>
          </div>
        </div>
        <div className="flex bg-white/50 p-1 rounded-xl border border-champagne/10">
          <button 
            onClick={() => setMode('chat')}
            className={cn(
              "px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all",
              mode === 'chat' ? "bg-champagne text-white" : "text-onyx/40 hover:text-onyx"
            )}
          >
            Chat
          </button>
          <button 
            onClick={() => setMode('image')}
            className={cn(
              "px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all",
              mode === 'image' ? "bg-champagne text-white" : "text-onyx/40 hover:text-onyx"
            )}
          >
            Imagens
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-ivory/50">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <Sparkles className="w-12 h-12 text-champagne mb-4" />
            <p className="text-onyx font-serif italic text-lg font-bold">Como posso elevar seu evento hoje?</p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex flex-col max-w-[80%]",
                msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn(
                "p-6 rounded-3xl text-sm leading-relaxed font-medium",
                msg.role === 'user' 
                  ? "bg-champagne text-white shadow-md rounded-tr-none" 
                  : "bg-white text-onyx/80 border border-champagne/10 rounded-tl-none shadow-sm"
              )}>
                {msg.type === 'image' ? (
                  <div className="space-y-4">
                    <img src={msg.content} alt="AI Generated Concept" className="w-full rounded-2xl shadow-luxury" />
                    <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Conceito Visual Gerado</p>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
              <span className="text-[8px] uppercase tracking-widest text-onyx/30 mt-2 font-bold">
                {msg.role === 'user' ? 'Você' : 'Concierge'}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex items-center gap-3 text-champagne">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[9px] uppercase tracking-widest font-bold">Processando sua visão...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white border-t border-champagne/10">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {mode === 'chat' ? (
            <>
              <button 
                onClick={() => setUseThinking(!useThinking)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all border",
                  useThinking 
                    ? "bg-champagne/20 text-champagne border-champagne/30" 
                    : "bg-onyx/5 text-onyx/40 border-onyx/5 hover:text-onyx/60"
                )}
              >
                <Brain className="w-3 h-3" />
                Thinking Mode {useThinking ? 'ON' : 'OFF'}
              </button>
              <button 
                onClick={() => setUseSearch(!useSearch)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all border",
                  useSearch 
                    ? "bg-blue-500/20 text-blue-600 border-blue-500/30" 
                    : "bg-onyx/5 text-onyx/40 border-onyx/5 hover:text-onyx/60"
                )}
              >
                <Search className="w-3 h-3" />
                Google Search {useSearch ? 'ON' : 'OFF'}
              </button>
              <button 
                onClick={() => setUseFastMode(!useFastMode)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all border",
                  useFastMode 
                    ? "bg-amber-500/20 text-amber-600 border-amber-500/30" 
                    : "bg-onyx/5 text-onyx/40 border-onyx/5 hover:text-onyx/60"
                )}
              >
                <Zap className="w-3 h-3" />
                Fast Mode {useFastMode ? 'ON' : 'OFF'}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Maximize2 className="w-3 h-3 text-onyx/40 shrink-0" />
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest transition-all border shrink-0",
                    aspectRatio === ratio
                      ? "bg-champagne text-white border-champagne"
                      : "bg-onyx/5 text-onyx/40 border-onyx/5 hover:text-onyx/60"
                  )}
                >
                  {ratio}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={mode === 'chat' ? "Ex: Sugira uma paleta de cores para um casamento no campo..." : "Ex: Convite minimalista com bordas de ouro e papel artesanal..."}
            className="w-full bg-ivory border border-champagne/20 rounded-2xl px-8 py-5 outline-none focus:border-champagne transition-all text-sm text-onyx placeholder:text-onyx/20 font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-champagne rounded-xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {mode === 'chat' ? <Send className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
