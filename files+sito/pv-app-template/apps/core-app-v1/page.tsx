'use client';

import { useState, useCallback } from 'react';
import { AppShell } from '@/components/layout';
import { ContextFrame, StepCard, Verdict, TensionMap, Accordion } from '@/components/blocks';
import { Input, Select, Scale, Textarea, CheckboxGroup } from '@/components/atomic';
import { useAppConfig, useAppSession, useCredits, useSubmitStep } from '@/hooks';
import { InputField, Step, UISchema, StructuredDossier } from '@/lib/types';
import { n8nClient } from '@/lib/api/n8nClient';
import coreAppUISchema from './ui-schema';

/**
 * CORE-APP PAGE
 *
 * Questo è il motore universale di rendering per TUTTE le app PV.
 * Legge ui-schema.ts → risolve il flusso → renderizza componenti → passa dossier a n8n.
 *
 * NON contiene business logic hardcoded.
 * NON contiene domande specifiche della app.
 * È puro rendering engine.
 */

export default function CoreAppPage() {
  const userId = 'user-123'; // TODO: auth provider
  const appId = 'core-app-v1';

  // Hook universali
  const { appConfig } = useAppConfig(appId);
  const { session, submitStep, completeSession } = useAppSession(appId, userId);
  const { useCredit, canAfford } = useCredits(userId);
  const { isSubmitting, validationErrors, submit } = useSubmitStep();

  // State locale
  const [currentStepId, setCurrentStepId] = useState('step-context');
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [verdictData, setVerdictData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ============================================
  // HELPER: Trova step dalla config
  // ============================================
  const getStep = (stepId: string): Step | undefined => {
    return coreAppUISchema.steps.find((s) => s.id === stepId);
  };

  // ============================================
  // HANDLER: Sottometti uno step
  // ============================================
  const handleStepSubmit = useCallback(
    async (response: Record<string, unknown>) => {
      const step = getStep(currentStepId);
      if (!step?.fields) return;

      const success = await submit(response, step.fields, async () => {
        // Salva risposte
        setResponses((prev) => ({ ...prev, ...response }));
        await submitStep(currentStepId, response);
      });

      if (!success) return;

      // Determina prossimo step
      const nextStepId = step.nextStepId || 'step-verdict';
      setCurrentStepId(nextStepId);
    },
    [currentStepId, submit, submitStep]
  );

  // ============================================
  // HANDLER: Genera verdetto (step finale)
  // ============================================
  const handleGenerateVerdict = useCallback(async () => {
    if (!appConfig || !session) return;

    // Controllo crediti
    if (!canAfford(appConfig.pricing.creditCost)) {
      alert('Crediti insufficienti');
      return;
    }

    try {
      setIsProcessing(true);
      await useCredit(appConfig.pricing.creditCost);

      // Costruisci dossier strutturato
      const dossier: StructuredDossier = {
        appId,
        sessionId: session.sessionId,
        userId,
        timestamp: new Date().toISOString(),
        context: {
          industry: (responses.industry as string) || 'unknown',
          market: (responses.marketGeography as string) || 'local',
          teamSize: (responses.teamSize as number) || 1,
          yearsInBusiness: (responses.yearsInBusiness as number) || 0,
          pricePositioning: 'medio',
        },
        goals: {
          declared: [(responses.biggestFrustration as string) || 'growth'],
          implicit: [(responses.mainFocus as string) || 'traffic'],
          conflicts: [],
        },
        constraints: {
          budget: 'limitato',
          team: `${responses.teamSize || 1} persone`,
          technicalSkills: 'moderato',
          timeframe: '3-6 mesi',
        },
        biasSignals: [
          responses.mainFocus === 'traffic' ? 'Focus eccessivo su traffico' : '',
          (responses.differentiation as number) < 40 ? 'Confusione su valore' : '',
          responses.acquisitionCost === 'unknown' ? 'Nessun tracciamento dati' : '',
        ].filter(Boolean),
        languagePatterns: [
          responses.valueProposition as string,
          responses.biggestFrustration as string,
        ].filter(Boolean) as string[],
        diagnosticFlags: {
          valueClarity: responses.differentiation,
          positioningMaturity: responses.differentiation ? 'early' : 'advanced',
          conversionRate: responses.conversionRate,
          retention: responses.clientRetention,
        },
        allResponses: responses,
      };

      // Manda a n8n per processing
      const result = await n8nClient.processAssessment({
        app_id: appId,
        session_id: session.sessionId,
        dossier,
      });

      if (result.success && result.verdict && result.tensionMap) {
        setVerdictData({
          verdict: result.verdict,
          tensionMap: result.tensionMap,
          dossier,
        });

        // Completa sessione nel DB
        await completeSession(
          result.verdict.description,
          result.tensionMap,
          dossier
        );
      } else {
        alert('Errore nel processing. Riprova.');
      }
    } catch (error) {
      console.error('Verdict generation error:', error);
      alert('Errore durante la generazione del verdetto');
    } finally {
      setIsProcessing(false);
    }
  }, [appConfig, session, responses, userId, appId, canAfford, useCredit, completeSession]);

  // ============================================
  // RENDER
  // ============================================

  const currentStep = getStep(currentStepId);

  // Se siamo al verdetto finale
  if (verdictData) {
    return (
      <AppShell
        appName="Core-App: Diagnosi Strategica"
        currentStep={coreAppUISchema.steps.length}
        totalSteps={coreAppUISchema.steps.length}
      >
        <div className="space-y-12">
          {/* VERDETTO SINGOLO */}
          <Verdict
            title={verdictData.verdict.title}
            description={verdictData.verdict.description}
            severity={verdictData.verdict.severity}
            actionRequired={true}
          />

          {/* TENSION MAP */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6">Mappa delle tensioni</h3>
            <TensionMap
              axes={verdictData.tensionMap.axes}
              summary={verdictData.tensionMap.summary}
              implications={verdictData.tensionMap.implications}
            />
          </div>

          {/* CTA PROSSIMO PASSO */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center space-y-4">
            <h4 className="font-semibold text-slate-900">Prossimo passo</h4>
            <p className="text-slate-700">
              Questa diagnosi è il punto di partenza. I nostri agenti stanno elaborando una
              strategia personalizzata per te.
            </p>
            <button className="pv-button-base bg-pv-primary text-white px-6 py-3">
              Visualizza la strategia completa (arriva domani)
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // Step normale di input
  if (!currentStep || currentStep.type === 'input') {
    const step = currentStep as Step;
    const stepIndex = coreAppUISchema.steps.findIndex((s) => s.id === currentStepId);
    const [stepResponse, setStepResponse] = useState<Record<string, unknown>>(
      responses[currentStepId] || {}
    );

    return (
      <AppShell
        appName="Core-App: Diagnosi Strategica"
        currentStep={stepIndex + 1}
        totalSteps={coreAppUISchema.steps.length}
      >
        <div className="space-y-8">
          {/* CONTEXT FRAME (solo primo step) */}
          {stepIndex === 0 && (
            <ContextFrame
              title="Diagnosi Strategica in 15 minuti"
              description="Ti faremo 13 domande sui tuoi 4 sistemi di business. Non cerchiamo risposte "corrette", ma honest insights per darti una diagnosi accurata."
              whatWellDo={[
                'Capire dove perdi energia',
                'Identificare il tuo vero problema',
                'Consigliarti i prossimi passi strategici',
              ]}
              whatWeWontDo={[
                'Venderti una soluzione preconfezionata',
                'Dire che la soluzione è "traffico" o "social media"',
              ]}
            />
          )}

          {/* STEP CARD CON INPUT */}
          <StepCard
            stepNumber={stepIndex + 1}
            totalSteps={coreAppUISchema.steps.length}
            title={step.title || 'Domanda'}
            description={step.description}
          >
            {/* Renderizza campi dinamicamente */}
            {step.fields?.map((field: InputField) => {
              const fieldValue = stepResponse[field.id] ?? '';
              const fieldError = validationErrors.find((e) => e.fieldId === field.id)?.message;

              return (
                <div key={field.id}>
                  {field.type === 'text' && (
                    <Input
                      id={field.id}
                      label={field.label}
                      value={fieldValue as string}
                      onChange={(val) => setStepResponse({ ...stepResponse, [field.id]: val })}
                      placeholder={field.placeholder}
                      required={field.required}
                      help={field.help}
                      error={fieldError}
                    />
                  )}

                  {field.type === 'select' && (
                    <Select
                      id={field.id}
                      label={field.label}
                      value={fieldValue as string}
                      onChange={(val) => setStepResponse({ ...stepResponse, [field.id]: val })}
                      options={field.options || []}
                      required={field.required}
                      help={field.help}
                      error={fieldError}
                    />
                  )}

                  {field.type === 'textarea' && (
                    <Textarea
                      id={field.id}
                      label={field.label}
                      value={fieldValue as string}
                      onChange={(val) => setStepResponse({ ...stepResponse, [field.id]: val })}
                      placeholder={field.placeholder}
                      required={field.required}
                      help={field.help}
                      error={fieldError}
                      rows={4}
                    />
                  )}

                  {field.type === 'scale' && (
                    <Scale
                      id={field.id}
                      label={field.label}
                      value={fieldValue as number}
                      onChange={(val) => setStepResponse({ ...stepResponse, [field.id]: val })}
                      min={field.min}
                      max={field.max}
                      leftLabel={field.help?.split('|')[0]}
                      rightLabel={field.help?.split('|')[1]}
                      help={field.help}
                      error={fieldError}
                    />
                  )}

                  {field.type === 'multiselect' && (
                    <CheckboxGroup
                      id={field.id}
                      label={field.label}
                      values={stepResponse[field.id] as string[]}
                      onChange={(vals) => setStepResponse({ ...stepResponse, [field.id]: vals })}
                      options={field.options || []}
                      required={field.required}
                      help={field.help}
                      error={fieldError}
                    />
                  )}
                </div>
              );
            })}
          </StepCard>

          {/* BOTTONE PROSSIMO STEP O VERDETTO */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                if (stepIndex > 0) {
                  setCurrentStepId(coreAppUISchema.steps[stepIndex - 1].id);
                }
              }}
              disabled={stepIndex === 0}
              className="pv-button-base border border-slate-300 text-slate-900 px-6 py-3 disabled:opacity-50"
            >
              ← Indietro
            </button>
            <button
              onClick={() => {
                if (step.nextStepId === 'step-verdict') {
                  handleGenerateVerdict();
                } else {
                  handleStepSubmit(stepResponse);
                }
              }}
              disabled={isSubmitting || isProcessing}
              className="pv-button-base bg-pv-primary text-white px-6 py-3 flex-1 disabled:opacity-50"
            >
              {isProcessing ? 'Generazione verdetto...' : 'Continua →'}
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // Fallback
  return <div>Step non trovato</div>;
}
