"use client";

import { useEffect, useMemo, useState } from "react";
import { evaluationQuestions } from "@/data/evaluation/questions";
import {
  computeScores,
  domainLabels,
  interestLabels,
  getRecommendedBooks,
} from "@/data/evaluation/scoring";
import { defaultBookCatalog } from "@/data/evaluation/book-catalog";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Input as UIInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Check, ChevronLeft, ChevronRight, Mail } from "lucide-react";

type AnswerMap = Record<string, number | number[]>;

function isAnswered(id: string, answers: AnswerMap, type: "single" | "multi") {
  const value = answers[id];
  if (type === "single") return typeof value === "number";
  return Array.isArray(value) && value.length > 0;
}

export function EvaluationForm() {
  const [stage, setStage] = useState<"intro" | "form" | "results">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recovering, setRecovering] = useState(false);

  const totalQuestions = evaluationQuestions.length;
  const currentQuestion = evaluationQuestions[currentIndex];

  const canContinue =
    stage === "intro" ||
    (stage === "form" &&
      isAnswered(currentQuestion.id, answers, currentQuestion.type));

  const completionPercent = useMemo(() => {
    const answeredCount = evaluationQuestions.filter((q) =>
      isAnswered(q.id, answers, q.type)
    ).length;
    return Math.round((answeredCount / totalQuestions) * 100);
  }, [answers, totalQuestions]);

  const scoreResult = useMemo(() => computeScores(answers), [answers]);
  const recommendations = useMemo(
    () => getRecommendedBooks(scoreResult, defaultBookCatalog),
    [scoreResult]
  );

  // Bootstrap session id and restore local answers
  useEffect(() => {
    if (typeof window === "undefined") return;
    const existingUuid = window.localStorage.getItem("pv_eval_uuid");
    const uuid = existingUuid || crypto.randomUUID();
    setSessionId(uuid);
    window.localStorage.setItem("pv_eval_uuid", uuid);

    const savedAnswers = window.localStorage.getItem("pv_eval_answers");
    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers);
        setAnswers(parsed);
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  // Persist answers locally
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("pv_eval_answers", JSON.stringify(answers));
  }, [answers]);

  const handleSelect = (optionIndex: number) => {
    if (currentQuestion.type === "single") {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
      return;
    }

    setAnswers((prev) => {
      const existing = Array.isArray(prev[currentQuestion.id])
        ? (prev[currentQuestion.id] as number[])
        : [];
      const already = existing.includes(optionIndex);
      const nextSelection = already
        ? existing.filter((i) => i !== optionIndex)
        : [...existing, optionIndex];
      return { ...prev, [currentQuestion.id]: nextSelection };
    });
  };

  const goNext = () => {
    if (stage === "intro") {
      setStage("form");
      return;
    }
    if (currentIndex === totalQuestions - 1) {
      setStage("results");
      return;
    }
    setCurrentIndex((i) => Math.min(i + 1, totalQuestions - 1));
  };

  const goBack = () => {
    if (stage === "intro") return;
    if (stage === "results") {
      setStage("form");
      setCurrentIndex(totalQuestions - 1);
      return;
    }
    if (currentIndex === 0) {
      setStage("intro");
      return;
    }
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setEmailSubmitted(true);
  };

  const saveRemote = async () => {
    if (!sessionId) return;
    setSaving(true);
    try {
      await fetch("/api/save-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: sessionId,
          answers,
          scores: scoreResult,
          email,
          name,
        }),
      });
    } catch (err) {
      console.error("saveRemote failed", err);
    } finally {
      setSaving(false);
    }
  };

  const restart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setStage("intro");
    setEmail("");
    setName("");
    setEmailSubmitted(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("pv_eval_answers");
    }
  };

  const recoverByEmail = async () => {
    if (!recoverEmail) return;
    setRecovering(true);
    try {
      const res = await fetch("/api/recover-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoverEmail }),
      });
      const data = await res.json();
      if (data?.ok && data?.data?.answers) {
        setAnswers(data.data.answers);
        if (data.data.email) setEmail(data.data.email);
        if (data.data.name) setName(data.data.name);
        setStage("form");
      }
    } catch (err) {
      console.error("recoverByEmail failed", err);
    } finally {
      setRecovering(false);
    }
  };

  const sendMagicLink = async () => {
    if (!email) return;
    try {
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/valutazione?uuid=${sessionId}`;
      await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
    } catch (err) {
      console.error("sendMagicLink failed", err);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(212,175,55,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.08),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)]" />

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_420px] gap-8">
          <div className="space-y-6">
            <Card className="glass-surface-strong border-2 border-white/70 shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl md:text-4xl font-bold text-primary">
                  Scopri i libri giusti per te
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  13 domande rapide, 2 minuti. Ricevi consigli personalizzati e
                  una guida di lettura per migliorare marketing e vendite.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {stage !== "intro" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        Domanda {currentIndex + 1} di {totalQuestions}
                      </span>
                      <span className="font-semibold text-primary">
                        {completionPercent}% completato
                      </span>
                    </div>
                    <Progress value={completionPercent} className="h-2" />
                  </div>
                )}

                {stage === "intro" && (
                  <div className="space-y-6">
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li>• Valutazione basata su comportamenti reali</li>
                      <li>• Ti suggeriamo 3–4 libri con motivazione</li>
                      <li>• Design coerente con il percorso PV</li>
                    </ul>
                    <Button size="lg" onClick={goNext} className="gap-2">
                      Inizia la valutazione
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Le risposte restano anonime finché non lasci la tua email.
                    </p>
                    <div className="rounded-xl border bg-white/70 p-4 space-y-3">
                      <p className="font-semibold text-foreground">
                        Hai già risposto? Recupera via email
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <UIInput
                          type="email"
                          placeholder="name@email.com"
                          value={recoverEmail}
                          onChange={(e) => setRecoverEmail(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={recoverByEmail}
                          disabled={recovering}
                        >
                          {recovering ? "Recupero..." : "Recupera"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recuperiamo l'ultima sessione salvata associata a questa email.
                      </p>
                    </div>
                  </div>
                )}

                {stage === "form" && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {currentQuestion.title}
                      </p>
                      <h2 className="text-2xl font-bold text-primary">
                        {currentQuestion.description}
                      </h2>
                    </div>

                    <div className="grid gap-3">
                      {currentQuestion.options.map((option, index) => {
                        const value = answers[currentQuestion.id];
                        const selected =
                          currentQuestion.type === "single"
                            ? value === index
                            : Array.isArray(value) &&
                              value.includes(index);

                        return (
                          <button
                            key={option.label}
                            onClick={() => handleSelect(index)}
                            className={`text-left rounded-xl border transition-all p-4 md:p-5 hover:shadow-md ${
                              selected
                                ? "border-secondary bg-secondary/10 shadow-lg"
                                : "border-border bg-white/70"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`h-5 w-5 rounded-full border flex items-center justify-center mt-1 ${
                                  selected
                                    ? "bg-secondary border-secondary text-primary"
                                    : "border-muted-foreground/30"
                                }`}
                              >
                                {selected && <Check className="h-3 w-3" />}
                              </div>
                              <div className="space-y-1">
                                <p className="font-semibold text-foreground">
                                  {option.label}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={goBack}
                        className="gap-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Indietro
                      </Button>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={goNext}
                        disabled={!canContinue}
                      >
                        {currentIndex === totalQuestions - 1
                          ? "Vai ai risultati"
                          : "Continua"}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {stage === "results" && (
                    <div className="space-y-6">
                      <div className="p-4 rounded-xl border bg-gradient-to-br from-primary/5 to-secondary/10 space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Risultati preliminari (rule-based locale)
                        </p>
                      <h3 className="text-xl font-bold text-primary">
                        Cluster: {scoreResult.maturity}
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div className="p-3 rounded-lg bg-white/70 border">
                          <p className="text-muted-foreground text-xs uppercase tracking-[0.1em]">
                            Dominio principale
                          </p>
                          <p className="font-semibold text-foreground">
                            {domainLabels[scoreResult.primaryDomain]}
                            {scoreResult.secondaryDomain
                              ? ` + ${domainLabels[scoreResult.secondaryDomain]}`
                              : ""}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/70 border">
                          <p className="text-muted-foreground text-xs uppercase tracking-[0.1em]">
                            Interesse principale
                          </p>
                          <p className="font-semibold text-foreground">
                            {interestLabels[scoreResult.primaryInterest]}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Collega qui l&apos;API di raccomandazione libri per
                        mostrare narrativa e 3–4 titoli in base a cluster +
                        dominio.
                      </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-lg font-bold text-primary">
                          Libri consigliati (3–5)
                        </h4>
                        <div className="grid gap-3">
                          {recommendations.map((rec) => (
                            <div
                              key={rec.id}
                              className="rounded-lg border bg-white/70 p-4 flex gap-4"
                            >
                              {rec.cover && (
                                <div className="relative h-20 w-14 flex-shrink-0 overflow-hidden rounded border">
                                  <Image
                                    src={rec.cover}
                                    alt={rec.title}
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="font-semibold text-foreground">
                                    {rec.title}
                                  </p>
                                  {rec.slug && (
                                    <a
                                      className="text-sm text-primary hover:underline"
                                      href={`/libri/${rec.slug}`}
                                    >
                                      Apri →
                                    </a>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {rec.reason}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-muted-foreground">
                          Riepilogo risposte (bozza)
                        </p>
                      <div className="grid gap-2 max-h-64 overflow-auto pr-1">
                        {evaluationQuestions.map((q) => {
                          const value = answers[q.id];
                          const labels =
                            value === undefined
                              ? "—"
                              : Array.isArray(value)
                              ? value.map((v) => q.options[v]?.label).join(", ")
                              : q.options[value]?.label;

                          return (
                            <div
                              key={q.id}
                              className="rounded-lg border bg-white/70 p-3"
                            >
                              <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                                {q.title}
                              </p>
                              <p className="font-medium text-foreground">
                                {labels || "—"}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-primary">
                        Ricevi i risultati via email
                      </h3>
                      <form
                        onSubmit={async (ev) => {
                          handleEmailSubmit(ev);
                          await saveRemote();
                          await sendMagicLink();
                        }}
                        className="space-y-3"
                      >
                        <div className="grid md:grid-cols-2 gap-3">
                          <Input
                            placeholder="Nome completo (opzionale)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                          <div className="relative">
                            <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                            <Input
                              required
                              type="email"
                              className="pl-9"
                              placeholder="name@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button type="submit" className="sm:w-auto w-full">
                            {saving ? "Salvataggio..." : "Invia e ricevi i libri consigliati"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="sm:w-auto w-full"
                            onClick={() => setStage("form")}
                          >
                            Rivedi risposte
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="sm:w-auto w-full"
                            onClick={saveRemote}
                            disabled={saving}
                          >
                            {saving ? "Salvataggio..." : "Riprendi più tardi"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="sm:w-auto w-full"
                            onClick={restart}
                          >
                            Ricomincia
                          </Button>
                        </div>
                        {emailSubmitted && (
                          <p className="text-sm text-green-600">
                            Perfetto! Salveremo le risposte e invieremo i libri
                            consigliati a breve.
                          </p>
                        )}
                      </form>
                      <p className="text-xs text-muted-foreground">
                        Non spam. Massimo 1 email a settimana con materiali PV.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="sticky top-24 border-primary/20 bg-white/90 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">
                  Che cos&apos;è questa valutazione?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Domande basate su comportamenti osservabili (vedi
                  PV_FORM_QUESTIONS_CORRECTED). I punteggi alimentano la
                  narrativa e i libri consigliati.
                </p>
                <ul className="space-y-2">
                  <li>• 13 domande, 1 sola a schermo</li>
                  <li>• Progress bar sempre visibile</li>
                  <li>• Navigazione avanti/indietro</li>
                  <li>• Email capture finale, opzionale all&apos;inizio</li>
                </ul>
                <p className="text-xs">
                  Collega il motore di scoring dal file
                  SCORING_MATRIX_DETAILED.md e la libreria libri quando pronta.
                </p>
              </CardContent>
            </Card>

            {stage === "form" && (
              <Card className="border-secondary/30 bg-secondary/5">
                <CardContent className="py-4 text-sm">
                  <p className="font-semibold text-secondary-foreground">
                    Stai rispondendo alla domanda {currentIndex + 1} di{" "}
                    {totalQuestions}.
                  </p>
                  <p className="text-muted-foreground">
                    Se chiudi la pagina adesso, ricomincerai dal principio.
                    Aggancia il salvataggio locale/UUID quando implementi il
                    backend.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
