// apps/onboarding/app/(public)/signup/legal/page.tsx
"use client";
import { useState } from "react";
import { LegalAccordion } from "@/suite/boilerplate/legal/components/LegalAccordion";

export default function SignupLegal() {
  const [tos, setTos] = useState(false);
  const [pri, setPri] = useState(false);
  const [dpa, setDpa] = useState(false);

  const allOk = tos && pri && dpa;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Termini e Privacy</h1>
      <LegalAccordion slug="tos" onAccepted={() => setTos(true)} />
      <LegalAccordion slug="privacy" onAccepted={() => setPri(true)} />
      <LegalAccordion slug="dpa" onAccepted={() => setDpa(true)} />
      <button className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-40" disabled={!allOk}>
        Continua
      </button>
    </div>
  );
}
