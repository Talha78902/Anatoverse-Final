import React, { useMemo, useRef, useState } from 'react';
import { BookMarked, Bot, GraduationCap, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { generateMedicalChatReply } from '../lib/medicalChatEngine';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  references?: string[];
  followUps?: string[];
  matchedTopic?: string;
};

const makeId = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

const starterQuestions = [
  'Ask me 5 viva questions about the heart',
  'Explain lungs histology with clinical correlation',
  'What is the blood supply of the liver?',
  'Compare small intestine and large intestine',
];

const renderText = (text: string) => text.split('\n').map((line, index) => {
  if (!line.trim()) return <br key={index} />;
  const isHeading = !line.startsWith('•') && line.length < 80 && !line.endsWith('.') && !line.includes(':');
  if (isHeading) {
    return <div key={index} className="font-black text-slate-950 mt-3 first:mt-0">{line}</div>;
  }
  if (line.startsWith('•')) {
    return <div key={index} className="text-slate-700 pl-2 my-1">{line}</div>;
  }
  return <div key={index} className="text-slate-700 leading-relaxed">{line}</div>;
});

export const MedicalAiChat: React.FC<{ learnerName?: string }> = ({ learnerName = 'Student' }) => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: makeId(),
      role: 'assistant',
      content: `Hi ${learnerName}. I am your AnatoVerse AI Study Assistant. Ask cross-questions about anatomy, histology, embryology, physiology, or clinical correlations. I will answer in MBBS style and attach textbook-style references for verification.`,
      references: [
        "Gray's Anatomy for Students, 5th Edition; Moore's Clinically Oriented Anatomy, 9th Edition; Guyton and Hall Medical Physiology, 15th Edition; Junqueira Basic Histology, 17th Edition; Langman's Medical Embryology, 15th Edition; Robbins and Kumar Basic Pathology, 11th Edition.",
      ],
      followUps: starterQuestions,
      matchedTopic: 'Welcome',
    },
  ]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const lastAssistant = useMemo(() => [...messages].reverse().find((msg) => msg.role === 'assistant'), [messages]);

  const askQuestion = (value?: string) => {
    const finalQuestion = (value ?? question).trim();
    if (!finalQuestion) return;
    const userMessage: ChatMessage = { id: makeId(), role: 'user', content: finalQuestion };
    const reply = generateMedicalChatReply(finalQuestion);
    const assistantMessage: ChatMessage = {
      id: makeId(),
      role: 'assistant',
      content: reply.answer,
      references: reply.references,
      followUps: reply.followUps,
      matchedTopic: reply.matchedTopic,
    };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setQuestion('');
    window.setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 w-16 h-16 rounded-3xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-2xl shadow-cyan-500/30 border border-cyan-200 flex items-center justify-center cursor-pointer"
        aria-label="Open AI anatomy chat"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-white rounded-t-[2rem] sm:rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-950 text-white px-5 sm:px-6 py-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-cyan-400/10 border border-cyan-300/20 flex items-center justify-center text-cyan-300 shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-black truncate">AI Anatomy Cross-Question Assistant</h2>
                  <p className="text-xs text-slate-400 truncate">MBBS-style answers with curriculum textbook references</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/15 flex items-center justify-center cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 sm:px-6 py-4 bg-cyan-50 border-b border-cyan-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="flex gap-2 items-start text-cyan-900 font-bold"><GraduationCap className="w-4 h-4 shrink-0" /> Cross-questioning / viva mode</div>
              <div className="flex gap-2 items-start text-cyan-900 font-bold"><BookMarked className="w-4 h-4 shrink-0" /> References from standard MBBS books</div>
              <div className="flex gap-2 items-start text-cyan-900 font-bold"><Sparkles className="w-4 h-4 shrink-0" /> Anatomy, histology, embryology, clinical links</div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5 bg-slate-50">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[92%] sm:max-w-[82%] rounded-3xl px-4 py-3 shadow-sm ${message.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}>
                    {message.role === 'assistant' && message.matchedTopic && (
                      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-700 mb-2">{message.matchedTopic}</div>
                    )}
                    <div className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-slate-800'}`}>
                      {message.role === 'assistant' ? renderText(message.content) : message.content}
                    </div>
                    {message.role === 'assistant' && message.references && message.references.length > 0 && (
                      <div className="mt-4 border-t border-slate-100 pt-3">
                        <div className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 mb-2">References for verification</div>
                        <ol className="space-y-1 list-decimal pl-4">
                          {message.references.map((ref, index) => (
                            <li key={index} className="text-[11px] leading-relaxed text-slate-500">{ref.replace(/^\d+\.\s*/, '')}</li>
                          ))}
                        </ol>
                        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-2xl px-3 py-2 mt-3">
                          Educational support only. Always verify with your college syllabus, teachers, and prescribed textbook edition.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 sm:px-6 pt-4 bg-white border-t border-slate-200">
              {lastAssistant?.followUps && (
                <div className="flex gap-2 overflow-x-auto pb-3">
                  {lastAssistant.followUps.map((item) => (
                    <button
                      key={item}
                      onClick={() => askQuestion(item)}
                      className="shrink-0 px-3 py-2 rounded-full bg-slate-100 hover:bg-cyan-50 hover:text-cyan-700 text-slate-700 text-xs font-bold cursor-pointer border border-slate-200"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-3 pb-4">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') askQuestion();
                  }}
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                  placeholder="Ask: Explain thyroid histology, ask viva questions, compare organs..."
                />
                <button
                  onClick={() => askQuestion()}
                  className="w-14 h-14 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center cursor-pointer shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
