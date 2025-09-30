"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface LegalAccordionProps {
  slug: string;
  onAccepted: () => void;
}

// Mock legal documents - in production these would be fetched from API
const LEGAL_DOCUMENTS: Record<string, { title: string; content: string }> = {
  tos: {
    title: "Termini di Servizio",
    content: `
# TERMINI DI SERVIZIO

## 1. PREMESSA
Il presente documento disciplina i termini e le condizioni di utilizzo della piattaforma Suite Freelance CRM.

## 2. DEFINIZIONI
- "Servizio": la piattaforma Suite Freelance CRM
- "Utente": qualsiasi persona che accede al Servizio
- "Contenuti": tutti i dati, informazioni, testi, software inseriti dall'Utente

## 3. ACCETTAZIONE DEI TERMINI
L'utilizzo del Servizio implica l'accettazione integrale dei presenti Termini.

## 4. UTILIZZO DEL SERVIZIO
L'Utente si impegna a:
- Utilizzare il Servizio in conformità alla legge
- Non interferire con il funzionamento del Servizio
- Mantenere riservate le proprie credenziali di accesso

## 5. RESPONSABILITÀ
Il Servizio è fornito "così com'è" senza garanzie di alcun tipo.

## 6. DURATA E RISOLUZIONE
Il presente contratto ha durata indeterminata e può essere risolto da entrambe le parti.

## 7. LEGGE APPLICABILE
I presenti Termini sono disciplinati dalla legge italiana.
    `.trim()
  },
  privacy: {
    title: "Informativa Privacy",
    content: `
# INFORMATIVA PRIVACY

## PREMESSA
La presente informativa descrive le modalità di trattamento dei dati personali ai sensi del GDPR.

## TITOLARE DEL TRATTAMENTO
[NOME AZIENDA]
[INDIRIZZO]
[EMAIL DPO]

## FINALITÀ DEL TRATTAMENTO
I dati personali sono trattati per:
- Fornitura del servizio
- Gestione del rapporto contrattuale
- Adempimenti di legge

## BASE GIURIDICA
Il trattamento si basa su:
- Esecuzione del contratto
- Consenso dell'interessato
- Obbligo legale

## TIPOLOGIE DI DATI
Vengono trattati:
- Dati anagrafici
- Dati di contatto
- Dati relativi all'utilizzo del servizio

## MODALITÀ DI TRATTAMENTO
I dati sono trattati con strumenti informatici e organizzativi.

## CONSERVAZIONE
I dati sono conservati per il tempo necessario alle finalità del trattamento.

## DIRITTI DELL'INTERESSATO
L'interessato ha diritto a:
- Accesso ai propri dati
- Rettifica
- Cancellazione
- Limitazione del trattamento
- Portabilità
- Opposizione
    `.trim()
  },
  dpa: {
    title: "Accordo Trattamento Dati",
    content: `
# ACCORDO SUL TRATTAMENTO DATI

## 1. OGGETTO
Il presente accordo disciplina il trattamento dei dati personali nell'ambito del servizio.

## 2. RUOLI
- Titolare: l'Utente del servizio
- Responsabile: Suite Freelance CRM

## 3. CATEGORIE DI DATI
Vengono trattati dati relativi a:
- Clienti dell'Utente
- Preventivi e contratti
- Comunicazioni

## 4. FINALITÀ
Il trattamento è finalizzato alla gestione CRM e documentale.

## 5. SICUREZZA
Sono implementate misure di sicurezza tecniche e organizzative.

## 6. ISTRUZIONI
Il Responsabile tratta i dati secondo le istruzioni del Titolare.

## 7. SUBRESPONSABILI
L'utilizzo di sub-responsabili è autorizzato previa informativa.

## 8. ASSISTENZA
Il Responsabile assiste il Titolare nell'esercizio dei diritti.

## 9. NOTIFICA VIOLAZIONI
Le violazioni sono notificate entro 72 ore.

## 10. DURATA
L'accordo ha la stessa durata del contratto di servizio.
    `.trim()
  }
};

export function LegalAccordion({ slug, onAccepted }: LegalAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [dwellTime, setDwellTime] = useState(0);
  const [canAccept, setCanAccept] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const document = LEGAL_DOCUMENTS[slug];

  // Required dwell seconds before enabling accept
  const REQUIRED_SECONDS = 3;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isOpen && !canAccept) {
      interval = setInterval(() => {
        setDwellTime(prev => {
          const newTime = prev + 1;
          // Enable acceptance after REQUIRED_SECONDS and scrolled
          if (newTime >= REQUIRED_SECONDS && hasScrolled) {
            setCanAccept(true);
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, hasScrolled, canAccept]);

  // If content doesn't overflow (no scroll needed), mark as scrolled
  useEffect(() => {
    if (!isOpen) return;
    const el = scrollRef.current;
    if (el && el.scrollHeight <= el.clientHeight) {
      setHasScrolled(true);
    }
  }, [isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollPercentage = (element.scrollTop + element.clientHeight) / element.scrollHeight;
    
    if (scrollPercentage > 0.8) { // 80% scrolled
      setHasScrolled(true);
    }
  };

  const handleAccept = () => {
    if (!canAccept) return;
    
    setIsAccepted(true);
    onAccepted();
  };

  if (!document) {
    return <div>Documento non trovato</div>;
  }

  return (
    <Card className="border">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{document.title}</h3>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
            className="text-blue-600 hover:text-blue-800"
          >
            {isOpen ? 'Chiudi' : 'Leggi Documento'} 
            {isAccepted && <span className="ml-2 text-green-600">✓</span>}
          </Button>
        </div>

        {isOpen && (
          <div className="mt-4 border-t pt-4">
            <div
              className="max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-md text-sm"
              onScroll={handleScroll}
              ref={scrollRef}
            >
              <pre className="whitespace-pre-wrap font-sans">
                {document.content}
              </pre>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                {!hasScrolled && "Scorri fino alla fine per procedere"}
                {hasScrolled && !canAccept && `Attendi ${Math.max(0, REQUIRED_SECONDS - dwellTime)}s per procedere`}
                {canAccept && "Ora puoi accettare il documento"}
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={isAccepted}
                  disabled={!canAccept}
                  onCheckedChange={handleAccept}
                />
                <label className={`text-sm ${canAccept ? 'text-gray-900' : 'text-gray-400'}`}>
                  Ho letto e accetto
                </label>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progresso lettura</span>
                <span>{Math.min(100, Math.round((hasScrolled ? 50 : 0) + Math.min((dwellTime / REQUIRED_SECONDS) * 50, 50)))}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (hasScrolled ? 50 : 0) + Math.min((dwellTime / REQUIRED_SECONDS) * 50, 50))}%`
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
