"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Leitura em voz alta com as vozes do próprio aparelho (Web Speech API).
 * Nada é enviado a servidores do site. A qualidade depende do aparelho:
 * escolhemos automaticamente a voz mais natural disponível em português
 * do Brasil, e a pessoa pode trocar a voz e a velocidade (preferência local).
 */

const PREF_KEY = "doislados:voice";
type Pref = { uri?: string; rate?: number };

const readPref = (): Pref => {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY) ?? "{}") as Pref;
  } catch {
    return {};
  }
};
const writePref = (p: Pref) => {
  try {
    localStorage.setItem(PREF_KEY, JSON.stringify(p));
  } catch {
    /* ignora */
  }
};

const isPt = (v: SpeechSynthesisVoice) => v.lang?.toLowerCase().replace("_", "-").startsWith("pt");
const isBr = (v: SpeechSynthesisVoice) => /pt-br/i.test(v.lang.replace("_", "-"));

/** Quanto mais alto, mais natural costuma soar. */
export function voiceScore(v: SpeechSynthesisVoice): number {
  const n = v.name;
  let s = isBr(v) ? 10 : 0;
  if (/natural|neural|online|premium|enhanced|aprimorad/i.test(n)) s += 100; // Edge (Francisca/Antonio/Thalita), Apple aprimoradas
  if (/francisca|antonio|thalita|luciana|felipe|fernanda/i.test(n)) s += 40;
  if (/google/i.test(n)) s += 25;
  if (/microsoft/i.test(n) && !/online|natural/i.test(n)) s -= 30; // vozes antigas do Windows (bem robóticas)
  if (/espeak|compact/i.test(n)) s -= 60;
  return s;
}

/** Nome amigável: "Microsoft Francisca Online (Natural) - Portuguese (Brazil)" → "Francisca (natural)". */
export function voiceLabel(v: SpeechSynthesisVoice): string {
  const base = v.name
    .replace(/^(Microsoft|Google|Apple)\s+/i, "")
    .replace(/\s*[-–]\s*Portuguese.*$/i, "")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/\bOnline\b/i, "")
    .trim();
  const tags = [/natural|neural|premium|enhanced|aprimorad/i.test(v.name) ? "natural" : "", /google/i.test(v.name) ? "Google" : "", isBr(v) ? "" : v.lang].filter(Boolean);
  return `${base || v.name}${tags.length ? ` (${tags.join(", ")})` : ""}`;
}

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceUri, setVoiceUri] = useState<string | null>(null);
  const [rate, setRateState] = useState(1);
  const token = useRef(0);
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  const rateRef = useRef(1);

  useEffect(() => {
    const ok = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setSupported(ok);
    if (!ok) return;
    const pref = readPref();
    if (pref.rate) {
      rateRef.current = pref.rate;
      setRateState(pref.rate);
    }
    const load = () => {
      const pt = window.speechSynthesis.getVoices().filter(isPt).sort((a, b) => voiceScore(b) - voiceScore(a));
      setVoices(pt);
      const chosen = pt.find((v) => v.voiceURI === pref.uri) ?? pt[0] ?? null;
      voice.current = chosen;
      setVoiceUri(chosen?.voiceURI ?? null);
    };
    load();
    window.speechSynthesis.addEventListener?.("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    token.current++;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!("speechSynthesis" in window)) return;
    const my = ++token.current;
    const synth = window.speechSynthesis;
    synth.cancel();
    // Frases de até ~220 caracteres (alguns navegadores cortam falas longas).
    const sentences = text.replace(/\s+/g, " ").match(/[^.!?…]+[.!?…]*\s*/g) ?? [text];
    const chunks: string[] = [];
    for (const s of sentences) {
      const last = chunks[chunks.length - 1];
      if (last && last.length + s.length < 220) chunks[chunks.length - 1] = last + s;
      else chunks.push(s);
    }
    setSpeaking(true);
    chunks.forEach((c, i) => {
      const u = new SpeechSynthesisUtterance(c.trim());
      u.lang = voice.current?.lang ?? "pt-BR";
      if (voice.current) u.voice = voice.current;
      u.rate = rateRef.current;
      if (i === chunks.length - 1) {
        u.onend = () => {
          if (token.current !== my) return;
          setSpeaking(false);
          onEnd?.();
        };
      }
      u.onerror = () => {
        if (token.current === my) setSpeaking(false);
      };
      synth.speak(u);
    });
  }, []);

  const chooseVoice = useCallback((uri: string) => {
    const v = window.speechSynthesis.getVoices().find((x) => x.voiceURI === uri) ?? null;
    voice.current = v;
    setVoiceUri(v?.voiceURI ?? null);
    writePref({ ...readPref(), uri });
  }, []);

  const setRate = useCallback((r: number) => {
    rateRef.current = r;
    setRateState(r);
    writePref({ ...readPref(), rate: r });
  }, []);

  /** Há alguma voz realmente natural neste aparelho? (para sugerir alternativas) */
  const hasNatural = voices.some((v) => voiceScore(v) >= 100);

  return { supported, speaking, speak, stop, voices, voiceUri, chooseVoice, rate, setRate, hasNatural };
}
