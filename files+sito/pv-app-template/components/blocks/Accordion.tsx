import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/**
 * ACCORDION (PV UX CANON)
 * Layer 4-7 sono collassati per default
 * Utente può approfondire solo se interessato
 * Massimizza chiarezza + optionalità
 */
export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <span
          className={`text-xl text-slate-600 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="px-6 py-4 border-t border-slate-200 bg-white space-y-4 text-slate-700">
          {children}
        </div>
      )}
    </div>
  );
}
