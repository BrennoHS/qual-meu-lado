"use client";

import { Check } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { voiceLabel, type useSpeech } from "@/lib/reel/use-speech";

const RATES = [
  { v: 0.85, label: "Devagar" },
  { v: 1, label: "Normal" },
  { v: 1.15, label: "Rápido" },
];

/** Escolher a voz (entre as instaladas no aparelho) e a velocidade. Preferência fica só neste navegador. */
export function VoiceSettings({ voice }: { voice: ReturnType<typeof useSpeech> }) {
  if (!voice.supported || voice.voices.length === 0) return null;
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Escolher voz e velocidade"
        className="grid h-11 w-11 place-items-center rounded-full border border-paper/40 bg-graphite/60 text-paper backdrop-blur hover:border-paper"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" strokeLinecap="round" />
          <circle cx="16" cy="6" r="2" />
          <circle cx="10" cy="12" r="2" />
          <circle cx="18" cy="18" r="2" />
        </svg>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="top" align="start" sideOffset={10} collisionPadding={12} className="gloss-pop z-[80] w-[min(21rem,calc(100vw-24px))] border border-paper/25 bg-graphite-3 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
          <p className="kicker text-paper">Voz</p>
          <div role="radiogroup" aria-label="Voz" className="mt-2 max-h-48 space-y-1 overflow-y-auto pr-1">
            {voice.voices.map((v) => (
              <button
                key={v.voiceURI}
                type="button"
                role="radio"
                aria-checked={voice.voiceUri === v.voiceURI}
                onClick={() => {
                  voice.chooseVoice(v.voiceURI);
                  voice.speak("Olá! É assim que eu leio as telas.");
                }}
                className={`flex min-h-10 w-full items-center gap-2 px-2 text-left text-sm ${voice.voiceUri === v.voiceURI ? "bg-paper text-graphite" : "text-paper/90 hover:bg-paper/10"}`}
              >
                <span aria-hidden className="w-4">{voice.voiceUri === v.voiceURI ? <Check aria-hidden className="inline-block h-4 w-4" strokeWidth={2} /> : null}</span>
                {voiceLabel(v)}
              </button>
            ))}
          </div>
          <p className="kicker mt-4 text-paper">Velocidade</p>
          <div role="radiogroup" aria-label="Velocidade" className="mt-2 grid grid-cols-3 gap-1">
            {RATES.map((r) => (
              <button
                key={r.v}
                type="button"
                role="radio"
                aria-checked={voice.rate === r.v}
                onClick={() => voice.setRate(r.v)}
                className={`min-h-10 border text-xs ${voice.rate === r.v ? "border-paper bg-paper text-graphite" : "border-paper/25 text-paper/90"}`}
              >
                {r.label}
              </button>
            ))}
          </div>
          {!voice.hasNatural && (
            <p className="mt-4 text-xs leading-snug text-ash">
              Achou a voz robótica? As vozes vêm do seu aparelho. No computador, o navegador <strong className="text-paper/90">Microsoft Edge</strong> tem vozes naturais em português
              (Francisca, Antonio, Thalita). No celular, instale ou atualize a voz em português nas configurações de “leitura em voz alta”.
            </p>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
