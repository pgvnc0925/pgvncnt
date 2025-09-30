"use client";
import { useEffect, useRef, useState } from "react";

type Props = {
  pdfUrl: string;
  dwellMs?: number;        // ms minimi di permanenza alla fine (default 3000)
  onReadyToAccept: () => void;
};

export default function LegalViewer({ pdfUrl, dwellMs = 3000, onReadyToAccept }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const [timerOk, setTimerOk] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
      if (nearBottom && !atBottom) {
        setAtBottom(true);
        setTimeout(() => setTimerOk(true), dwellMs);
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [atBottom, dwellMs]);

  useEffect(() => {
    if (atBottom && timerOk) onReadyToAccept();
  }, [atBottom, timerOk, onReadyToAccept]);

  return (
    <div className="border rounded-md h-96 overflow-auto" ref={wrapRef}>
      {/* Usa il viewer nativo del browser. Fallback: link download */}
      <object data={pdfUrl} type="application/pdf" className="w-full h-[36rem]">
        <div className="p-4">
          Il tuo browser non supporta l'anteprima PDF.{" "}
          <a className="text-blue-600 underline" href={pdfUrl} target="_blank" rel="noreferrer">
            Apri il PDF in una nuova scheda
          </a>.
        </div>
      </object>
    </div>
  );
}
